/**
 * Finding a product by name rather than by barcode.
 *
 * The scanner needs the packaging in hand. Half of what gets logged is eaten
 * away from its box — a yoghurt from the fridge, bread from the bakery — and
 * typing three letters is the only route left.
 *
 * **`/api/v2/search` is not a text search.** It filters on tags — categories,
 * brands, labels — and silently ignores a parameter it does not know. Asked for
 * « café au lait senseo » it answered with the head of the database: Prince, du
 * pain de mie, du Skyr. Not a ranking failure, an unfiltered list.
 *
 * So the text search goes to the engine built for it, and falls back to the CGI
 * the OpenFoodFacts site itself used for a decade if that engine is unreachable.
 * Barcode lookups stay on `/api/v2/product`, which is a lookup and does work.
 */
import { FIELDS, REQUEST_TIMEOUT_MS } from '@/lib/off/client'
import { OffError, parseProduct } from '@/lib/off/product'
import { normalise, type Food } from '@/lib/foods/food'

/** Search-a-licious: the full-text engine behind the OFF site today. */
const SEARCH_URL = 'https://search.openfoodfacts.org/search'

/** The historical CGI. Slower, still answers, and predates every rewrite. */
const LEGACY_URL = 'https://fr.openfoodfacts.org/cgi/search.pl'

/** Enough to recognise the right one, few enough to arrive on a phone network. */
const PAGE_SIZE = 10

/**
 * Below this a word carries no signal — « au », « de », « le » sit inside half
 * the names in the database and would vouch for anything.
 */
const MEANINGFUL_WORD = 3

export interface SearchOptions {
  fetchImpl?: typeof fetch
  /** Cancels the request when the user types on. */
  signal?: AbortSignal
  limit?: number
}

/** Both endpoints answer with OFF product records, under different keys. */
function recordsIn(payload: unknown): unknown[] {
  if (!payload || typeof payload !== 'object') return []
  const body = payload as { hits?: unknown; products?: unknown }
  if (Array.isArray(body.hits)) return body.hits
  return Array.isArray(body.products) ? body.products : []
}

/**
 * The query's words, ready to be matched: normalised, and stripped of a plural
 * so « tomates » still finds « tomate ».
 *
 * Words under three letters are dropped — « au », « de », « le » sit inside half
 * the names in the database and would vouch for anything — unless that leaves
 * nothing, in which case a short query is all there is to go on.
 */
function needlesIn(terms: string): string[] {
  const words = normalise(terms)
    .split(' ')
    .filter(Boolean)
    .map((word) => word.replace(/s$/, ''))
  const meaningful = words.filter((word) => word.length >= MEANINGFUL_WORD)
  return meaningful.length > 0 ? meaningful : words
}

/**
 * How many of the query's words the name carries.
 *
 * A guard as much as a ranking. An endpoint that ignores the question answers
 * with whatever it had; scoring the answer against the question turns that into
 * an empty list instead of nine wrong products with a `+` button each.
 *
 * Word starts rather than substrings: « lait » must not be vouched for by
 * « Yoplait », while « grec » still has to find « à la grecque ».
 */
function relevance(food: Food, needles: string[]): number {
  const words = normalise(`${food.name} ${food.brand ?? ''}`).split(' ')
  return needles.filter((needle) => words.some((word) => word.startsWith(needle))).length
}

async function fetchJson(
  url: URL,
  fetchImpl: typeof fetch,
  signal?: AbortSignal,
): Promise<unknown> {
  const controller = new AbortController()
  const abort = () => controller.abort()
  signal?.addEventListener('abort', abort)
  const timeout = setTimeout(abort, REQUEST_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetchImpl(url.toString(), { signal: controller.signal })
  } catch {
    throw new OffError('network', "Pas de réponse d'OpenFoodFacts")
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', abort)
  }

  if (!response.ok) throw new OffError('server', `Erreur ${response.status}`)
  const payload = await response.json().catch(() => null)
  if (payload === null) throw new OffError('bad_response', 'Réponse illisible')
  return payload
}

function searchUrl(terms: string, limit: number): URL {
  const url = new URL(SEARCH_URL)
  url.searchParams.set('q', terms)
  url.searchParams.set('page_size', String(limit))
  // Without this the answer carries every field OFF holds — hundreds of
  // kilobytes per product, for the six values this list shows.
  url.searchParams.set('fields', FIELDS)
  url.searchParams.set('langs', 'fr')
  return url
}

function legacyUrl(terms: string, limit: number): URL {
  const url = new URL(LEGACY_URL)
  url.searchParams.set('search_terms', terms)
  url.searchParams.set('search_simple', '1')
  url.searchParams.set('action', 'process')
  url.searchParams.set('json', '1')
  url.searchParams.set('page_size', String(limit))
  url.searchParams.set('fields', FIELDS)
  url.searchParams.set('app_name', 'RecompOS')
  url.searchParams.set('app_version', __APP_VERSION__)
  return url
}

/**
 * Products whose name matches, best first, with their per-100 g table.
 *
 * A record without usable nutrition figures is dropped rather than shown as a
 * row of zeros: the point of the list is the macros, and a proposal that has
 * none is a trap with a `+` button on it.
 */
export async function searchProducts(
  query: string,
  { fetchImpl = fetch, signal, limit = PAGE_SIZE }: SearchOptions = {},
): Promise<Food[]> {
  const terms = query.trim()
  if (terms.length < 2) return []

  let payload: unknown
  try {
    payload = await fetchJson(searchUrl(terms, limit), fetchImpl, signal)
  } catch {
    // The engine is young and its host is separate from the main site: when it
    // is not there, the CGI still is.
    payload = await fetchJson(legacyUrl(terms, limit), fetchImpl, signal)
  }

  const found: Food[] = []
  for (const raw of recordsIn(payload)) {
    try {
      found.push(parseProduct(raw))
    } catch {
      // One unusable record is not a failed search.
    }
  }

  const needles = needlesIn(terms)
  if (needles.length === 0) return found.slice(0, limit)

  return found
    .map((food) => ({ food, score: relevance(food, needles) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.food)
}
