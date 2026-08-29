import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { FoodResults } from '@/features/meals/FoodResults'
import { MealPickList } from '@/features/meals/add/MealPickList'
import { useFoodSearch } from '@/features/meals/useFoodSearch'
import { t } from '@/i18n/fr'
import type { Food } from '@/lib/foods/food'
import type { RecentMeal } from '@/features/meals/useRecentMeals'

interface SearchPanelProps {
  query: string
  onQuery: (query: string) => void
  recent: RecentMeal[]
  onPick: (meal: RecentMeal) => void
  /** A food from CIQUAL or OpenFoodFacts, still owing a portion. */
  onPickFood: (food: Food) => void
  isFavorite: (label: string) => boolean
  onToggleFavorite: (meal: RecentMeal) => void
}

function emptyMessage(hasAny: boolean): string {
  return hasAny ? t.nutrition.habitsNoMatch : t.nutrition.habitsEmpty
}

/**
 * What this person already eats, then everything else.
 *
 * The fastest way to log a meal is to have logged it before: the same breakfast
 * four days a week should cost one tap, not four photographs. Habits therefore
 * stay first, and the two food tables answer underneath for the days that are
 * not a repeat.
 */
export function SearchPanel({
  query,
  onQuery,
  recent,
  onPick,
  onPickFood,
  isFavorite,
  onToggleFavorite,
}: Readonly<SearchPanelProps>) {
  const search = useFoodSearch(query)
  const needle = query.trim().toLocaleLowerCase('fr')
  const shown = needle
    ? recent.filter((meal) => meal.label.toLocaleLowerCase('fr').includes(needle))
    : recent

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search
          size={18}
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          className="pl-10"
          aria-label={t.nutrition.searchPlaceholder}
          placeholder={t.nutrition.searchPlaceholder}
          value={query}
          onChange={(event) => onQuery(event.target.value)}
        />
      </div>

      <section className="flex flex-col gap-1">
        <h3 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          {t.nutrition.habits}
        </h3>
        {shown.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">{emptyMessage(recent.length > 0)}</p>
        ) : (
          <MealPickList
            meals={shown}
            onPick={onPick}
            star={{ isFavorite, onToggle: onToggleFavorite }}
          />
        )}
      </section>

      {query.trim() ? (
        <section className="flex flex-col gap-1">
          <h3 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
            {t.foods.title}
          </h3>
          <FoodResults {...search} onPick={onPickFood} />
        </section>
      ) : null}
    </div>
  )
}
