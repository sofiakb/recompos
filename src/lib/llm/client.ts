/**
 * Transport for every provider speaking the OpenAI chat-completions dialect.
 *
 * There is no server (PRD décision n°5), so the request goes straight from the
 * page to the provider with a key the user typed into Settings. This file knows
 * about keys, endpoints, timeouts and failure shapes — and nothing at all about
 * meals. What is read (a plate, a sentence) lives one layer up, in `llm/meal.ts`.
 */
import type { VisionProviderId, VisionProviderSettings } from '@/types/models'

/** Which model of a provider a call wants. Read from Task 3 onward. */
export type Modality = 'vision' | 'text'

export interface ProviderDefinition {
  id: VisionProviderId
  label: string
  baseUrl: string
  /** Empty means the user must name one; the provider is skipped until they do. */
  defaultModel: string
  /**
   * The text-only model. Held apart from `defaultModel` because a description
   * does not need vision, and paying for vision to read a sentence is waste.
   */
  defaultTextModel: string
  /**
   * Tried once when the default model turns out not to exist.
   *
   * Hosted model ids are renamed and retired without warning, and a build that
   * pins one is a build that stops working on someone else's schedule.
   */
  fallbackModel?: string
  fallbackTextModel?: string
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
    defaultTextModel: 'openai/gpt-oss-120b',
    fallbackTextModel: 'llama-3.3-70b-versatile',
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
    defaultTextModel: '',
    keyUrl: 'https://openrouter.ai/keys',
    needsBaseUrl: false,
  },
  custom: {
    id: 'custom',
    label: 'Endpoint personnalisé',
    baseUrl: '',
    defaultModel: '',
    defaultTextModel: '',
    keyUrl: '',
    needsBaseUrl: true,
  },
}

/** Order the chain is attempted in, cheapest and fastest first. */
export const VISION_PROVIDER_ORDER: VisionProviderId[] = ['groq', 'openrouter', 'custom']

export type LlmErrorKind =
  | 'auth'
  | 'rate_limit'
  | 'network'
  | 'server'
  | 'bad_response'
  /** The endpoint answered, but does not know that model. */
  | 'model'
  /** The image would push the request past the documented ceiling. */
  | 'too_large'

