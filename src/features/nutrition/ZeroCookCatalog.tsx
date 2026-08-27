import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Check, Pencil, Plus, Trash2 } from 'lucide-react'
import { db } from '@/db/dexie'
import {
  addZeroCookItem,
  deleteZeroCookItem,
  setZeroCookStock,
  updateZeroCookItem,
} from '@/db/repositories/catalogRepository'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ZeroCookEditorSheet, type ZeroCookDraft } from '@/features/nutrition/ZeroCookEditorSheet'
import { useUiStore } from '@/stores/uiStore'
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
 *
 * Editing lives behind a « Gérer la liste » toggle rather than in every row. The
 * row is tapped several times a day to log, and twice a month to edit; putting
 * both in it would crowd the frequent action out.
 */
export function ZeroCookCatalog({ onLog }: ZeroCookCatalogProps) {
  const items = useLiveQuery(() => db.zeroCookItems.toArray(), [], []) ?? []
  const showToast = useUiStore((state) => state.showToast)
  const [managing, setManaging] = useState(false)
  const [editing, setEditing] = useState<ZeroCookItem | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)

  const sorted = [...items].sort(
    (a, b) =>
      Number(b.inStock) - Number(a.inStock) || b.proteinPerServingGrams - a.proteinPerServingGrams,
  )

  const onSubmit = async (draft: ZeroCookDraft) => {
    if (editing) {
      await updateZeroCookItem(editing.id, draft)
      showToast(t.nutrition.itemSaved)
    } else {
      await addZeroCookItem({ ...draft, inStock: true })
      showToast(t.nutrition.itemSaved)
    }
    setEditorOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle>{t.nutrition.zeroCookTitle}</CardTitle>
              <CardDescription>{t.nutrition.zeroCookHint}</CardDescription>
            </div>
            <button
              type="button"
              onClick={() => setManaging((current) => !current)}
              className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {managing ? t.nutrition.manageDone : t.nutrition.manage}
            </button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {sorted.length === 0 ? (
            <p className="py-1 text-sm text-muted-foreground">{t.nutrition.zeroCookEmpty}</p>
          ) : (
            <ul className="flex flex-col">
              {sorted.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    'flex items-center gap-2 border-b border-border/60 py-1 last:border-0',
                    !item.inStock && !managing && 'opacity-45',
                  )}
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={item.inStock}
                    aria-label={t.nutrition.inStock(item.name)}
                    onClick={() => void setZeroCookStock(item.id, !item.inStock)}
                    className="flex h-touch w-9 shrink-0 items-center justify-center"
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

                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">{item.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {item.servingLabel}
                    </span>
                  </span>

                  {managing ? (
                    <>
                      <button
                        type="button"
                        aria-label={t.nutrition.editItem(item.name)}
                        onClick={() => {
                          setEditing(item)
                          setEditorOpen(true)
                        }}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Pencil size={16} aria-hidden />
                      </button>
                      <button
                        type="button"
                        aria-label={t.nutrition.deleteItem(item.name)}
                        onClick={async () => {
                          await deleteZeroCookItem(item.id)
                          showToast(t.nutrition.itemDeleted(item.name))
                        }}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Trash2 size={16} aria-hidden />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onLog(item)}
                      aria-label={t.nutrition.logItem(item.name, item.proteinPerServingGrams)}
                      className="tnum flex min-h-touch shrink-0 items-center gap-1 rounded-full bg-secondary px-3 text-sm font-semibold text-primary transition-colors active:bg-accent"
                    >
                      <Plus size={14} aria-hidden />
                      {item.proteinPerServingGrams} g
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          <Button
            variant="outline"
            block
            onClick={() => {
              setEditing(null)
              setEditorOpen(true)
            }}
          >
            <Plus size={18} aria-hidden />
            {t.nutrition.zeroCookAdd}
          </Button>
        </CardContent>
      </Card>

      <ZeroCookEditorSheet
        open={editorOpen}
        item={editing}
        onClose={() => setEditorOpen(false)}
        onSubmit={onSubmit}
      />
    </>
  )
}
