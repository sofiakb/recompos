import { Play, Repeat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CIRCUIT_BLOCKS } from '@/db/seed'
import { t } from '@/i18n/fr'
import type { Exercise, MovementPattern } from '@/types/models'
import { TapTarget } from '@/components/ui/tap-target'

interface CircuitPlanProps {
  blockExerciseIds: Record<MovementPattern, string>
  exerciseById: (id: string) => Exercise | undefined
  onStart: () => void
  onChangeExercise: (pattern: MovementPattern) => void
}

/**
 * What the circuit contains, before starting it.
 *
 * Deciding whether to start means seeing the three movements — the first
 * version made you start the session to find out what was in it.
 */
export function CircuitPlan({
  blockExerciseIds,
  exerciseById,
  onStart,
  onChangeExercise,
}: CircuitPlanProps) {
  return (
    <section className="flex flex-col gap-3.5 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">{t.workouts.circuitTitle}</h2>
        <p className="text-[13px] text-muted-foreground">{t.workouts.circuitHint}</p>
      </div>

      <ul className="flex flex-col">
        {CIRCUIT_BLOCKS.map((block) => {
          const exercise = exerciseById(blockExerciseIds[block.pattern])
          return (
            <li
              key={block.pattern}
              className="flex items-center gap-3 border-b border-border/60 py-2 last:border-0"
            >
              <span className="w-24 shrink-0 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                {t.workouts.block[block.pattern]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium">
                  {exercise?.name ?? '—'}
                </span>
                {exercise ? (
                  <span className="tnum block text-xs text-muted-foreground">
                    {t.workouts.repRangeSummary(
                      exercise.defaultRepRange[0],
                      exercise.defaultRepRange[1],
                    )}
                  </span>
                ) : null}
              </span>
              <TapTarget
                type="button"
                aria-label={t.workouts.changeExercise}
                title={t.workouts.changeExercise}
                onClick={() => onChangeExercise(block.pattern)}
                className="flex h-touch w-touch shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Repeat size={18} aria-hidden />
              </TapTarget>
            </li>
          )
        })}
      </ul>

      <Button size="lg" block onClick={onStart}>
        <Play size={20} aria-hidden />
        {t.workouts.startCircuit}
      </Button>
    </section>
  )
}
