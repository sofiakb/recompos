import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { FoodResults } from '@/features/meals/FoodResults'
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
          <ul className="flex flex-col">
            {shown.map((meal) => (
              <li key={meal.label}>
                <button
                  type="button"
                  aria-label={t.nutrition.addAgain(meal.label)}
                  onClick={() => onPick(meal)}
                  className="flex min-h-[56px] w-full items-center gap-3 border-b border-border py-2 text-left transition-colors hover:bg-accent"
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
              </li>
            ))}
          </ul>
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
