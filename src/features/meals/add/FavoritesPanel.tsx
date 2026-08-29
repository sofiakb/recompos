import { MealPickList } from '@/features/meals/add/MealPickList'
import { t } from '@/i18n/fr'
import type { RecentMeal } from '@/features/meals/useRecentMeals'

interface FavoritesPanelProps {
  favorites: RecentMeal[]
  onPick: (meal: RecentMeal) => void
  onToggleFavorite: (meal: RecentMeal) => void
}

/**
 * The meals worth pinning, and nothing else.
 *
 * No search field: a list you curated by hand is a list short enough to read.
 * The day it is not, the fix is fewer favourites, not a filter.
 */
export function FavoritesPanel({
  favorites,
  onPick,
  onToggleFavorite,
}: Readonly<FavoritesPanelProps>) {
  if (favorites.length === 0) {
    return <p className="py-2 text-sm text-muted-foreground">{t.favorites.empty}</p>
  }

  return (
    <MealPickList
      meals={favorites}
      // Everything in this list is pinned by definition, so the star is always
      // filled here and always means « unpin ».
      isFavorite={() => true}
      onPick={onPick}
      onToggleFavorite={onToggleFavorite}
    />
  )
}
