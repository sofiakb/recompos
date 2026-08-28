import { useLiveQuery } from 'dexie-react-hooks'
import { recentMeals } from '@/db/repositories/mealRepository'
import type { MealItem } from '@/types/models'

export interface RecentMeal {
  label: string
  kcal: number
  proteinG: number
  /** Copied verbatim when the meal is added again, so the breakdown survives. */
  items: MealItem[]
}

/** Enough to cover a routine without becoming a list you have to read. */
const SHOWN = 12
const WINDOW_DAYS = 30

/**
 * What this person actually eats, newest first and said once each.
 *
 * Someone eating the same breakfast four days a week should not have to
 * photograph it four times. The list is deduplicated on the label because that
 * is what makes two entries « the same meal » to the person who typed it — the
 * macros of the most recent one win, since that is the reading they last
 * corrected.
 */
export function useRecentMeals(): RecentMeal[] {
  const rows = useLiveQuery(() => recentMeals(WINDOW_DAYS), [], [])

  const seen = new Map<string, RecentMeal>()
  for (const meal of rows ?? []) {
    const label = meal.label.trim()
    if (meal.status !== 'done' || !label) continue
    const key = label.toLocaleLowerCase('fr')
    if (seen.has(key)) continue
    seen.set(key, { label, kcal: meal.kcal, proteinG: meal.proteinG, items: meal.items })
  }
  return [...seen.values()].slice(0, SHOWN)
}
