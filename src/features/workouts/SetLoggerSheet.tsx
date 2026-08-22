import { useEffect, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Segmented } from '@/components/ui/segmented'
import { Sheet } from '@/components/ui/sheet'
import { DEFAULT_LOAD, type OverloadSuggestion } from '@/lib/overload'
import { t } from '@/i18n/fr'
import type { Exercise, ExerciseSet, SetDifficulty } from '@/types/models'

export interface SetDraft {
  exerciseId: string
  reps: number
  loadOrResistance: string
  difficulty: SetDifficulty
}

interface SetLoggerSheetProps {
  open: boolean
  /** The movement to log — already the harder variant when the suggestion progressed. */
  exercise: Exercise | null
  suggestion: OverloadSuggestion | null
  lastSet: ExerciseSet | null
  /** Name of the movement the suggestion moved on from, if it did. */
  progressedFromName?: string
  onClose: () => void
  onSubmit: (draft: SetDraft) => void
}

const DIFFICULTY_OPTIONS = [
  { value: 'easy' as const, label: t.workouts.difficultyLabel.easy },
  { value: 'target' as const, label: t.workouts.difficultyLabel.target },
  { value: 'hard' as const, label: t.workouts.difficultyLabel.hard },
]

export function SetLoggerSheet({
  open,
  exercise,
  suggestion,
  lastSet,
  progressedFromName,
  onClose,
  onSubmit,
}: SetLoggerSheetProps) {
  const [reps, setReps] = useState(0)
  const [load, setLoad] = useState(DEFAULT_LOAD)
  // Defaults to « Cible »: it is the honest answer for a set that went as planned,
  // and it keeps the next suggestion moving by one rep rather than two.
  const [difficulty, setDifficulty] = useState<SetDifficulty>('target')

  useEffect(() => {
    if (!open) return
    setReps(suggestion?.reps ?? 8)
    setLoad(suggestion?.loadOrResistance ?? DEFAULT_LOAD)
    setDifficulty('target')
  }, [open, suggestion])

  if (!exercise) return null

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={exercise.name}
      className="max-h-[88vh] overflow-y-auto"
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-lg bg-muted/60 p-3 text-sm">
          <p className="text-muted-foreground">
            {lastSet
              ? `${t.workouts.lastTime} : ${t.workouts.lastSet(lastSet.reps, lastSet.loadOrResistance || DEFAULT_LOAD)}`
              : t.workouts.firstTime}
          </p>
          {progressedFromName ? (
            <p className="mt-1 text-primary">{t.workouts.progressedTo(exercise.name)}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">{t.workouts.reps}</span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              aria-label="-1"
              onClick={() => setReps((n) => Math.max(1, n - 1))}
            >
              <Minus size={20} aria-hidden />
            </Button>
            <input
              type="text"
              inputMode="numeric"
              aria-label={t.workouts.reps}
              value={reps}
              onChange={(event) => {
                const parsed = Number(event.target.value.replace(/\D/g, ''))
                setReps(Number.isFinite(parsed) ? parsed : 0)
              }}
              className="tnum min-h-touch flex-1 rounded-lg border border-border bg-background text-center text-3xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              variant="outline"
              size="icon"
              aria-label="+1"
              onClick={() => setReps((n) => n + 1)}
            >
              <Plus size={20} aria-hidden />
            </Button>
          </div>
        </div>

        <Field label={t.workouts.load}>
          {(id) => (
            <Input
              id={id}
              value={load}
              placeholder={t.workouts.loadPlaceholder}
              onChange={(event) => setLoad(event.target.value)}
            />
          )}
        </Field>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">{t.workouts.difficulty}</span>
          <Segmented
            label={t.workouts.difficulty}
            value={difficulty}
            options={DIFFICULTY_OPTIONS}
            onChange={setDifficulty}
          />
        </div>

        <Button
          size="lg"
          block
          disabled={reps < 1}
          onClick={() =>
            onSubmit({
              exerciseId: exercise.id,
              reps,
              loadOrResistance: load.trim() || DEFAULT_LOAD,
              difficulty,
            })
          }
        >
          {t.workouts.saveSet}
        </Button>
      </div>
    </Sheet>
  )
}
