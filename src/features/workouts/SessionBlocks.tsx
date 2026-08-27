import { Button } from '@/components/ui/button'
import { CIRCUIT_BLOCKS } from '@/db/seed'
import { t } from '@/i18n/fr'
import type { OverloadSuggestion } from '@/lib/overload'
import type { Exercise, ExerciseSet, MovementPattern } from '@/types/models'

interface SessionBlocksProps {
  sessionSets: ExerciseSet[]
  blockExerciseIds: Record<MovementPattern, string>
  exerciseById: (id: string) => Exercise | undefined
  /** What to aim for on the next set, or null on a movement with no history. */
  suggestionFor: (exerciseId: string) => OverloadSuggestion | null
  onLog: (exerciseId: string) => void
}

/**
 * The three blocks while the session is open: one card each, with what was
 * done so far and the way to add to it.
 */
export function SessionBlocks({
  sessionSets,
  blockExerciseIds,
  exerciseById,
  suggestionFor,
  onLog,
}: SessionBlocksProps) {
  return (
    <div className="flex flex-col gap-3">
      {CIRCUIT_BLOCKS.map((block) => {
        const exerciseId = blockExerciseIds[block.pattern]
        const exercise = exerciseById(exerciseId)
        const done = sessionSets.filter((set) => set.exerciseId === exerciseId).length
        const suggestion = suggestionFor(exerciseId)
        return (
          <section
            key={block.pattern}
            className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  {t.workouts.block[block.pattern]}
                </p>
                <p className="truncate text-base font-medium">{exercise?.name ?? '—'}</p>
                {suggestion ? (
                  <p className="tnum text-xs text-muted-foreground">
                    {t.workouts.suggestion} :{' '}
                    {t.workouts.setSummary(suggestion.reps, suggestion.loadOrResistance)}
                  </p>
                ) : null}
              </div>
              {done > 0 ? (
                <span className="tnum shrink-0 text-sm font-semibold text-primary">×{done}</span>
              ) : null}
            </div>
            <Button
              variant="secondary"
              block
              onClick={() => onLog(exerciseId)}
              aria-label={exercise ? t.workouts.logSetFor(exercise.name) : t.workouts.logSet}
            >
              {t.workouts.logHere}
            </Button>
          </section>
        )
      })}
    </div>
  )
}
