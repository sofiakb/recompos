import { cn } from '@/lib/utils'
import { t } from '@/i18n/fr'

interface FloorCounterProps {
  done: number
  total: number
  /** One bar per floor habit, in order, so the shape of the day is readable. */
  states: boolean[]
}

/**
 * The first thing the screen answers: how much of the floor is left.
 *
 * A count, not a percentage — with two or three habits a percentage jumps in
 * thirds and reads as a score. The floor is a checklist, not a grade.
 */
export function FloorCounter({ done, total, states }: FloorCounterProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-4">
        <p className="flex items-baseline">
          <span className="figure text-[56px] font-semibold">
            {done}
          </span>
          <span className="tnum text-2xl font-medium text-muted-foreground"> / {total}</span>
        </p>
        <p className="max-w-[150px] text-right text-[13px] leading-tight text-muted-foreground">
          {t.today.floorCounter}
        </p>
      </div>
      <div className="flex gap-1.5" aria-hidden>
        {states.map((complete, index) => (
          <span
            key={index}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors duration-300',
              complete ? 'lit-accent lit-glow-sm' : 'bg-muted',
            )}
          />
        ))}
      </div>
    </div>
  )
}
