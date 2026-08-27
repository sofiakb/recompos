import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { t } from '@/i18n/fr'
import type { FloorHabitDefinition } from '@/types/models'

interface NowCardProps {
  /** The habit to do next, or null when the floor is complete. */
  habit: FloorHabitDefinition | null
  onDone: () => void
  /** Absent when it is the only one left: there is nowhere to postpone to. */
  onLater?: () => void
}

/**
 * One habit at a time.
 *
 * The floor is meant to be small enough to finish on a bad day; showing all of
 * it at once turns three easy things into one list to get through. When it is
 * done the card goes quiet rather than disappearing, so the screen ends on
 * something rather than on a gap.
 */
export function NowCard({ habit, onDone, onLater }: NowCardProps) {
  if (!habit) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-primary/40 bg-card p-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check size={18} strokeWidth={3} aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">{t.today.dayValidated}</h2>
          <p className="text-sm text-muted-foreground">{t.today.floorDoneHint}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3.5 rounded-lg border border-primary/40 bg-card p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-primary">
        {t.today.now}
      </p>
      <h2 className="text-pretty text-lg font-semibold">{habit.title}</h2>
      <div className="flex flex-col gap-2">
        <Button block onClick={onDone} className="active:scale-[0.98]">
          <Check size={18} strokeWidth={3} aria-hidden />
          {t.today.markDone}
        </Button>
        {/* Writes nothing: it only moves to the next one. */}
        {onLater ? (
          <Button variant="ghost" block onClick={onLater} className="text-muted-foreground">
            {t.today.later}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
