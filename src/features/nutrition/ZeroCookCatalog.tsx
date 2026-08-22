import { useLiveQuery } from 'dexie-react-hooks'
import { Check, Plus } from 'lucide-react'
import { db } from '@/db/dexie'
import { setZeroCookStock } from '@/db/repositories/catalogRepository'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { t } from '@/i18n/fr'
import type { ZeroCookItem } from '@/types/models'

interface ZeroCookCatalogProps {
  onLog: (item: ZeroCookItem) => void
}

/**
 * Doubles as a fridge inventory and a log shortcut.
 *
 * Out-of-stock items stay listed but dimmed: the point of the list is also to
 * tell you what to re-buy, so hiding them would lose half its value.
 */
export function ZeroCookCatalog({ onLog }: ZeroCookCatalogProps) {
  const items = useLiveQuery(() => db.zeroCookItems.toArray(), [], []) ?? []
  const sorted = [...items].sort(
    (a, b) =>
      Number(b.inStock) - Number(a.inStock) || b.proteinPerServingGrams - a.proteinPerServingGrams,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.nutrition.zeroCookTitle}</CardTitle>
        <CardDescription>{t.nutrition.zeroCookHint}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col">
          {sorted.map((item) => (
            <li
              key={item.id}
              className={cn(
                'flex items-center gap-2 border-b border-border/60 py-1 last:border-0',
                !item.inStock && 'opacity-45',
              )}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={item.inStock}
                aria-label={t.nutrition.inStock(item.name)}
                onClick={() => void setZeroCookStock(item.id, !item.inStock)}
                className="h-touch flex w-9 shrink-0 items-center justify-center"
              >
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors',
                    item.inStock
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/40',
                  )}
                >
                  {item.inStock ? <Check size={14} strokeWidth={3} aria-hidden /> : null}
                </span>
              </button>

              <span className="flex flex-1 flex-col">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">{item.servingLabel}</span>
              </span>

              <button
                type="button"
                onClick={() => onLog(item)}
                aria-label={t.nutrition.logItem(item.name, item.proteinPerServingGrams)}
                className="tnum flex min-h-touch shrink-0 items-center gap-1 rounded-full bg-secondary px-3 text-sm font-semibold text-primary transition-colors active:bg-accent"
              >
                <Plus size={14} aria-hidden />
                {item.proteinPerServingGrams} g
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
