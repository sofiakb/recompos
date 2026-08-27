/**
 * Vision providers, all speaking the OpenAI chat-completions dialect.
 *
 * There is no server (PRD décision n°5), so the request goes straight from the
 * page to the provider with a key the user typed into Settings. That key is
 * never in the bundle and never in git — which is the whole reason a build-time
 * key was refused: static hosting hands the bundle to anyone who asks.
 *
 * Several providers can be configured at once. They are tried in order and the
 * first valid answer wins: a rate limit or an outage on one is then a pause of a
 * few seconds rather than a lost meal.
 */
import { hintPrompt, MEAL_SYSTEM_PROMPT, MEAL_USER_PROMPT, repairPrompt } from '@/lib/vision/prompt'
import { parseAnalysis, type MealAnalysis } from '@/lib/vision/schema'
import type { VisionProviderId, VisionProviderSettings } from '@/types/models'

export interface ProviderDefinition {
  id: VisionProviderId
  label: string
  baseUrl: string
  /** Empty means the user must name one; the provider is skipped until they do. */
  defaultModel: string
  /**
   * Tried once when the default model turns out not to exist.
   *
   * Hosted model ids are renamed and retired without warning, and a build that
   * pins one is a build that stops working on someone else's schedule.
   */
  fallbackModel?: string
  /** Where the user goes to create a key. */
  keyUrl: string
  /** `custom` asks for its own endpoint; the hosted ones do not. */
  needsBaseUrl: boolean
}

export const PROVIDERS: Record<VisionProviderId, ProviderDefinition> = {
  groq: {
    id: 'groq',
    label: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'qwen/qwen3.8-27b',
    fallbackModel: 'qwen/qwen3.6-27b',
    keyUrl: 'https://console.groq.com/keys',
    needsBaseUrl: false,
  },
  openrouter: {
    id: 'openrouter',
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    // No default on purpose: OpenRouter's catalogue is too wide to guess a
    // vision model that will still exist next month. Naming the model is the
    // price of using it, and an unnamed provider stays out of the chain.
    defaultModel: '',
    keyUrl: 'https://openrouter.ai/keys',
    needsBaseUrl: false,
  },
  custom: {
    id: 'custom',
    label: 'Endpoint personnalisé',
    baseUrl: '',
    defaultModel: '',
    keyUrl: '',
    needsBaseUrl: true,
  },
}

/** Order the chain is attempted in, cheapest and fastest first. */
export const VISION_PROVIDER_ORDER: VisionProviderId[] = ['groq', 'openrouter', 'custom']

export type VisionErrorKind =
  | 'auth'
  | 'rate_limit'
  | 'network'
  | 'server'
  | 'bad_response'
  /** The endpoint answered, but does not know that model. */
  | 'model'
  /** The image would push the request past the documented ceiling. */
  | 'too_large'

export class VisionError extends Error {
  constructor(
    readonly kind: VisionErrorKind,
    message: string,
    readonly providerId?: VisionProviderId,
  ) {
    super(message)
    this.name = 'VisionError'
  }
}

export interface AnalyseInput {
  /** `data:image/webp;base64,…` — the bytes travel in the request, never hosted. */
  dataUrl: string
  /** Optional nudge from the user, e.g. « le riz est complet ». */
  hint?: string
}

/**
 * True when the encoded image is small enough to send.
 *
 * A meal photo capped at 1024 px lands two orders of magnitude under the limit,
 * so this never fires in practice — but « never in practice » is exactly the
 * check worth having when the alternative is a 400 the user has to interpret.
 */
export function fitsInRequest(dataUrl: string): boolean {
  return dataUrl.length + REQUEST_OVERHEAD_BYTES <= MAX_REQUEST_BYTES
}

export interface ConfiguredProvider {
  id: VisionProviderId
  settings: VisionProviderSettings
}

const REQUEST_TIMEOUT_MS = 45_000
/**
 * Double the documented default of 1024, which the documentation itself invites
 * for anything demanding: these models reason before answering and those tokens
 * come out of this budget, so a plate with six items on it can run a truncated
 * — therefore unparseable — completion at the default.
 *
 * The image is charged separately, on the input side: 2048 tokens per image.
 */
const MAX_TOKENS = 2048

/**
 * Hard ceiling documented for a request carrying an image: past it the provider
 * answers 400. Checked before sending so the failure names the real cause
 * instead of arriving as a generic server error.
 */
