import { useEffect, useState } from 'react'
import { Plus, RefreshCw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Segmented } from '@/components/ui/segmented'
import { Sheet } from '@/components/ui/sheet'
import { MealPhoto } from '@/features/meals/MealPhoto'
import { totalsFromItems } from '@/lib/vision/schema'
import { t } from '@/i18n/fr'
import type { MealEntry, MealItem, MealSlot } from '@/types/models'

interface MealEditorSheetProps {
  open: boolean
  meal: MealEntry | null
  onClose: () => void
  onSave: (label: string, slot: MealSlot, items: MealItem[]) => void
  onDelete: (id: string) => void
  /** Re-runs the analysis on the same photo with a correction. */
  onRetry: (id: string, hint: string) => void
  /**
   * Loads the meal's photo. Absent on the blank « saisir à la main » sheet,
   * which has no photo to show.
   */
  photoUrlFor?: (id: string) => Promise<string | null>
}

const SLOTS: Array<{ value: MealSlot; label: string }> = [
  { value: 'breakfast', label: t.meals.slot.breakfast },
  { value: 'lunch', label: t.meals.slot.lunch },
  { value: 'dinner', label: t.meals.slot.dinner },
  { value: 'snack', label: t.meals.slot.snack },
]

const EMPTY_ITEM: MealItem = { name: '', quantity: '', kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 }

function toNumber(text: string): number {
  const parsed = Number(text.replace(',', '.'))
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : 0
}

/**
 * Correcting the model, line by line (PRD §6.6).
 *
 * The breakdown is editable rather than the total, because « le riz c'était 200 g
 * pas 300 » is a correction someone can actually make, while « ce repas fait 620
 * et pas 780 » is another guess. The total is recomputed live underneath so the
 * effect of a fix is visible while typing.
 */
