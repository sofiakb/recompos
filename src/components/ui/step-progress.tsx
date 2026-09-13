import { cn } from '@/lib/utils'

interface StepProgressProps {
  /** 0-based index of the step being shown. */
  step: number
  total: number
  className?: string
}

/**
 * The progress rail of a guided flow: one node per step on a single track, the
 * travelled part lit by the accent and the current node haloed.
 *
 * Decorative — the step is announced in words next to it ("1 / 3"), so the rail
 * itself stays out of the accessibility tree rather than repeating it.
 */
export function StepProgress({ step, total, className }: StepProgressProps) {
  return (
    <div className={cn('flex items-center', className)} aria-hidden>
      {Array.from({ length: total }, (_, i) => {
        const done = i <= step
        return (
          <div key={i} className="flex flex-1 items-center last:flex-none">
            <span
              className={cn(
                'h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-300',
                done ? 'lit-accent' : 'bg-muted',
                i === step && 'lit-glow-sm',
              )}
            />
            {i < total - 1 ? (
              <span
                className={cn(
                  'h-[3px] flex-1 rounded-full transition-colors duration-300',
                  i < step ? 'lit-accent' : 'bg-muted',
                )}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
