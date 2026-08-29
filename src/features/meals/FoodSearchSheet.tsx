import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { FoodResults } from '@/features/meals/FoodResults'
import { useFoodSearch } from '@/features/meals/useFoodSearch'
import { t } from '@/i18n/fr'
import type { Food } from '@/lib/foods/food'

interface FoodSearchSheetProps {
  open: boolean
  onClose: () => void
  onPick: (food: Food) => void
}

/**
 * Naming an ingredient instead of guessing its numbers.
 *
 * The line editor asks for four figures per food, and « combien de calories dans
 * 30 g de crème fraîche » is not something anyone knows. Both tables do, so the
 * question becomes a name and a portion.
 */
export function FoodSearchSheet({ open, onClose, onPick }: Readonly<FoodSearchSheetProps>) {
  const [query, setQuery] = useState('')
  const search = useFoodSearch(query)

  useEffect(() => {
    // A new search each opening: the last ingredient is rarely the next one.
    if (open) setQuery('')
  }, [open])

  return (
    <Sheet open={open} onClose={onClose} title={t.foods.searchTitle}>
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search
            size={18}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            autoFocus
            className="pl-10"
            aria-label={t.nutrition.searchPlaceholder}
            placeholder={t.nutrition.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <FoodResults {...search} onPick={onPick} />
      </div>
    </Sheet>
  )
}