export const MAX_REQUEST_BYTES = 20 * 1024 * 1024

/** Headroom for the prompt, the headers and the JSON framing around the image. */
const REQUEST_OVERHEAD_BYTES = 64 * 1024

export function resolveEndpoint(
  id: VisionProviderId,
  settings: VisionProviderSettings,
  useFallbackModel = false,
): { url: string; model: string } | null {
  const definition = PROVIDERS[id]
  const baseUrl = (definition.needsBaseUrl ? settings.baseUrl : definition.baseUrl)?.replace(
    /\/+$/,
    '',
  )
  const chosen = settings.model?.trim()
  // A model the user typed is never second-guessed: the fallback exists for the
  // built-in default going stale, not to override a deliberate choice.
  const model = chosen || (useFallbackModel ? definition.fallbackModel : definition.defaultModel)
  if (!baseUrl || !model) return null
  return { url: `${baseUrl}/chat/completions`, model }
}

/** True when the built-in default failed and a backup is worth one retry. */
function hasFallbackModel(id: VisionProviderId, settings: VisionProviderSettings): boolean {
  return !settings.model?.trim() && Boolean(PROVIDERS[id].fallbackModel)
}

/** Providers with a key, in chain order. */
export function configuredProviders(
  providers: Partial<Record<VisionProviderId, VisionProviderSettings>> | undefined,
): ConfiguredProvider[] {
  if (!providers) return []
  return VISION_PROVIDER_ORDER.flatMap((id) => {
    const settings = providers[id]
    if (!settings || !settings.enabled || !settings.apiKey.trim()) return []
    if (!resolveEndpoint(id, settings)) return []
    return [{ id, settings }]
  })
}

/**
 * Whether the conversation is allowed to ask for JSON mode.
 *
 * These platforms reject `response_format: json_object` unless the word « json »
 * appears somewhere in the messages — a guard against asking for a shape the
 * prompt never described. Rather than trusting every call site to remember, the
 * flag is derived from the messages themselves: a prompt that never says JSON
 * simply does not get JSON mode, and gets an answer instead of a 400.
 */
export function mentionsJson(messages: unknown[]): boolean {
  const texts: string[] = []
  for (const message of messages) {
    const content = (message as { content?: unknown }).content
    if (typeof content === 'string') {
      texts.push(content)
    } else if (Array.isArray(content)) {
      for (const part of content) {
        const text = (part as { text?: unknown }).text
        if (typeof text === 'string') texts.push(text)
      }
    }
  }
  return texts.some((text) => /json/i.test(text))
}

function messageContent(input: AnalyseInput) {
  const text = input.hint?.trim()
    ? `${MEAL_USER_PROMPT}\n\n${hintPrompt(input.hint)}`
    : MEAL_USER_PROMPT
  return [
    { type: 'text', text },
    { type: 'image_url', image_url: { url: input.dataUrl } },
  ]
}

async function postCompletion(
  id: VisionProviderId,
  settings: VisionProviderSettings,
  messages: unknown[],
  fetchImpl: typeof fetch,
  useFallbackModel = false,
): Promise<string> {
  const endpoint = resolveEndpoint(id, settings, useFallbackModel)
  if (!endpoint) throw new VisionError('bad_response', 'Provider mal configuré', id)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  let response: Response
  try {
    response = await fetchImpl(endpoint.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: endpoint.model,
        messages,
        // The documented range for this model is 0.5–0.7, lower being the more
        // consistent end. Reading a plate is an extraction task, not a creative
        // one, so it sits at the bottom of the range — and not below it, which
        // is outside what the model is documented to handle well.
        temperature: 0.5,
        // The OpenAI-compatible spelling the current provider docs use;
        // `max_tokens` is the deprecated alias.
        max_completion_tokens: MAX_TOKENS,
        ...(mentionsJson(messages) ? { response_format: { type: 'json_object' } } : {}),
      }),
      signal: controller.signal,
    })
  } catch {
    // An abort, a DNS failure and a CORS rejection all land here identically —
    // the browser deliberately hides which. « Réseau » is the honest label.
    throw new VisionError('network', 'Pas de réponse du service', id)
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    if (response.status === 401 || response.status === 403) {
      throw new VisionError('auth', 'Clé refusée', id)
    }
    if (response.status === 429) throw new VisionError('rate_limit', 'Quota atteint', id)
    // A retired or misspelled model id answers 404 with a body naming it. Kept
    // apart from a server fault because it is the user's to fix — and because a
    // built-in default going stale earns one automatic retry on the backup.
    if (response.status === 404 || /model_not_found|does not exist/i.test(detail)) {
      throw new VisionError('model', `Modèle inconnu : ${endpoint.model}`, id)
    }
    throw new VisionError(
      'server',
      `Erreur ${response.status}${detail ? ` — ${detail.slice(0, 120)}` : ''}`,
      id,
    )
  }

  const payload = (await response.json().catch(() => null)) as {
    choices?: Array<{ message?: { content?: unknown } }>
  } | null
  const content = payload?.choices?.[0]?.message?.content
  if (typeof content !== 'string' || !content.trim()) {
    throw new VisionError('bad_response', 'Réponse vide', id)
  }
  return content
}

