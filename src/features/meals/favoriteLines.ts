import type { RecentMeal } from '@/features/meals/useRecentMeals'
import type { MealItem } from '@/types/models'

/**
 * A favourite, flattened into the lines it contributes to a meal.
 *
 * A favourite is a meal, and folding a meal into another one loses its label.
 * When it holds a single line, that label is carried onto it: the row promised
 * « Café au lait dosette (Senseo) », and a breakdown that answered « Calories
 * seules » — the name the kcal-only route gives its one item — would not be the
 * thing that was picked. With several lines there is nothing to carry it onto,
 * and each already says what it is.
 */
export function linesOf(favorite: RecentMeal): MealItem[] {
  const [only] = favorite.items
  return favorite.items.length === 1 ? [{ ...only, name: favorite.label }] : favorite.items
}