export function MealEditorSheet({
  open,
  meal,
  onClose,
  onSave,
  onDelete,
  onRetry,
  photoUrlFor,
}: MealEditorSheetProps) {
  const [label, setLabel] = useState('')
  const [slot, setSlot] = useState<MealSlot>('lunch')
  const [items, setItems] = useState<MealItem[]>([])
  const [hint, setHint] = useState('')

  useEffect(() => {
    if (!open) return
    setHint(meal?.hint ?? '')
    // A null meal is the « saisir à la main » case: the sheet must open blank
    // rather than showing whatever was corrected last.
    setLabel(meal?.label ?? '')
    setSlot(meal?.slot ?? 'lunch')
    setItems(meal && meal.items.length > 0 ? meal.items : [EMPTY_ITEM])
  }, [open, meal])

  const patch = (index: number, next: Partial<MealItem>) =>
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...next } : item)))

  const totals = totalsFromItems(items.filter((item) => item.name.trim()))
  const named = items.filter((item) => item.name.trim())

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={t.meals.editTitle}
      className="max-h-[88vh] overflow-y-auto"
    >
      <div className="flex flex-col gap-3">
        <Input
          aria-label={t.meals.editLabel}
          value={label}
          placeholder={t.meals.editLabel}
          onChange={(event) => setLabel(event.target.value)}
        />

        {/* The plate, facing the numbers it produced. It used to be a 48px
            thumbnail in the day's list and nowhere else, which made a stored
            photo something you could never actually look at. */}
        {meal?.photoId && photoUrlFor ? (
          <MealPhoto
            mealId={meal.id}
            alt={meal.label || t.meals.title}
            load={photoUrlFor}
            className="h-40 w-full"
          />
        ) : null}

        <Segmented label={t.meals.slotLabel} value={slot} options={SLOTS} onChange={setSlot} />

        {meal?.status === 'done' && meal.source === 'ai' ? (
          <p className="text-xs text-muted-foreground">{t.meals.confidence[meal.confidence]}</p>
        ) : null}

        {/* Correcting the food by hand is slow when the model read the whole
            plate wrong. Naming the dish and re-running is one sentence, and the
            person holding the fork knows better than the photo does. */}
        {meal && meal.source !== 'manual' ? (
          <div className="rounded-lg border border-border p-2">
            <h3 className="text-sm font-semibold">{t.meals.hintTitle}</h3>
            <p className="mb-2 text-xs text-muted-foreground">{t.meals.hintHint}</p>
            {meal.photoId ? (
              <>
                <Textarea
                  aria-label={t.meals.hintTitle}
                  value={hint}
                  placeholder={t.meals.hintPlaceholder}
                  onChange={(event) => setHint(event.target.value)}
                />
                <Button
                  variant="secondary"
                  block
                  className="mt-2"
                  disabled={!hint.trim()}
                  onClick={() => onRetry(meal.id, hint.trim())}
                >
                  <RefreshCw size={16} aria-hidden />
                  {t.meals.hintSubmit}
                </Button>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">{t.meals.hintNoPhoto}</p>
            )}
          </div>
        ) : null}

        <ul className="flex flex-col gap-3">
          {items.map((item, index) => (
            <li key={index} className="rounded-lg border border-border p-2">
              <div className="flex items-center gap-2">
                <Input
                  aria-label={`${t.meals.itemName} ${index + 1}`}
                  value={item.name}
                  placeholder={t.meals.itemName}
                  onChange={(event) => patch(index, { name: event.target.value })}
                />
                <button
                  type="button"
                  aria-label={t.meals.removeItem(item.name || String(index + 1))}
                  onClick={() => setItems((current) => current.filter((_, i) => i !== index))}
                  className="flex h-touch w-touch shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Trash2 size={16} aria-hidden />
                </button>
              </div>

              <Input
                className="mt-2"
                aria-label={`${t.meals.itemQuantity} ${index + 1}`}
                value={item.quantity}
                placeholder={t.meals.itemQuantity}
                onChange={(event) => patch(index, { quantity: event.target.value })}
              />

              <div className="mt-2 grid grid-cols-4 gap-2">
                {(
                  [
                    ['kcal', t.meals.itemKcal],
                    ['proteinG', t.meals.itemProtein],
                    ['carbsG', t.meals.itemCarbs],
                    ['fatG', t.meals.itemFat],
                  ] as const
                ).map(([key, labelText]) => (
                  <label key={key} className="flex flex-col gap-1">
                    <span className="text-[11px] text-muted-foreground">{labelText}</span>
                    <Input
                      className="tnum px-2 text-center"
                      inputMode="numeric"
                      aria-label={`${labelText} ${index + 1}`}
                      value={String(item[key])}
                      onChange={(event) => patch(index, { [key]: toNumber(event.target.value) })}
                    />
                  </label>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <Button
          variant="secondary"
          block
          onClick={() => setItems((current) => [...current, EMPTY_ITEM])}
        >
          <Plus size={16} aria-hidden />
          {t.meals.addItem}
        </Button>

        <div className="flex items-baseline justify-between border-t border-border pt-3">
          <span className="text-sm text-muted-foreground">{t.meals.total}</span>
          <span className="tnum text-lg font-semibold">{t.meals.kcal(totals.kcal)}</span>
        </div>
        <p className="tnum text-xs text-muted-foreground">
          {t.meals.macros(totals.proteinG, totals.carbsG, totals.fatG)}
        </p>
        <p className="text-xs text-muted-foreground">{t.meals.proteinSynced}</p>

        <Button
          size="lg"
          block
          disabled={named.length === 0}
          onClick={() =>
            onSave(label.trim() || named.map((item) => item.name).join(', '), slot, named)
          }
        >
          {t.common.save}
        </Button>

        {meal ? (
          <Button variant="outline" block onClick={() => onDelete(meal.id)}>
            <Trash2 size={16} aria-hidden />
            {t.meals.delete}
          </Button>
        ) : null}
      </div>
    </Sheet>
  )
}
