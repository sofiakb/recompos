import { useId } from 'react'
import { cn } from '@/lib/utils'

export interface ChartPoint {
  label: string
  /** null draws a gap rather than a straight line through missing data. */
  value: number | null
}

interface LineChartProps {
  points: ChartPoint[]
  ariaLabel: string
  /** Optional dashed second series, same length as `points` — e.g. a rolling mean. */
  overlay?: Array<number | null>
  formatValue?: (value: number) => string
  className?: string
}

const WIDTH = 320
const HEIGHT = 140
const PAD = { left: 34, right: 8, top: 8, bottom: 18 }

/**
 * A small SVG line chart, hand-drawn.
 *
 * Recharts would bring roughly 100 kB gzip for three of these, against a 200 kB
 * budget for the whole shell (PRD §4). Two axes, a path and a fill are cheaper
 * to own than to import.
 */
export function LineChart({
  points,
  ariaLabel,
  overlay,
  formatValue = (value) => String(Math.round(value)),
  className,
}: LineChartProps) {
  const gradientId = useId()
  const values = [...points.map((point) => point.value), ...(overlay ?? [])].filter(
    (value): value is number => value !== null,
  )
  if (values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  // A flat series would divide by zero; give it a nominal span instead.
  const span = max - min || Math.max(1, Math.abs(max) * 0.1)
  const top = max + span * 0.1
  const bottom = min - span * 0.1

  const plotWidth = WIDTH - PAD.left - PAD.right
  const plotHeight = HEIGHT - PAD.top - PAD.bottom

  const x = (index: number) =>
    PAD.left + (points.length === 1 ? plotWidth / 2 : (index / (points.length - 1)) * plotWidth)
  const y = (value: number) =>
    PAD.top + plotHeight - ((value - bottom) / (top - bottom)) * plotHeight

  // Gaps split the line into segments so a break in the data reads as a break,
  // not as a straight line drawn through days that were never recorded.
  const segments: Array<Array<{ x: number; y: number }>> = []
  let current: Array<{ x: number; y: number }> = []
  points.forEach((point, index) => {
    if (point.value === null) {
      if (current.length > 1) segments.push(current)
      current = []
      return
    }
    current.push({ x: x(index), y: y(point.value) })
  })
  if (current.length > 1) segments.push(current)

  const toPolyline = (segment: Array<{ x: number; y: number }>) =>
    segment.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  const overlayPoints = (overlay ?? [])
    .map((value, index) => (value === null ? null : { x: x(index), y: y(value) }))
    .filter((point): point is { x: number; y: number } => point !== null)

  const lastSegment = segments[segments.length - 1]
  const baseline = PAD.top + plotHeight
  const area = lastSegment
    ? `M ${lastSegment[0].x.toFixed(1)},${baseline.toFixed(1)} L ${toPolyline(lastSegment)} L ${lastSegment[
        lastSegment.length - 1
      ].x.toFixed(1)},${baseline.toFixed(1)} Z`
    : null
  const lastDot = lastSegment?.[lastSegment.length - 1] ?? null

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={ariaLabel}
      className={cn('w-full', className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[top, (top + bottom) / 2, bottom].map((value, index) => (
        <g key={index}>
          <line
            x1={PAD.left}
            x2={WIDTH - PAD.right}
            y1={y(value)}
            y2={y(value)}
            stroke="hsl(var(--border))"
            strokeWidth={1}
          />
          <text
            x={PAD.left - 4}
            y={y(value) + 3}
            textAnchor="end"
            fontSize="8"
            fill="hsl(var(--muted-foreground))"
          >
            {formatValue(value)}
          </text>
        </g>
      ))}

      {area ? <path d={area} fill={`url(#${gradientId})`} /> : null}

      {segments.map((segment, index) => (
        <polyline
          key={index}
          points={toPolyline(segment)}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {overlayPoints.length > 1 ? (
        <polyline
          points={toPolyline(overlayPoints)}
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}

      {lastDot ? <circle cx={lastDot.x} cy={lastDot.y} r={3} fill="hsl(var(--primary))" /> : null}

      <text x={PAD.left} y={HEIGHT - 4} fontSize="8" fill="hsl(var(--muted-foreground))">
        {points[0]?.label}
      </text>
      <text
        x={WIDTH - PAD.right}
        y={HEIGHT - 4}
        textAnchor="end"
        fontSize="8"
        fill="hsl(var(--muted-foreground))"
      >
        {points[points.length - 1]?.label}
      </text>
    </svg>
  )
}
