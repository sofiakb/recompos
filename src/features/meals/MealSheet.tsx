import { useEffect, useState } from 'react'
import { ChevronRight, Plus, Sparkles, Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { MealHintSheet } from '@/features/meals/MealHintSheet'
import { QuantitySheet } from '@/features/meals/QuantitySheet'
import { useFavorites } from '@/features/meals/useFavorites'
import { useUiStore } from '@/stores/uiStore'
import { totalsFromItems } from '@/lib/vision/schema'
import { t } from '@/i18n/fr'
import type { MealEdit } from '@/db/repositories/mealRepository'
import type { MealEntry, MealItem } from '@/types/models'

interface MealSheetProps {
  /** The meal being read; `null` closes the sheet. Live, so an edit shows here. */
  meal: MealEntry | null
  /** This meal's share of the day, so the total has something to sit against. */
  targetKcal: number
  onClose: () => void
  onEdit: (edit: MealEdit) => void
  /** Opens the journal's own add sheet, already on this meal. */
  onAdd: () => void
  onRetry: (hint: string) => void
  onDelete: () => void
  photoUrlFor?: (id: string) => Promise<string | null>
}

/** What produced a line, said in the words of the route that produced it. */
const ORIGIN = {
  ai: t.meals.lineOrigin.photo,
  ai_text: t.meals.lineOrigin.described,
  barcode: t.meals.lineOrigin.scanned,
  food: t.meals.lineOrigin.table,
  corrected: t.meals.lineOrigin.corrected,
  manual: t.meals.lineOrigin.manual,
} as const

/** The label a meal carries once its lines have changed under it. */
function labelFrom(items: MealItem[]): string {
  return items
    .map((item) => item.name.trim())
    .filter(Boolean)
    .join(', ')
}

/**
 * A meal, read rather than filled in.
 *
 * It used to be a form: five fields per food, sixteen for a plate of four, and
 * three buttons of its own that duplicated the journal's add sheet. Almost none
 * of that was ever used — the correction people actually make is « c'était
 * 200 g, pas 300 », on one line. So the meal became four lines of text, each
 * opening on its own quantity, and adding anything goes back through the one
 * add sheet the `+` already opens.
 */
export function MealSheet({
  meal,
  targetKcal,
  onClose,
  onEdit,
  onAdd,
  onRetry,
  onDelete,
  photoUrlFor,
}: Readonly<MealSheetProps>) {
  /**
   * The line being adjusted, held rather than looked up by index.
   *
   * The meal is live: any write re-emits it as fresh objects, and a sheet whose
   * `item` prop changed identity would reset the field under the person typing
   * in it. What is opened stays what is edited.
   */
  const [openLine, setOpenLine] = useState<{ index: number; item: MealItem } | null>(null)
  const [hintOpen, setHintOpen] = useState(false)
  const favorites = useFavorites()
  const showToast = useUiStore((state) => state.showToast)

  // A meal closed and reopened must not land on the line read last time.
  useEffect(() => {
    if (!meal) {
      setOpenLine(null)
      setHintOpen(false)
    }
  }, [meal])

  if (!meal) return null

  const items = meal.items
  const totals = totalsFromItems(items)
  const span = Math.max(totals.kcal, targetKcal, 1)
  const withinPercent = (Math.min(totals.kcal, targetKcal) / span) * 100
  const overPercent = (Math.max(totals.kcal - targetKcal, 0) / span) * 100

  const pinMeal = () => {
    void favorites
      .toggle(meal.label, items)
      .then((pinned) => showToast(pinned ? t.favorites.added : t.favorites.removed))
  }

  const pinLine = (item: MealItem) => {
    void favorites
      .toggle(item.name, [item])
      .then((pinned) => showToast(pinned ? t.favorites.added : t.favorites.removed))
  }

  /** A quantity change leaves the meal's name alone; adding or dropping a line does not. */
  const saveLine = (index: number, next: MealItem) => {
    onEdit({ items: items.map((item, i) => (i === index ? next : item)) })
    setOpenLine(null)
  }

  const removeLine = (index: number) => {
    const rest = items.filter((_, i) => i !== index)
    setOpenLine(null)
    // A meal with nothing left in it is not a meal. Removing its last line is
    // how someone says the whole thing never happened.
    if (rest.length === 0) onDelete()
    else onEdit({ items: rest, label: labelFrom(rest) })
  }

  const header = (
    <div className="shrink-0">
      <div className="mx-auto h-1 w-11 rounded-full bg-muted-foreground/50" />
      <div className="flex items-start gap-2 px-5 pb-3 pt-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-[19px] font-semibold">{t.meals.slot[meal.slot]}</h2>
          {meal.label ? (
            <p className="text-pretty text-[13px] leading-[1.35] text-muted-foreground">
              {meal.label}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          aria-pressed={favorites.isFavorite(meal.label)}
          aria-label={
            favorites.isFavorite(meal.label)
              ? t.favorites.remove(meal.label)
              : t.favorites.add(meal.label)
          }
          disabled={!meal.label.trim()}
          onClick={pinMeal}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
        >
          <Star
            size={20}
            aria-hidden
            className={
              favorites.isFavorite(meal.label) ? 'fill-foreground text-foreground' : undefined
            }
          />
        </button>
        <button
          type="button"
          aria-label={t.common.close}
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent"
        >
          <X size={18} aria-hidden />
        </button>
      </div>
    </div>
  )

  return (
    <Sheet
      open
      onClose={onClose}
      title={t.meals.editTitle}
      tall
      header={header}
      className="top-auto h-[76vh] max-h-[calc(100%-4rem)]"
    >
      <div className="no-scrollbar flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 pb-5">
        <div className="flex flex-col gap-[7px]">
          <div className="flex items-baseline justify-between gap-3">
            <p className="tnum text-2xl font-semibold">
              {totals.kcal}{' '}
              <span className="text-sm font-normal text-muted-foreground">
                {t.meals.outOfTarget(targetKcal)}
              </span>
            </p>
            <span className="tnum text-[13px] text-muted-foreground">
              {totals.kcal > targetKcal
                ? t.meals.overBudget(totals.kcal - targetKcal)
                : t.meals.leftBudget(targetKcal - totals.kcal)}
            </span>
          </div>
          <div className="flex h-[5px] overflow-hidden rounded-full bg-muted">
            <div className="bg-primary" style={{ width: `${withinPercent}%` }} />
            <div className="bg-destructive" style={{ width: `${overPercent}%` }} />
          </div>
          <p className="tnum text-[13px] text-muted-foreground">
            {t.meals.macrosCounted(totals.proteinG, totals.carbsG, totals.fatG)}
          </p>
        </div>

        {items.length > 0 ? (
          <ul className="flex flex-col border-t border-border">
            {items.map((item, index) => (
              <li key={`${item.name}-${index}`}>
                <button
                  type="button"
                  aria-label={t.nutrition.editItem(item.name)}
                  onClick={() => setOpenLine({ index, item })}
                  className="flex min-h-[62px] w-full items-center gap-3 border-b border-border px-0.5 py-2 text-left transition-colors hover:bg-accent"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium">{item.name}</span>
                    {item.quantity ? (
                      <span className="tnum block text-[13px] text-muted-foreground">
                        {item.quantity}
                      </span>
                    ) : null}
                  </span>
                  <span className="tnum shrink-0 text-[15px] font-semibold">{item.kcal}</span>
                  <ChevronRight size={18} className="shrink-0 text-muted-foreground" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-t border-border pt-3 text-[13px] text-muted-foreground">
            {t.meals.emptyBreakdown}
          </p>
        )}

        {/* Only where there is an estimate to redo: a line taken from CIQUAL was
            never estimated, and « corriger » would send it to a sheet with
            nothing to re-read. */}
        {meal.photoId || meal.source === 'ai_text' ? (
          <Button variant="outline" block onClick={() => setHintOpen(true)}>
            <Sparkles size={17} className="text-primary" aria-hidden />
            {t.meals.correctEstimate}
          </Button>
        ) : null}

        <Button variant="ghost" block className="text-destructive" onClick={onDelete}>
          {t.meals.delete}
        </Button>
      </div>

      <div className="shrink-0 border-t border-border bg-card px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3">
        <Button block onClick={onAdd}>
          <Plus size={18} aria-hidden />
          {t.meals.addItem}
        </Button>
      </div>

      {/* Last children on purpose: `Sheet` is `fixed inset-0 z-50` with no
          portal, so at equal z-index it is DOM order that puts one above the
          other. */}
      {openLine ? (
        <QuantitySheet
          open
          item={openLine.item}
          subtitle={t.meals.lineFrom(t.meals.slotOf[meal.slot], ORIGIN[meal.source])}
          saveLabel={t.common.save}
          star={{
            pinned: favorites.isFavorite(openLine.item.name),
            onToggle: () => pinLine(openLine.item),
          }}
          onClose={() => setOpenLine(null)}
          onSave={(next) => saveLine(openLine.index, next)}
          onRemove={() => removeLine(openLine.index)}
        />
      ) : null}

      <MealHintSheet
        open={hintOpen}
        meal={meal}
        photoUrlFor={photoUrlFor}
        onClose={() => setHintOpen(false)}
        onSubmit={(hint) => {
          setHintOpen(false)
          onRetry(hint)
        }}
      />
    </Sheet>
  )
}
