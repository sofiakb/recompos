import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { toMealItem, type Food } from '@/lib/foods/food'
import { t } from '@/i18n/fr'
import type { MealItem } from '@/types/models'

interface PortionSheetProps {
  open: boolean
  food: Food
  onClose: () => void
  onAdd: (item: MealItem) => void
}

/**
 * The one question no table can answer: how much of it.
 *
 * A barcode and a name both end with exact figures per 100 g and one unknown,
 * so both end here. It is the only thing this sheet asks, pre-filled with the
 * manufacturer's serving when the record names one — CIQUAL never does, and
 * 100 g is then the honest default rather than an invented portion.
 */
export function PortionSheet({ open, food, onClose, onAdd }: Readonly<PortionSheetProps>) {
  const [grams, setGrams] = useState(String(food.servingGrams))

  useEffect(() => {
    if (open) setGrams(String(food.servingGrams))
  }, [open, food])

  const parsed = Number(grams.replace(',', '.'))
  const valid = Number.isFinite(parsed) && parsed > 0
  const item = toMealItem(food, valid ? parsed : 0)

  return (
    <Sheet open={open} onClose={onClose} title={t.foods.portion.title}>
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-base font-semibold">{food.name}</p>
          {food.brand ? <p className="text-sm text-muted-foreground">{food.brand}</p> : null}
        </div>

        <Field label={t.foods.portion.gramsLabel}>
          {(id) => (
            <Input
              id={id}
              inputMode="numeric"
              className="tnum"
              value={grams}
              onChange={(event) => setGrams(event.target.value)}
            />
          )}
        </Field>

        <div className="rounded-lg border border-border p-3">
          <p className="tnum text-lg font-semibold">{t.meals.kcal(item.kcal)}</p>
          <p className="tnum text-xs text-muted-foreground">
            {t.meals.macros(item.proteinG, item.carbsG, item.fatG)}
          </p>
        </div>

        {food.missingMacros.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            {t.foods.portion.missingMacros(
              food.missingMacros.map(
                (key) => t.foods.portion.macroName[key as 'proteinG' | 'carbsG' | 'fatG'],
              ),
            )}
          </p>
        ) : null}

        <Button size="lg" block disabled={!valid} onClick={() => onAdd(item)}>
          <Plus size={16} aria-hidden />
          {t.foods.portion.add}
        </Button>
      </div>
    </Sheet>
  )
}
