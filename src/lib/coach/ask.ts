/**
 * One question to the coach, end to end (spec coach §4.5).
 *
 * Worst case three calls (answer, repair, rewrite); nominal case one. Each
 * extra call exists for a reason the user would otherwise see: an unreadable
 * answer, or a sentence that blames them.
 */
import { distressIn, forbiddenWordsIn } from '@/lib/coach/guard'
import type { CoachPersona } from '@/lib/coach/personas'
import { coachUserPrompt, repairPrompt, rewritePrompt } from '@/lib/coach/prompt'
import { parseCoachReply } from '@/lib/coach/schema'
import type { CoachDigest, CoachReply, DistressKind } from '@/lib/coach/types'
import {
  LlmError,
  PROVIDERS,
  postCompletion,
  type CompletionOptions,
  type ConfiguredProvider,
} from '@/lib/llm/client'
import type { CoachMessage, VisionProviderId } from '@/types/models'

/**
 * Warmer than an extraction, and a short think: a coach answer is a few
 * sentences, and every reasoning token comes out of the same budget.
 */
export const COACH_COMPLETION: CompletionOptions = {
  temperature: 0.7,
  maxTokens: 2048,
  reasoningEffort: 'low',
}

export interface AskInput {
  persona: CoachPersona
  question: string
  digest: CoachDigest
  history: CoachMessage[]
}

export type CoachOutcome =
  | { kind: 'reply'; reply: CoachReply; providerId: VisionProviderId; rewrites: number }
  | { kind: 'distress'; distress: DistressKind }
  | { kind: 'fallback'; providerId: VisionProviderId }

/** Everything the user will read, so the guard checks exactly that. */
function replyText(reply: CoachReply): string {
  return [reply.constat, reply.suggestion?.titre, reply.suggestion?.detail, reply.question]
    .filter(Boolean)
    .join('\n')
}

function historyMessages(history: CoachMessage[]): unknown[] {
  return history.flatMap((message) => {
    // A fixed answer was never the model's: replaying it would teach it a
    // voice and a set of resources it did not choose.
    if (message.synthetic) return []
    if (message.role === 'user' && message.text) return [{ role: 'user', content: message.text }]
    if (message.role === 'coach' && message.reply) {
      // Replayed in the shape the prompt asks for today, so an old answer does
      // not teach the model the key it used to be asked for.
      const { constat, ...rest } = message.reply
      return [{ role: 'assistant', content: JSON.stringify({ reponse: constat, ...rest }) }]
    }
    return []
  })
}

async function askProvider(
  provider: ConfiguredProvider,
  messages: unknown[],
  fetchImpl: typeof fetch,
): Promise<CoachOutcome> {
  let useFallbackModel = false
  const call = (conversation: unknown[]) =>
    postCompletion(
      provider.id,
      provider.settings,
      conversation,
      fetchImpl,
      useFallbackModel,
      'text',
      COACH_COMPLETION,
    )

  let first: string
  try {
    first = await call(messages)
  } catch (error) {
    // Same policy as the meal reader: a stale built-in default earns one retry
    // on the backup, a model the user typed is never second-guessed.
    const retryable =
      error instanceof LlmError &&
      error.kind === 'model' &&
      !provider.settings.textModel?.trim() &&
      Boolean(PROVIDERS[provider.id].fallbackTextModel)
    if (!retryable) throw error
    useFallbackModel = true
    first = await call(messages)
  }

  let answered = first
  let reply = parseCoachReply(first)
  if (!reply) {
    answered = await call([
      ...messages,
      { role: 'assistant', content: first },
      { role: 'user', content: repairPrompt(first) },
    ])
    reply = parseCoachReply(answered)
    if (!reply) throw new LlmError('bad_response', 'Réponse illisible', provider.id)
  }

  const words = forbiddenWordsIn(replyText(reply))
  if (words.length === 0) return { kind: 'reply', reply, providerId: provider.id, rewrites: 0 }

  const rewritten = parseCoachReply(
    await call([
      ...messages,
      { role: 'assistant', content: answered },
      { role: 'user', content: rewritePrompt(words) },
    ]),
  )
  if (rewritten && forbiddenWordsIn(replyText(rewritten)).length === 0) {
    return { kind: 'reply', reply: rewritten, providerId: provider.id, rewrites: 1 }
  }
  // Still blaming after being told which words blame: the user gets a neutral
  // line and the model's sentence goes nowhere.
  return { kind: 'fallback', providerId: provider.id }
}

export async function askCoach(
  providers: ConfiguredProvider[],
  input: AskInput,
  fetchImpl: typeof fetch = fetch,
): Promise<CoachOutcome> {
  // Before anything else, providers included: a person in distress must get an
  // answer even with no key configured, and their words must not leave.
  const distress = distressIn(input.question)
  if (distress) return { kind: 'distress', distress }

  if (providers.length === 0) throw new LlmError('auth', 'Aucun service configuré')

  const messages: unknown[] = [
    { role: 'system', content: input.persona.systemPrompt },
    ...historyMessages(input.history),
    { role: 'user', content: coachUserPrompt(JSON.stringify(input.digest), input.question) },
  ]

  let last: unknown = null
  for (const provider of providers) {
    try {
      return await askProvider(provider, messages, fetchImpl)
    } catch (error) {
      last = error
    }
  }
  throw last instanceof LlmError ? last : new LlmError('network', 'Coach injoignable')
}
