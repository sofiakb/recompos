import { cn } from '@/lib/utils'

interface RingProps {
  /** Outer square, in pixels. The radius is derived so the stroke sits inside it. */
  size: number
  stroke: number
  /** Progress, 0 to 1. Values past 1 are capped rather than wrapped. */
  ratio: number
  ariaLabel: string
  /** `muted` for the two macros the app has no opinion about. */
  accent?: 'primary' | 'muted'
  /** Whatever sits in the middle — a figure and its unit, usually. */
  children?: React.ReactNode
  className?: string
}

/**
 * A progress ring.
 *
 * It caps at 100 % while the figures inside keep counting: going over target is
 * never framed as a failure here, so the arc simply stops filling rather than
 * turning red or wrapping round for a second lap.
 *
 * Generalised out of the protein ring when the calorie total took the big ring
 * and protein moved to a smaller one. Two rings drawn by two components would
 * have drifted apart by the second change to either.
 */
export function Ring({
  size,
  stroke,
  ratio,
  ariaLabel,
  accent = 'primary',
  children,
  className,
}: Readonly<RingProps>) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const capped = Math.min(1, Math.max(0, ratio))
  const percent = Math.round(capped * 100)
  const arc = accent === 'primary' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={arc}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - capped)}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}
