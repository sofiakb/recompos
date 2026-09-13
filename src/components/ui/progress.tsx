import { cn } from '@/lib/utils'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  label?: string
  /** `muted` for a figure the app tracks without having an opinion about it. */
  accent?: 'primary' | 'muted'
}

export function Progress({
  value,
  max = 100,
  label,
  accent = 'primary',
  className,
  ...props
}: Readonly<ProgressProps>) {
  const percent = max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-muted/80', className)}
      {...props}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-300 ease-out',
          accent === 'primary' ? 'lit-accent lit-glow-sm' : 'bg-muted-foreground',
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
