import { Plus, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { t } from '@/i18n/fr'
import type { RecentMeal } from '@/features/meals/useRecentMeals'

interface MealPickListProps {
  meals: RecentMeal[]
  isFavorite: (label: string) => boolean
  onPick: (meal: RecentMeal) => void
  onToggleFavorite: (meal: RecentMeal) => void
}

/**
 * The rows shared by « Favoris » and « Vos habitudes ».
 *
 * One component for both because they are the same object seen twice: a meal
 * you have eaten, ready to be added again. The star is the only thing that
 * distinguishes them, and it is what moves a row from the second list to the
 * first.
 *
 * It sits outside the add button rather than inside it — the whole left of the
 * row logs the meal, including the `+`, and the star at the very edge is the
 * one place a tap does something else.
 */
export function MealPickList({
  meals,
  isFavorite,
  onPick,
  onToggleFavorite,
}: Readonly<MealPickListProps>) {
  return (
    <ul className="flex flex-col">
      {meals.map((meal) => {
        const pinned = isFavorite(meal.label)
        return (
          <li key={meal.label} className="flex items-center border-b border-border">
            <button
              type="button"
              aria-label={t.nutrition.addAgain(meal.label)}
              onClick={() => onPick(meal)}
              className="flex min-h-[56px] min-w-0 flex-1 items-center gap-3 py-2 text-left transition-colors hover:bg-accent"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium">{meal.label}</span>
                <span className="tnum block truncate text-[13px] text-muted-foreground">
                  {t.nutrition.habitLine(meal.kcal, meal.proteinG)}
                </span>
              </span>
              <span
                aria-hidden
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted"
              >
                <Plus size={16} />
              </span>
            </button>
            <button
              type="button"
              aria-pressed={pinned}
              aria-label={pinned ? t.favorites.remove(meal.label) : t.favorites.add(meal.label)}
              onClick={() => onToggleFavorite(meal)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-accent"
            >
              <Star
                size={18}
                aria-hidden
                // Filled rather than coloured: the accent belongs to the `+`,
                // which is what the row is for. A star that shouted louder than
                // the action would invert the two.
                className={cn(pinned ? 'fill-foreground text-foreground' : 'text-muted-foreground')}
              />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
