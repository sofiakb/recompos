import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { MAX_PROTEIN_LOG_GRAMS } from '@/lib/nutrition'
import { t } from '@/i18n/fr'
import type { ZeroCookItem } from '@/types/models'

export type ZeroCookDraft = Pick<ZeroCookItem, 'name' | 'proteinPerServingGrams' | 'servingLabel'>

interface ZeroCookEditorSheetProps {
  open: boolean
  /** null creates a new source, an item edits it. */
  item: ZeroCookItem | null
  onClose: () => void
  onSubmit: (draft: ZeroCookDraft) => void
}

export function ZeroCookEditorSheet({ open, item, onClose, onSubmit }: ZeroCookEditorSheetProps) {
  const [name, setName] = useState('')
  const [grams, setGrams] = useState('')
  const [serving, setServing] = useState('')

  useEffect(() => {
    if (!open) return
    setName(item?.name ?? '')
    setGrams(item ? String(item.proteinPerServingGrams) : '')
    setServing(item?.servingLabel ?? '')
  }, [open, item])

  const parsed = Number(grams)
  const isValid =
    name.trim().length > 0 &&
    Number.isFinite(parsed) &&
    parsed > 0 &&
    parsed <= MAX_PROTEIN_LOG_GRAMS

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={item ? t.nutrition.zeroCookEdit : t.nutrition.zeroCookNew}
    >
      <div className="flex flex-col gap-4">
        <Field label={t.nutrition.fieldName}>
          {(id) => (
            <Input
              id={id}
              autoFocus
              value={name}
              placeholder="Skyr nature"
              onChange={(event) => setName(event.target.value)}
            />
          )}
        </Field>

        <Field label={t.nutrition.fieldGrams}>
          {(id) => (
            <div className="flex items-center gap-2">
              <Input
                id={id}
                type="text"
                inputMode="numeric"
                value={grams}
                placeholder="17"
                onChange={(event) => setGrams(event.target.value.replace(/\D/g, ''))}
                className="tnum"
              />
              <span className="text-muted-foreground">g</span>
            </div>
          )}
        </Field>

        <Field label={t.nutrition.fieldServing}>
          {(id) => (
            <Input
              id={id}
              value={serving}
              placeholder={t.nutrition.fieldServingPlaceholder}
              onChange={(event) => setServing(event.target.value)}
            />
          )}
        </Field>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button
            className="flex-1"
            disabled={!isValid}
            onClick={() => {
              if (!isValid) return
              onSubmit({
                name: name.trim(),
                proteinPerServingGrams: Math.round(parsed),
                // An empty portion label reads better as the amount itself than
                // as a blank line under the name.
                servingLabel: serving.trim() || `${Math.round(parsed)} g de protéines`,
              })
            }}
          >
            {t.common.save}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
