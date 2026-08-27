import { Play, Repeat, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useClock } from '@/features/workouts/useClock'
import { CIRCUIT_BLOCKS, CIRCUIT_TARGET_MINUTES } from '@/db/seed'
import { elapsedSeconds, formatDuration } from '@/lib/timer'
import { t } from '@/i18n/fr'
import type { Exercise, ExerciseSet, MovementPattern, WorkoutSession } from '@/types/models'

interface CircuitCardProps {
  session: WorkoutSession | null
  sessionSets: ExerciseSet[]
  /** Chosen movement per block, so a block can be swapped without leaving the circuit. */
  blockExerciseIds: Record<MovementPattern, string>
  exerciseById: (id: string) => Exercise | undefined
  onStart: () => void
  onEnd: () => void
  onLog: (exerciseId: string) => void
  onChangeExercise: (pattern: MovementPattern) => void
}

export function CircuitCard({
  session,
  sessionSets,
  blockExerciseIds,
  exerciseById,
  onStart,
  onEnd,
  onLog,
  onChangeExercise,
}: CircuitCardProps) {
  // The clock only ticks while a session is open; idle screens do no work.
  const now = useClock(session !== null)
  const elapsed = session ? elapsedSeconds(new Date(session.startedAt).getTime(), now) : 0

  // The same list before and during the session: deciding whether to start means
  // seeing what the circuit contains, not starting it to find out.
  const blocks = (
    <ul className="flex flex-col gap-2">
      {CIRCUIT_BLOCKS.map((block) => {
        const exerciseId = blockExerciseIds[block.pattern]
        const exercise = exerciseById(exerciseId)
        const done = sessionSets.filter((set) => set.exerciseId === exerciseId).length
        return (
          <li
            key={block.pattern}
            className="flex items-center gap-2 rounded-lg border border-border p-2"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {t.workouts.block[block.pattern]}
              </p>
              <p className="truncate text-sm font-medium">{exercise?.name ?? '—'}</p>
              {exercise ? (
                <p className="tnum text-xs text-muted-foreground">
                  {t.workouts.repRangeSummary(
                    exercise.defaultRepRange[0],
                    exercise.defaultRepRange[1],
                  )}
                </p>
              ) : null}
            </div>
            {done > 0 ? <span className="tnum text-xs text-primary">×{done}</span> : null}
            <button
              type="button"
              aria-label={t.workouts.changeExercise}
              title={t.workouts.changeExercise}
              onClick={() => onChangeExercise(block.pattern)}
              className="h-touch w-touch flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Repeat size={16} aria-hidden />
            </button>
            {session ? (
              <Button
                variant="secondary"
                onClick={() => onLog(exerciseId)}
                aria-label={exercise ? t.workouts.logSetFor(exercise.name) : t.workouts.logSet}
              >
                {t.workouts.logSet}
              </Button>
            ) : null}
          </li>
        )
      })}
    </ul>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.workouts.circuitTitle}</CardTitle>
        <CardDescription>{t.workouts.circuitHint}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {session ? (
          <>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">{t.workouts.elapsed}</span>
              <span className="tnum text-3xl font-semibold">{formatDuration(elapsed)}</span>
            </div>

            {blocks}

            <Button variant="outline" block onClick={onEnd}>
              <Square size={18} aria-hidden />
              {t.workouts.endSession}
            </Button>
          </>
        ) : (
          <>
            <p className="tnum text-sm text-muted-foreground">
              {CIRCUIT_TARGET_MINUTES} min · {CIRCUIT_BLOCKS.length} blocs
            </p>

            <div>
              <h3 className="text-sm font-semibold">{t.workouts.circuitPlan}</h3>
              <p className="mb-2 text-xs text-muted-foreground">{t.workouts.circuitPlanHint}</p>
              {blocks}
            </div>

            <Button size="lg" block onClick={onStart}>
              <Play size={20} aria-hidden />
              {t.workouts.startCircuit}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
