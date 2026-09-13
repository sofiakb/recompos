import { cn } from '@/lib/utils'
import { TapTarget } from '@/components/ui/tap-target'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedProps<T extends string> {
  label: string
  value: T
  options: ReadonlyArray<SegmentedOption<T>>
  onChange: (value: T) => void
  className?: string
}

/**
 * A radio group that looks like a row of buttons.
 *
 * Real radio semantics rather than buttons with `aria-pressed`: it is a choice
 * between exclusive values, and arrow keys should move between them.
 */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('flex gap-1 rounded-full border border-border/60 bg-muted/50 p-1', className)}
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <TapTarget
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'min-h-touch flex-1 rounded-full px-2 text-sm font-medium transition-[color,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              // The selected option is a raised panel, not a block of accent:
              // the accent is spent on what to do next, never on where you are.
              selected
                ? 'lit-surface border border-primary/25 text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {option.label}
          </TapTarget>
        )
      })}
    </div>
  )
}
