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
import { MEAL_SYSTEM_PROMPT, MEAL_USER_PROMPT, repairPrompt } from '@/lib/vision/prompt'
import { parseAnalysis, type MealAnalysis } from '@/lib/vision/schema'
import type { VisionProviderId, VisionProviderSettings } from '@/types/models'

export interface ProviderDefinition {
  id: VisionProviderId
  label: string
  baseUrl: string
  defaultModel: string
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
    defaultModel: 'meta-llama/llama-4-scout-17b-16e-instruct',
    keyUrl: 'https://console.groq.com/keys',
    needsBaseUrl: false,
  },
  openrouter: {
    id: 'openrouter',
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'meta-llama/llama-4-scout',
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

export type VisionErrorKind = 'auth' | 'rate_limit' | 'network' | 'server' | 'bad_response'

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

export interface ConfiguredProvider {
  id: VisionProviderId
  settings: VisionProviderSettings
}

const REQUEST_TIMEOUT_MS = 45_000
const MAX_TOKENS = 1200

export function resolveEndpoint(
  id: VisionProviderId,
  settings: VisionProviderSettings,
): { url: string; model: string } | null {
  const definition = PROVIDERS[id]
  const baseUrl = (definition.needsBaseUrl ? settings.baseUrl : definition.baseUrl)?.replace(
    /\/+$/,
    '',
  )
  const model = settings.model?.trim() || definition.defaultModel
  if (!baseUrl || !model) return null
  return { url: `${baseUrl}/chat/completions`, model }
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

function messageContent(input: AnalyseInput) {
  const text = input.hint?.trim()
    ? `${MEAL_USER_PROMPT}\nPrécision de l'utilisateur : ${input.hint.trim()}`
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
): Promise<string> {
  const endpoint = resolveEndpoint(id, settings)
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
        // Low but not zero: at zero these models repeat a wrong reading of the
        // plate verbatim on every retry.
        temperature: 0.2,
        max_tokens: MAX_TOKENS,
        response_format: { type: 'json_object' },
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

  const first = await postCompletion(provider.id, provider.settings, messages, fetchImpl)
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
  try {
    await postCompletion(
      id,
      settings,
      [{ role: 'user', content: 'Réponds exactement : {"ok":true}' }],
      fetchImpl,
    )
    return { ok: true, model: endpoint.model }
  } catch (error) {
    if (error instanceof VisionError) return { ok: false, kind: error.kind, message: error.message }
    return { ok: false, kind: 'network', message: 'Échec inattendu' }
  }
}