/**
 * One provider, with a single repair attempt.
 *
 * The repair is worth its cost: a model that wrapped its JSON in a sentence
 * almost always complies when handed back its own output, and the alternative
 * is telling the user their meal failed over a stray « Voici ».
 */
export async function analyseWithProvider(
  provider: ConfiguredProvider,
  input: AnalyseInput,
  fetchImpl: typeof fetch = fetch,
): Promise<MealAnalysis> {
  const messages: unknown[] = [
    { role: 'system', content: MEAL_SYSTEM_PROMPT },
    { role: 'user', content: messageContent(input) },
  ]

  if (!fitsInRequest(input.dataUrl)) {
    throw new VisionError('too_large', 'Photo trop lourde pour ce service', provider.id)
  }

  let useFallbackModel = false
  let first: string
  try {
    first = await postCompletion(provider.id, provider.settings, messages, fetchImpl)
  } catch (error) {
    const retryable =
      error instanceof VisionError &&
      error.kind === 'model' &&
      hasFallbackModel(provider.id, provider.settings)
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
  throw new VisionError('bad_response', 'Réponse illisible', provider.id)
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
export async function analyseMeal(
  providers: ConfiguredProvider[],
  input: AnalyseInput,
  fetchImpl: typeof fetch = fetch,
): Promise<AnalyseOutcome> {
  if (providers.length === 0) {
    throw new VisionError('auth', 'Aucun service configuré')
  }
  let last: unknown = null
  for (const provider of providers) {
    try {
      const analysis = await analyseWithProvider(provider, input, fetchImpl)
      return { analysis, providerId: provider.id }
    } catch (error) {
      last = error
    }
  }
  throw last instanceof VisionError ? last : new VisionError('network', 'Analyse impossible')
}

/**
 * Cheap round-trip used by the « tester la clé » button.
 *
 * Text-only and two tokens wide: it proves the key, the endpoint and — the part
 * that cannot be checked from anywhere but a browser — that the provider answers
 * a cross-origin request from this page at all.
 */
export async function testProvider(
  id: VisionProviderId,
  settings: VisionProviderSettings,
  fetchImpl: typeof fetch = fetch,
): Promise<{ ok: true; model: string } | { ok: false; kind: VisionErrorKind; message: string }> {
  const endpoint = resolveEndpoint(id, settings)
  if (!endpoint) return { ok: false, kind: 'bad_response', message: 'Endpoint ou modèle manquant' }
  // Says « JSON » on purpose: the probe should exercise the same JSON mode the
  // real requests use, so a platform that refuses it fails here rather than on
  // the user's first plate.
  const probe = [{ role: 'user', content: 'Réponds en JSON avec exactement : {"ok":true}' }]
  try {
    await postCompletion(id, settings, probe, fetchImpl)
    return { ok: true, model: endpoint.model }
  } catch (error) {
    if (error instanceof VisionError && error.kind === 'model' && hasFallbackModel(id, settings)) {
      // Reports the model that actually answered, so the settings screen never
      // names one the real requests will not use.
      try {
        await postCompletion(id, settings, probe, fetchImpl, true)
        const backup = resolveEndpoint(id, settings, true)
        if (backup) return { ok: true, model: backup.model }
      } catch (fallbackError) {
        if (fallbackError instanceof VisionError) {
          return { ok: false, kind: fallbackError.kind, message: fallbackError.message }
        }
      }
    }
    if (error instanceof VisionError) return { ok: false, kind: error.kind, message: error.message }
    return { ok: false, kind: 'network', message: 'Échec inattendu' }
  }
}
