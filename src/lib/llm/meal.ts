/**
 * Reading a meal, whatever it arrives as.
 *
 * Both modalities share one system prompt, one JSON shape and one parser: a text
 * model lies in exactly the same ways a vision model does, so nothing crossing
 * this boundary is cast — `parseAnalysis` is the only door in.
 */
import {
  LlmError,
  postCompletion,
  fitsInRequest,
  PROVIDERS,
  type ConfiguredProvider,
} from '@/lib/llm/client'
import {
  hintPrompt,
  MEAL_PHOTO_SYSTEM_PROMPT,
  MEAL_PHOTO_USER_PROMPT,
  MEAL_TEXT_SYSTEM_PROMPT,
  mealTextUserPrompt,
  repairPrompt,
} from '@/lib/vision/prompt'
import { parseAnalysis, type MealAnalysis } from '@/lib/vision/schema'
import type { VisionProviderId } from '@/types/models'

export interface AnalyseInput {
  /** `data:image/webp;base64,…` — the bytes travel in the request, never hosted. */
  dataUrl: string
  /** Optional nudge from the user, e.g. « le riz est complet ». */
  hint?: string
}

function messageContent(input: AnalyseInput) {
  const text = input.hint?.trim()
    ? `${MEAL_PHOTO_USER_PROMPT}\n\n${hintPrompt(input.hint)}`
    : MEAL_PHOTO_USER_PROMPT
  return [
    { type: 'text', text },
    { type: 'image_url', image_url: { url: input.dataUrl } },
  ]
}

/**
 * One provider, with a single repair attempt.
 *
 * The repair is worth its cost: a model that wrapped its JSON in a sentence
 * almost always complies when handed back its own output, and the alternative
 * is telling the user their meal failed over a stray « Voici ».
 */
export async function analysePhotoWithProvider(
  provider: ConfiguredProvider,
  input: AnalyseInput,
  fetchImpl: typeof fetch = fetch,
): Promise<MealAnalysis> {
  const messages: unknown[] = [
    { role: 'system', content: MEAL_PHOTO_SYSTEM_PROMPT },
    { role: 'user', content: messageContent(input) },
  ]

  if (!fitsInRequest(input.dataUrl)) {
    throw new LlmError('too_large', 'Photo trop lourde pour ce service', provider.id)
  }

  let useFallbackModel = false
  let first: string
  try {
    first = await postCompletion(provider.id, provider.settings, messages, fetchImpl)
  } catch (error) {
    // Spelled out rather than borrowed from the transport: the retry policy is
    // the reader's call, not the transport's, and the text path below makes the
    // same judgement against its own model field.
    const retryable =
      error instanceof LlmError &&
      error.kind === 'model' &&
      !provider.settings.model?.trim() &&
      Boolean(PROVIDERS[provider.id].fallbackModel)
    if (!retryable) throw error
    useFallbackModel = true
    first = await postCompletion(provider.id, provider.settings, messages, fetchImpl, true)
  }

  const parsed = parseAnalysis(first)
  if (parsed) return parsed

  const repaired = await postCompletion(
    provider.id,
    provider.settings,
    [
      ...messages,
      { role: 'assistant', content: first },
      { role: 'user', content: repairPrompt(first) },
    ],
    fetchImpl,
    useFallbackModel,
  )
  const second = parseAnalysis(repaired)
  if (second) return second
  throw new LlmError('bad_response', 'Réponse illisible', provider.id)
}

export interface AnalyseOutcome {
  analysis: MealAnalysis
  providerId: VisionProviderId
}

/**
 * Walks the chain until one provider answers.
 *
 * An auth failure does not stop the walk: a stale key on the first provider is
 * exactly the case a second one exists for. The last error is what surfaces, so
 * the message the user reads describes the provider that actually ran last.
 */
export async function analyseMealPhoto(
  providers: ConfiguredProvider[],
  input: AnalyseInput,
  fetchImpl: typeof fetch = fetch,
): Promise<AnalyseOutcome> {
  if (providers.length === 0) {
    throw new LlmError('auth', 'Aucun service configuré')
  }
  let last: unknown = null
  for (const provider of providers) {
    try {
      const analysis = await analysePhotoWithProvider(provider, input, fetchImpl)
      return { analysis, providerId: provider.id }
    } catch (error) {
      last = error
    }
  }
  throw last instanceof LlmError ? last : new LlmError('network', 'Analyse impossible')
}

/**
 * One provider, reading a written meal, with a single repair attempt.
 *
 * Deliberately the same shape as the photo path: same system rules, same JSON
 * contract, same parser, same one retry. The only difference is that there is no
 * image to weigh, so no size ceiling to check.
 */
export async function analyseTextWithProvider(
  provider: ConfiguredProvider,
  description: string,
  fetchImpl: typeof fetch = fetch,
): Promise<MealAnalysis> {
  const messages: unknown[] = [
    { role: 'system', content: MEAL_TEXT_SYSTEM_PROMPT },
    { role: 'user', content: mealTextUserPrompt(description) },
  ]

  let useFallbackModel = false
  let first: string
  try {
    first = await postCompletion(provider.id, provider.settings, messages, fetchImpl, false, 'text')
  } catch (error) {
    const retryable =
      error instanceof LlmError &&
      error.kind === 'model' &&
      !provider.settings.textModel?.trim() &&
      Boolean(PROVIDERS[provider.id].fallbackTextModel)
    if (!retryable) throw error
    useFallbackModel = true
    first = await postCompletion(provider.id, provider.settings, messages, fetchImpl, true, 'text')
  }

  const parsed = parseAnalysis(first)
  if (parsed) return parsed

  const repaired = await postCompletion(
    provider.id,
    provider.settings,
    [
      ...messages,
      { role: 'assistant', content: first },
      { role: 'user', content: repairPrompt(first) },
    ],
    fetchImpl,
    useFallbackModel,
    'text',
  )
  const second = parseAnalysis(repaired)
  if (second) return second
  throw new LlmError('bad_response', 'Réponse illisible', provider.id)
}

/**
 * Walks the chain until one provider answers.
 *
 * Same policy as the photo chain: an auth failure does not stop the walk, and
 * the last error is what surfaces.
 */
export async function analyseMealText(
  providers: ConfiguredProvider[],
  description: string,
  fetchImpl: typeof fetch = fetch,
): Promise<AnalyseOutcome> {
  if (providers.length === 0) {
    throw new LlmError('auth', 'Aucun service configuré')
  }
  let last: unknown = null
  for (const provider of providers) {
    try {
      const analysis = await analyseTextWithProvider(provider, description, fetchImpl)
      return { analysis, providerId: provider.id }
    } catch (error) {
      last = error
    }
  }
  throw last instanceof LlmError ? last : new LlmError('network', 'Analyse impossible')
}
