import { Sheet } from '@/components/ui/sheet'
import { t } from '@/i18n/fr'
import type { Exercise, MovementPattern } from '@/types/models'

interface ExercisePickerSheetProps {
  open: boolean
  exercises: Exercise[]
  /** Restricts the list to one movement pattern, for a circuit block. */
  pattern?: MovementPattern
  selectedId?: string
  onClose: () => void
  onPick: (exercise: Exercise) => void
}

export function ExercisePickerSheet({
  open,
  exercises,
  pattern,
  selectedId,
  onClose,
  onPick,
}: ExercisePickerSheetProps) {
  const list = pattern ? exercises.filter((exercise) => exercise.pattern === pattern) : exercises

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={t.workouts.pickExercise}
      className="max-h-[80vh] overflow-y-auto"
    >
      <ul className="flex flex-col">
        {list.map((exercise) => (
          <li key={exercise.id}>
            <button
              type="button"
              onClick={() => onPick(exercise)}
              aria-current={exercise.id === selectedId ? 'true' : undefined}
              className="flex min-h-touch w-full items-center justify-between gap-3 border-b border-border/60 px-1 text-left transition-colors hover:bg-accent aria-[current]:text-primary"
            >
              <span className="text-sm font-medium">{exercise.name}</span>
              <span className="tnum text-xs text-muted-foreground">
                {exercise.defaultRepRange[0]}–{exercise.defaultRepRange[1]}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  )
}
