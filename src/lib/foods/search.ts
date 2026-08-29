/**
 * One list, two tables behind it.
 *
 * CIQUAL answers instantly and offline but only knows plain food; OFF knows
 * every packaged thing but needs the network. Asking both and merging means the
 * question « nectarine » and the question « Nutella » get the same box.
 *
 * CIQUAL comes first when it has something: a search for « riz » is a search for
 * rice, not for the eleven ready meals with rice in the name.
 */
import { searchCiqual } from '@/lib/foods/ciqual'
import { normalise, type Food } from '@/lib/foods/food'
import { searchProducts } from '@/lib/off/search'

/** Below this, every query matches everything and the list is noise. */
export const MIN_QUERY_LENGTH = 2

export interface FoodSearch {
  foods: Food[]
  /**
   * True when OpenFoodFacts could not be reached.
   *
   * Said out loud rather than shown as an empty list: offline, the local table
   * still answers, and the person needs to know the short list is short because
   * of the network and not because the food does not exist.
   */
  networkFailed: boolean
}

export interface FoodSearchOptions {
  signal?: AbortSignal
  fetchImpl?: typeof fetch
  limit?: number
}

/** Two records for the same thing, from either table, collapse into one row. */
function keyOf(food: Food): string {
  return `${normalise(food.name)}|${normalise(food.brand ?? '')}`
}

export async function searchFoods(
  query: string,
  { signal, fetchImpl, limit = 12 }: FoodSearchOptions = {},
): Promise<FoodSearch> {
  if (query.trim().length < MIN_QUERY_LENGTH) return { foods: [], networkFailed: false }

  const [local, remote] = await Promise.allSettled([
    searchCiqual(query),
    searchProducts(query, { signal, fetchImpl }),
  ])

  const foods: Food[] = []
  const seen = new Set<string>()
  for (const found of [local, remote]) {
    if (found.status !== 'fulfilled') continue
    for (const food of found.value) {
      const key = keyOf(food)
      if (seen.has(key)) continue
      seen.add(key)
      foods.push(food)
    }
  }

  return { foods: foods.slice(0, limit), networkFailed: remote.status === 'rejected' }
}
