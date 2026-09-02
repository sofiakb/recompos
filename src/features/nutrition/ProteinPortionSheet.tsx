import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/dexie'
import { Sheet } from '@/components/ui/sheet'
import { t } from '@/i18n/fr'
import type { ZeroCookItem } from '@/types/models'
import { TapTarget } from '@/components/ui/tap-target'

interface ProteinPortionSheetProps {
  open: boolean
  onClose: () => void
  onPick: (item: ZeroCookItem) => void
}

/**
 * Asks which protein was actually eaten before crediting the floor habit.
 *
 * One extra tap, deliberately: it is what turns « done » into real grams on the
 * day's total instead of a checkbox that means nothing nutritionally.
 */
export function ProteinPortionSheet({ open, onClose, onPick }: ProteinPortionSheetProps) {
  const items = useLiveQuery(() => db.zeroCookItems.toArray(), [], []) ?? []
  const sorted = [...items].sort((a, b) => b.proteinPerServingGrams - a.proteinPerServingGrams)

  return (
    <Sheet open={open} onClose={onClose} title={t.nutrition.pickPortion}>
      <p className="mb-3 text-sm text-muted-foreground">{t.nutrition.pickPortionHint}</p>
      <ul className="flex max-h-[50vh] flex-col overflow-y-auto">
        {sorted.map((item) => (
          <li key={item.id}>
            <TapTarget
              type="button"
              onClick={() => onPick(item)}
              className="flex min-h-touch w-full items-center justify-between gap-3 rounded-md px-1 py-2 text-left transition-colors active:bg-accent"
            >
              <span className="flex flex-col">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">{item.servingLabel}</span>
              </span>
              <span className="tnum shrink-0 rounded-full bg-secondary px-2.5 py-1 text-sm font-semibold text-primary">
                {item.proteinPerServingGrams} g
              </span>
            </TapTarget>
          </li>
        ))}
      </ul>
    </Sheet>
  )
}
