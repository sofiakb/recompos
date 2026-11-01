/**
 * One turn of the conversation with the coach (spec coach §4.5, décision n°34).
 *
 * The answer is plain text, as in any chat. Nominal case one call; a second one
 * only when the answer blames the user, and if the rewrite still does, a neutral
 * line replaces it — the model's sentence goes nowhere.
 */
import { distressIn, forbiddenWordsIn } from '@/lib/coach/guard'
import type { CoachPersona } from '@/lib/coach/personas'
import { rewritePrompt } from '@/lib/coach/prompt'
import type { CoachDigest, CoachReply, DistressKind } from '@/lib/coach/types'
import {
  LlmError,
  PROVIDERS,
  postCompletion,
  type CompletionOptions,
  type ConfiguredProvider,
} from '@/lib/llm/client'
import type { CoachMessage, VisionProviderId } from '@/types/models'

/** How many past lines the model sees: enough to follow a real conversation. */
export const HISTORY_LINES = 20

/** Longest answer kept: a chat message, not an essay. */
export const MAX_ANSWER_LENGTH = 1200

/**
 * Warm enough to sound like a person, short thinking: every reasoning token
 * comes out of the same budget, and a chat answer is a few sentences. JSON mode
 * is off whatever the user types.
 */
export const COACH_COMPLETION: CompletionOptions = {
  temperature: 0.8,
  maxTokens: 2048,
  reasoningEffort: 'low',
  jsonMode: false,
}

export interface AskInput {
  persona: CoachPersona
  question: string
  digest: CoachDigest
  history: CoachMessage[]
}

export type CoachOutcome =
  | { kind: 'reply'; text: string; providerId: VisionProviderId; rewrites: number }
  | { kind: 'distress'; distress: DistressKind }
  | { kind: 'fallback'; providerId: VisionProviderId }

/** An answer from before décision n°34, flattened back into what was said. */
function legacyText(reply: CoachReply): string {
  return [reply.constat, reply.suggestion?.detail, reply.question].filter(Boolean).join(' ')
}

function historyMessages(history: CoachMessage[]): unknown[] {
  return history.flatMap((message) => {
    // A fixed answer was never the model's: replaying it would teach it a
    // voice and a set of resources it did not choose.
    if (message.synthetic) return []
    if (message.role === 'user' && message.text) return [{ role: 'user', content: message.text }]
    if (message.role === 'coach') {
      const content = message.text ?? (message.reply ? legacyText(message.reply) : '')
      return content ? [{ role: 'assistant', content }] : []
    }
    return []
  })
}

/**
 * Plain text, tidied: models sometimes wrap a chat line in quotes or sprinkle
 * markdown the bubble would show as literal asterisks.
 */
export function cleanAnswer(raw: string): string {
  return raw
    .trim()
    .replace(/^"(.*)"$/s, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/^#+\s*/gm, '')
    .slice(0, MAX_ANSWER_LENGTH)
    .trim()
}

async function askProvider(
  provider: ConfiguredProvider,
  messages: unknown[],
  fetchImpl: typeof fetch,
): Promise<CoachOutcome> {
  let useFallbackModel = false
  const call = async (conversation: unknown[]) =>
    cleanAnswer(
      await postCompletion(
        provider.id,
        provider.settings,
        conversation,
        fetchImpl,
        useFallbackModel,
        'text',
        COACH_COMPLETION,
      ),
    )

  let answer: string
  try {
    answer = await call(messages)
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
    answer = await call(messages)
  }
  if (!answer) throw new LlmError('bad_response', 'Réponse vide', provider.id)

  const words = forbiddenWordsIn(answer)
  if (words.length === 0)
    return { kind: 'reply', text: answer, providerId: provider.id, rewrites: 0 }

  const rewritten = await call([
    ...messages,
    { role: 'assistant', content: answer },
    { role: 'user', content: rewritePrompt(words) },
  ])
  if (rewritten && forbiddenWordsIn(rewritten).length === 0) {
    return { kind: 'reply', text: rewritten, providerId: provider.id, rewrites: 1 }
  }
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
    { role: 'system', content: input.persona.systemPrompt(input.digest) },
    ...historyMessages(input.history),
    { role: 'user', content: input.question.trim() },
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
