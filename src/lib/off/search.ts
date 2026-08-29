/**
 * Finding a product by name rather than by barcode.
 *
 * The scanner needs the packaging in hand. Half of what gets logged is eaten
 * away from its box — a yoghurt from the fridge, bread from the bakery — and
 * typing three letters is the only route left.
 *
 * The French instance rather than `world`: it ranks what is sold in France
 * first and answers with French names, which is the whole population of this
 * app. Barcode lookups stay on `world` — a barcode means the same thing
 * everywhere, and a product sold here may have been entered elsewhere.
 */
import { FIELDS, REQUEST_TIMEOUT_MS } from '@/lib/off/client'
import { OffError, parseProduct } from '@/lib/off/product'
import type { Food } from '@/lib/foods/food'

const SEARCH_URL = 'https://fr.openfoodfacts.org/api/v2/search'

/** Enough to recognise the right one, few enough to arrive on a phone network. */
const PAGE_SIZE = 10

export interface SearchOptions {
  fetchImpl?: typeof fetch
  /** Cancels the request when the user types on. */
  signal?: AbortSignal
  limit?: number
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

  const url = new URL(SEARCH_URL)
  url.searchParams.set('search_terms', terms)
  url.searchParams.set('page_size', String(limit))
  // Without this the answer carries every field OFF holds — around 200 kB per
  // product, for the six values this list shows.
  url.searchParams.set('fields', FIELDS)
  url.searchParams.set('app_name', 'RecompOS')
  url.searchParams.set('app_version', __APP_VERSION__)

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

  const payload = (await response.json().catch(() => null)) as { products?: unknown } | null
  if (!payload) throw new OffError('bad_response', 'Réponse illisible')

  const products = Array.isArray(payload.products) ? payload.products : []
  const found: Food[] = []
  for (const raw of products) {
    try {
      found.push(parseProduct(raw))
    } catch {
      // One unusable record is not a failed search.
    }
  }
  return found
}
