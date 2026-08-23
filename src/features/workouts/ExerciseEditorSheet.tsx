import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Segmented } from '@/components/ui/segmented'
import { Sheet } from '@/components/ui/sheet'
import { t } from '@/i18n/fr'
import type { MovementPattern } from '@/types/models'

export interface ExerciseDraft {
  name: string
  pattern: MovementPattern
  defaultRepRange: [number, number]
}

interface ExerciseEditorSheetProps {
  open: boolean
  /** Pre-selected when the picker was opened for one circuit block. */
  defaultPattern?: MovementPattern
  onClose: () => void
  onSubmit: (draft: ExerciseDraft) => void
}

const PATTERN_OPTIONS = (['push', 'pull', 'legs', 'core', 'other'] as const).map((pattern) => ({
  value: pattern,
  label: t.workouts.block[pattern],
}))

export function ExerciseEditorSheet({
  open,
  defaultPattern = 'push',
  onClose,
  onSubmit,
}: ExerciseEditorSheetProps) {
  const [name, setName] = useState('')
  const [pattern, setPattern] = useState<MovementPattern>(defaultPattern)
  const [min, setMin] = useState('8')
  const [max, setMax] = useState('15')

  useEffect(() => {
    if (!open) return
    setName('')
    setPattern(defaultPattern)
    setMin('8')
    setMax('15')
  }, [open, defaultPattern])

  const low = Number(min)
  const high = Number(max)
  const isValid =
    name.trim().length > 0 &&
    Number.isFinite(low) &&
    Number.isFinite(high) &&
    low > 0 &&
    high >= low

  return (
    <Sheet open={open} onClose={onClose} title={t.workouts.newExerciseTitle}>
      <div className="flex flex-col gap-4">
        <Field label={t.workouts.exerciseName}>
          {(id) => (
            <Input
              id={id}
              autoFocus
              value={name}
              placeholder={t.workouts.exerciseNamePlaceholder}
              onChange={(event) => setName(event.target.value)}
            />
          )}
        </Field>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">{t.workouts.exercisePattern}</span>
          <Segmented
            label={t.workouts.exercisePattern}
            value={pattern}
            options={PATTERN_OPTIONS}
            onChange={setPattern}
            className="grid grid-cols-3"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">{t.workouts.repRange}</span>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              inputMode="numeric"
              aria-label={t.workouts.repRangeMin}
              value={min}
              onChange={(event) => setMin(event.target.value.replace(/\D/g, ''))}
              className="tnum text-center"
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="text"
              inputMode="numeric"
              aria-label={t.workouts.repRangeMax}
              value={max}
              onChange={(event) => setMax(event.target.value.replace(/\D/g, ''))}
              className="tnum text-center"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button
            className="flex-1"
            disabled={!isValid}
            onClick={() => {
              if (!isValid) return
              onSubmit({ name: name.trim(), pattern, defaultRepRange: [low, high] })
            }}
          >
            {t.common.save}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
