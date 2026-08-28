/**
 * Reading OpenFoodFacts from the page.
 *
 * Verified on 28/08/2026: the v2 endpoint answers `access-control-allow-origin: *`
 * and needs no key for reads, so this is an outgoing call like the model
 * providers — not a backend (PRD décision n°5). The documented `User-Agent`
 * identification is impossible from a browser, which forbids writing that
 * header, so the app names itself in the query string instead.
 */
import { OffError, parseProduct, type OffProduct } from '@/lib/off/product'

const BASE_URL = 'https://world.openfoodfacts.org/api/v2/product'

/** Asking for everything costs seconds on a phone; these are what the sheet reads. */
const FIELDS = [
  'code',
  'product_name',
  'product_name_fr',
  'brands',
  'quantity',
  'serving_size',
  'serving_quantity',
  'nutriments',
].join(',')

const REQUEST_TIMEOUT_MS = 10_000

export async function fetchProduct(
  barcode: string,
  fetchImpl: typeof fetch = fetch,
): Promise<OffProduct> {
  const url =
    `${BASE_URL}/${encodeURIComponent(barcode)}.json` +
    `?fields=${FIELDS}&app_name=RecompOS&app_version=${encodeURIComponent(__APP_VERSION__)}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  let response: Response
  try {
    response = await fetchImpl(url, { signal: controller.signal })
  } catch {
    throw new OffError('network', "Pas de réponse d'OpenFoodFacts")
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    throw new OffError('server', `Erreur ${response.status}`)
  }

  const payload = (await response.json().catch(() => null)) as {
    status?: number
    product?: unknown
  } | null
  if (!payload) throw new OffError('bad_response', 'Réponse illisible')

  // A code nobody has entered answers 200 with `status: 0`. Reading only the HTTP
  // status here would hand a missing product to the parser as if it were one.
  if (payload.status === 0 || !payload.product) {
    throw new OffError('not_found', "Produit inconnu d'OpenFoodFacts")
  }

  return parseProduct(payload.product)
}
