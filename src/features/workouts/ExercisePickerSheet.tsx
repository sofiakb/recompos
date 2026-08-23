import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { addCustomExercise, deleteCustomExercise } from '@/db/repositories/workoutRepository'
import { ExerciseEditorSheet, type ExerciseDraft } from '@/features/workouts/ExerciseEditorSheet'
import { useUiStore } from '@/stores/uiStore'
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
  const showToast = useUiStore((state) => state.showToast)
  const [editorOpen, setEditorOpen] = useState(false)

  const list = pattern ? exercises.filter((exercise) => exercise.pattern === pattern) : exercises

  const onCreate = async (draft: ExerciseDraft) => {
    const created = await addCustomExercise(draft.name, draft.pattern, draft.defaultRepRange)
    setEditorOpen(false)
    showToast(t.workouts.exerciseCreated(created.name))
    // Picking it straight away is what the user came for; a new movement is
    // almost never added except to log it right now.
    onPick(created)
  }

  const onDelete = async (exercise: Exercise) => {
    const result = await deleteCustomExercise(exercise.id)
    showToast(
      result === 'deleted' ? t.workouts.exerciseDeleted(exercise.name) : t.workouts.exerciseInUse,
    )
  }

  return (
    <>
      <Sheet
        open={open}
        onClose={onClose}
        title={t.workouts.pickExercise}
        className="max-h-[80vh] overflow-y-auto"
      >
        <ul className="flex flex-col">
          {list.map((exercise) => (
            <li key={exercise.id} className="flex items-center gap-1 border-b border-border/60">
              <button
                type="button"
                onClick={() => onPick(exercise)}
                aria-current={exercise.id === selectedId ? 'true' : undefined}
                className="flex min-h-touch flex-1 items-center justify-between gap-3 px-1 text-left transition-colors hover:bg-accent aria-[current]:text-primary"
              >
                <span className="min-w-0 truncate text-sm font-medium">
                  {exercise.name}
                  {exercise.isCustom ? (
                    <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-normal uppercase tracking-wide text-muted-foreground">
                      {t.workouts.customBadge}
                    </span>
                  ) : null}
                </span>
                <span className="tnum shrink-0 text-xs text-muted-foreground">
                  {exercise.defaultRepRange[0]}–{exercise.defaultRepRange[1]}
                </span>
              </button>
              {exercise.isCustom ? (
                <button
                  type="button"
                  aria-label={t.workouts.deleteExercise(exercise.name)}
                  onClick={() => void onDelete(exercise)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Trash2 size={16} aria-hidden />
                </button>
              ) : null}
            </li>
          ))}
        </ul>

        <Button variant="outline" block className="mt-3" onClick={() => setEditorOpen(true)}>
          <Plus size={18} aria-hidden />
          {t.workouts.addExercise}
        </Button>
      </Sheet>

      <ExerciseEditorSheet
        open={editorOpen}
        defaultPattern={pattern}
        onClose={() => setEditorOpen(false)}
        onSubmit={onCreate}
      />
    </>
  )
}