export class LlmError extends Error {
  constructor(
    readonly kind: LlmErrorKind,
    message: string,
    readonly providerId?: VisionProviderId,
  ) {
    super(message)
    // Kept as `VisionError` on purpose: the name is what a thrown error prints,
    // and the settings screen still speaks of vision providers.
    this.name = 'VisionError'
  }
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

/**
 * Trailing slashes off, without a regular expression.
 *
 * `/\/+$/` backtracks on a long run of slashes. Harmless against an endpoint
 * someone typed by hand — but a linear scan costs nothing and cannot be made to
 * misbehave, and this string comes from a settings field.
 */
function withoutTrailingSlashes(url: string): string {
  let end = url.length
  while (end > 0 && url[end - 1] === '/') end -= 1
  return url.slice(0, end)
}

export function resolveEndpoint(
  id: VisionProviderId,
  settings: VisionProviderSettings,
  modality: Modality = 'vision',
  useFallbackModel = false,
): { url: string; model: string } | null {
  const definition = PROVIDERS[id]
  const configured = definition.needsBaseUrl ? settings.baseUrl : definition.baseUrl
  const baseUrl = configured ? withoutTrailingSlashes(configured) : configured
  const text = modality === 'text'
  const chosen = (text ? settings.textModel : settings.model)?.trim()
  const fallback = text ? definition.fallbackTextModel : definition.fallbackModel
  const preferred = text ? definition.defaultTextModel : definition.defaultModel
  // A model the user typed is never second-guessed: the fallback exists for the
  // built-in default going stale, not to override a deliberate choice.
  const model = chosen || (useFallbackModel ? fallback : preferred)
  if (!baseUrl || !model) return null
  return { url: `${baseUrl}/chat/completions`, model }
}

/** True when the built-in default failed and a backup is worth one retry. */
function hasFallbackModel(
  id: VisionProviderId,
  settings: VisionProviderSettings,
  modality: Modality = 'vision',
): boolean {
  const text = modality === 'text'
  const chosen = (text ? settings.textModel : settings.model)?.trim()
  return !chosen && Boolean(text ? PROVIDERS[id].fallbackTextModel : PROVIDERS[id].fallbackModel)
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

/**
 * What a failed response means, in terms the settings screen can act on.
 *
 * Held apart from the request itself: the happy path is four lines, and burying
 * it under five status branches is how a reader stops seeing it.
 */
async function errorForResponse(
  response: Response,
  model: string,
  id: VisionProviderId,
): Promise<LlmError> {
  const detail = await response.text().catch(() => '')
  if (response.status === 401 || response.status === 403) {
    return new LlmError('auth', 'Clé refusée', id)
  }
  if (response.status === 429) return new LlmError('rate_limit', 'Quota atteint', id)
  // A retired or misspelled model id answers 404 with a body naming it. Kept
  // apart from a server fault because it is the user's to fix — and because a
  // built-in default going stale earns one automatic retry on the backup.
  if (response.status === 404 || /model_not_found|does not exist/i.test(detail)) {
    return new LlmError('model', `Modèle inconnu : ${model}`, id)
  }
  const explanation = detail ? ` — ${detail.slice(0, 120)}` : ''
  return new LlmError('server', `Erreur ${response.status}${explanation}`, id)
}

export async function postCompletion(
  id: VisionProviderId,
  settings: VisionProviderSettings,
  messages: unknown[],
  fetchImpl: typeof fetch,
  useFallbackModel = false,
  modality: Modality = 'vision',
): Promise<string> {
  const endpoint = resolveEndpoint(id, settings, modality, useFallbackModel)
  if (!endpoint) throw new LlmError('bad_response', 'Provider mal configuré', id)

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
    throw new LlmError('network', 'Pas de réponse du service', id)
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) throw await errorForResponse(response, endpoint.model, id)

  const payload = (await response.json().catch(() => null)) as {
    choices?: Array<{ message?: { content?: unknown } }>
  } | null
  const content = payload?.choices?.[0]?.message?.content
  if (typeof content !== 'string' || !content.trim()) {
    throw new LlmError('bad_response', 'Réponse vide', id)
  }
  return content
}

/**
 * Cheap round-trip used by the « tester la clé » button.
 *
 * Text-only and two tokens wide: it proves the key, the endpoint and — the part
 * that cannot be checked from anywhere but a browser — that the provider answers
 * a cross-origin request from this page at all.
 */
type ProbeResult = { ok: true; model: string } | { ok: false; kind: LlmErrorKind; message: string }

/**
 * Second probe, on the backup model.
 *
 * Null means it settled nothing and the first failure is still the answer —
 * which is why the caller keeps its own error rather than inventing one here.
 */
async function probeFallback(
  id: VisionProviderId,
  settings: VisionProviderSettings,
  probe: unknown[],
  fetchImpl: typeof fetch,
): Promise<ProbeResult | null> {
  try {
    await postCompletion(id, settings, probe, fetchImpl, true)
    // Reports the model that actually answered, so the settings screen never
    // names one the real requests will not use.
    const backup = resolveEndpoint(id, settings, 'vision', true)
    return backup ? { ok: true, model: backup.model } : null
  } catch (error) {
    if (error instanceof LlmError) return { ok: false, kind: error.kind, message: error.message }
    return null
  }
}

export async function testProvider(
  id: VisionProviderId,
  settings: VisionProviderSettings,
  fetchImpl: typeof fetch = fetch,
): Promise<ProbeResult> {
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
    if (!(error instanceof LlmError)) {
      return { ok: false, kind: 'network', message: 'Échec inattendu' }
    }
    if (error.kind === 'model' && hasFallbackModel(id, settings)) {
      const retried = await probeFallback(id, settings, probe, fetchImpl)
      if (retried) return retried
    }
    return { ok: false, kind: error.kind, message: error.message }
  }
}
