import { useLiveQuery } from 'dexie-react-hooks'
import { favoriteKey, listFavorites, toggleFavorite } from '@/db/repositories/favoriteRepository'
import { totalsFromItems } from '@/lib/vision/schema'
import type { RecentMeal } from '@/features/meals/useRecentMeals'
import type { MealItem } from '@/types/models'

export interface FavoritesState {
  /** Shaped like a habit, because the two lists are the same row. */
  list: RecentMeal[]
  isFavorite: (label: string) => boolean
  /** Resolves to the state it left behind: `true` pinned, `false` unpinned. */
  toggle: (label: string, items: MealItem[]) => Promise<boolean>
}

/**
 * The pinned meals, and the star that pins them.
 *
 * The totals are recomputed from the items rather than read from a stored pair
 * of figures — there is only one number for each macro, so a favourite cannot
 * come to disagree with its own breakdown.
 */
export function useFavorites(): FavoritesState {
  const rows = useLiveQuery(() => listFavorites(), [], [])
  const keys = new Set(rows.map((row) => row.key))

  return {
    list: rows.map((row) => {
      const totals = totalsFromItems(row.items)
      return { label: row.label, kcal: totals.kcal, proteinG: totals.proteinG, items: row.items }
    }),
    isFavorite: (label) => keys.has(favoriteKey(label)),
    toggle: (label, items) => toggleFavorite(label, items),
  }
}
