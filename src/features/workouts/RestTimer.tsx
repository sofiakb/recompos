import { Timer, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { REST_EXTENSION_SECONDS, type RestTimerState } from '@/features/workouts/useRestTimer'
import { formatDuration } from '@/lib/timer'
import { t } from '@/i18n/fr'

interface RestTimerProps {
  timer: RestTimerState
}

/**
 * A sticky bar under the header while resting, and nothing at all when not.
 *
 * Floating it above the tab bar put it in the same corner as the quick-action
 * button, which covered its own controls. Sticking it to the top keeps it
 * visible through a scroll without fighting anything for the space.
 */
export function RestTimer({ timer }: RestTimerProps) {
  if (!timer.running) return null

  const done = timer.remaining === 0
  const elapsed = timer.durationSeconds - timer.remaining

  return (
    <div className="sticky top-0 z-30 bg-background/95 px-4 py-2 backdrop-blur">
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-lg">
        <div className="flex items-center gap-3">
          <Timer size={18} className="text-muted-foreground" aria-hidden />
          <span className="text-sm text-muted-foreground">
            {done ? t.workouts.restDone : t.workouts.rest}
          </span>
          <span
            className="tnum ml-auto text-xl font-semibold"
            role="timer"
            aria-live="off"
            aria-label={t.workouts.rest}
          >
            {formatDuration(timer.remaining)}
          </span>
        </div>
        <Progress value={elapsed} max={timer.durationSeconds} label={t.workouts.rest} />
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={timer.extend}>
            +{REST_EXTENSION_SECONDS} s
          </Button>
          <Button variant="secondary" className="flex-1" onClick={timer.stop}>
            <X size={16} aria-hidden />
            {done ? t.common.done : t.workouts.restSkip}
          </Button>
        </div>
      </div>
    </div>
  )
}
