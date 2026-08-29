import { Plus } from 'lucide-react'
import { t } from '@/i18n/fr'
import type { Food } from '@/lib/foods/food'
import type { FoodSearchState } from '@/features/meals/useFoodSearch'

interface FoodResultsProps extends FoodSearchState {
  onPick: (food: Food) => void
}

/** Where the numbers come from — a brand when there is one, the table otherwise. */
function originOf(food: Food): string {
  return food.brand ?? t.foods.source[food.source]
}

/**
 * The proposals, with their macros already on the row.
 *
 * Per 100 g rather than per portion: it is the only figure both tables agree
 * on, and the portion is the next question anyway. Showing a serving here would
 * mean inventing one for the half of the records that name none.
 */
export function FoodResults({
  foods,
  loading,
  networkFailed,
  asked,
  onPick,
}: Readonly<FoodResultsProps>) {
  if (!asked) return <p className="py-2 text-sm text-muted-foreground">{t.foods.tooShort}</p>
  if (loading && foods.length === 0)
    return <p className="py-2 text-sm text-muted-foreground">{t.foods.searching}</p>

  return (
    <>
      {foods.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">{t.foods.noMatch}</p>
      ) : (
        <ul className="flex flex-col">
          {foods.map((food) => (
            <li key={`${food.source}-${food.id}`}>
              <button
                type="button"
                aria-label={t.foods.add(food.name)}
                onClick={() => onPick(food)}
                className="flex min-h-[56px] w-full items-center gap-3 border-b border-border py-2 text-left transition-colors hover:bg-accent"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium">{food.name}</span>
                  <span className="tnum block truncate text-[13px] text-muted-foreground">
                    {originOf(food)} · {t.foods.per100(food.per100g.kcal, food.per100g.proteinG)}
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
      {networkFailed ? (
        <p className="pt-2 text-xs text-muted-foreground">{t.foods.offline}</p>
      ) : null}
    </>
  )
}
