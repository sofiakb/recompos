import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { toMealItem, type OffProduct } from '@/lib/off/product'
import { t } from '@/i18n/fr'
import type { MealItem } from '@/types/models'

interface ProductSheetProps {
  open: boolean
  product: OffProduct
  onClose: () => void
  onAdd: (item: MealItem) => void
}

/**
 * The one question a scan cannot answer: how much of it.
 *
 * The barcode gives exact figures per 100 g, and the portion is the only guess
 * left in the chain — so it is the only thing this sheet asks, pre-filled with
 * the manufacturer's serving when there is one.
 */
export function ProductSheet({ open, product, onClose, onAdd }: Readonly<ProductSheetProps>) {
  const [grams, setGrams] = useState(String(product.servingGrams))

  useEffect(() => {
    if (open) setGrams(String(product.servingGrams))
  }, [open, product])

  const parsed = Number(grams.replace(',', '.'))
  const valid = Number.isFinite(parsed) && parsed > 0
  const item = toMealItem(product, valid ? parsed : 0)

  return (
    <Sheet open={open} onClose={onClose} title={t.barcode.productTitle}>
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-base font-semibold">{product.name}</p>
          {product.brand ? <p className="text-sm text-muted-foreground">{product.brand}</p> : null}
        </div>

        <Field label={t.barcode.gramsLabel}>
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

        {product.missingMacros.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            {t.barcode.missingMacros(
              product.missingMacros.map(
                (key) => t.barcode.macroName[key as 'proteinG' | 'carbsG' | 'fatG'],
              ),
            )}
          </p>
        ) : null}

        <Button size="lg" block disabled={!valid} onClick={() => onAdd(item)}>
          <Plus size={16} aria-hidden />
          {t.barcode.add}
        </Button>
      </div>
    </Sheet>
  )
}
