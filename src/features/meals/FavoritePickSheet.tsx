import { Sheet } from '@/components/ui/sheet'
import { MealPickList } from '@/features/meals/add/MealPickList'
import { linesOf } from '@/features/meals/favoriteLines'
import { t } from '@/i18n/fr'
import type { RecentMeal } from '@/features/meals/useRecentMeals'
import type { MealItem } from '@/types/models'

interface FavoritePickSheetProps {
  open: boolean
  favorites: RecentMeal[]
  onClose: () => void
  /** The favourite's lines, ready to append to a breakdown. */
  onPick: (items: MealItem[]) => void
}

/**
 * A pinned meal, pulled into the meal being corrected.
 *
 * The favourites tab of the add sheet only ever logs a whole meal, which is no
 * help once a meal is open and short of a line — the coffee that belongs beside
 * this morning's madeleines was reachable only by closing the editor and
 * starting again. Here the same favourite is a source of lines instead: its
 * items are appended to the breakdown, and the meal is saved as after any other
 * correction.
 */
export function FavoritePickSheet({
  open,
  favorites,
  onClose,
  onPick,
}: Readonly<FavoritePickSheetProps>) {
  return (
    <Sheet open={open} onClose={onClose} title={t.favorites.pickTitle}>
      {favorites.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">{t.favorites.empty}</p>
      ) : (
        <MealPickList meals={favorites} onPick={(favorite) => onPick(linesOf(favorite))} />
      )}
    </Sheet>
  )
}
