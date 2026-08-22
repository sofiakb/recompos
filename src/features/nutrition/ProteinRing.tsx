import { t } from '@/i18n/fr'

interface ProteinRingProps {
  totalGrams: number
  targetGrams: number
  remainingGrams: number
}

const SIZE = 176
const STROKE = 14
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * The day's progress at a glance.
 *
 * The ring caps at 100% while the figures keep counting: going over target is
 * never framed as a failure, so the arc simply stops filling.
 */
export function ProteinRing({ totalGrams, targetGrams, remainingGrams }: ProteinRingProps) {
  const ratio = targetGrams === 0 ? 0 : Math.min(1, totalGrams / targetGrams)
  const percent = Math.round(ratio * 100)

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t.today.proteinTitle}
        className="-rotate-90"
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - ratio)}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="tnum text-4xl font-semibold leading-none">{totalGrams}</p>
        <p className="tnum mt-1 text-sm text-muted-foreground">
          {t.nutrition.ofTarget(targetGrams)}
        </p>
        <p className="tnum mt-2 text-xs text-primary">
          {remainingGrams > 0 ? t.nutrition.remaining(remainingGrams) : t.nutrition.targetReached}
        </p>
      </div>
    </div>
  )
}
