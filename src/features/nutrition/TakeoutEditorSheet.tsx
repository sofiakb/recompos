import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input, Textarea } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { MAX_PROTEIN_LOG_GRAMS } from '@/lib/nutrition'
import { t } from '@/i18n/fr'
import type { TakeoutOption } from '@/types/models'

export type TakeoutDraft = Pick<
  TakeoutOption,
  'cuisine' | 'pick' | 'avoid' | 'estimatedProteinGrams'
>

interface TakeoutEditorSheetProps {
  open: boolean
  /** null creates a new entry, an option edits it. */
  option: TakeoutOption | null
  onClose: () => void
  onSubmit: (draft: TakeoutDraft) => void
}

export function TakeoutEditorSheet({ open, option, onClose, onSubmit }: TakeoutEditorSheetProps) {
  const [cuisine, setCuisine] = useState('')
  const [pick, setPick] = useState('')
  const [avoid, setAvoid] = useState('')
  const [grams, setGrams] = useState('')

  useEffect(() => {
    if (!open) return
    setCuisine(option?.cuisine ?? '')
    setPick(option?.pick ?? '')
    setAvoid(option?.avoid ?? '')
    setGrams(option?.estimatedProteinGrams ? String(option.estimatedProteinGrams) : '')
  }, [open, option])

  const parsed = Number(grams)
  const gramsValid = grams === '' || (Number.isFinite(parsed) && parsed <= MAX_PROTEIN_LOG_GRAMS)
  const isValid = cuisine.trim().length > 0 && pick.trim().length > 0 && gramsValid

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={option ? t.nutrition.takeoutEdit : t.nutrition.takeoutNew}
      className="max-h-[88vh] overflow-y-auto"
    >
      <div className="flex flex-col gap-4">
        <Field label={t.nutrition.fieldCuisine}>
          {(id) => (
            <Input
              id={id}
              autoFocus
              value={cuisine}
              placeholder={t.nutrition.fieldCuisinePlaceholder}
              onChange={(event) => setCuisine(event.target.value)}
            />
          )}
        </Field>

        <Field label={t.nutrition.fieldPick}>
          {(id) => (
            <Textarea
              id={id}
              value={pick}
              placeholder={t.nutrition.fieldPickPlaceholder}
              onChange={(event) => setPick(event.target.value)}
            />
          )}
        </Field>

        <Field label={t.nutrition.fieldAvoid}>
          {(id) => (
            <Textarea
              id={id}
              value={avoid}
              placeholder={t.nutrition.fieldAvoidPlaceholder}
              onChange={(event) => setAvoid(event.target.value)}
            />
          )}
        </Field>

        <Field label={t.nutrition.fieldEstimate}>
          {(id) => (
            <div className="flex items-center gap-2">
              <Input
                id={id}
                type="text"
                inputMode="numeric"
                value={grams}
                placeholder="45"
                onChange={(event) => setGrams(event.target.value.replace(/\D/g, ''))}
                className="tnum"
              />
              <span className="text-muted-foreground">g</span>
            </div>
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
                cuisine: cuisine.trim(),
                pick: pick.trim(),
                avoid: avoid.trim(),
                // No estimate is a valid answer: the entry is still worth having
                // as a decision aid, it just gets no 1-tap log button.
                estimatedProteinGrams: grams === '' ? undefined : Math.round(parsed),
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
