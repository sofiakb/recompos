import { Timer, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { REST_EXTENSION_SECONDS, type RestTimerState } from '@/features/workouts/useRestTimer'
import { formatDuration } from '@/lib/timer'
import { t } from '@/i18n/fr'

interface RestTimerProps {
  timer: RestTimerState
}

/** Sticks above the tab bar while resting; nothing at all when not. */
export function RestTimer({ timer }: RestTimerProps) {
  if (!timer.running) return null

  const done = timer.remaining === 0
  const elapsed = timer.durationSeconds - timer.remaining

  return (
    <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 px-4">
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
