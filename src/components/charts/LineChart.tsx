import { useId } from 'react'
import { cn } from '@/lib/utils'

export interface ChartPoint {
  label: string
  /** null draws a gap rather than a straight line through missing data. */
  value: number | null
}

/**
 * A second reading of the same numbers, drawn in the right-hand gutter.
 *
 * Not a second series: BMI is weight over a constant, so a second polyline would
 * lie exactly on top of the first. Only the graduations change unit.
 */
export interface SecondaryAxis {
  /** Unit title above the gutter, e.g. `IMC`. */
  label: string
  convert: (value: number) => number
}

/**
 * A horizontal line the series is read against — a threshold, not a series.
 *
 * It joins the vertical domain, so the line is always inside the drawing: a
 * reference the chart crops away is worse than no reference at all.
 */
export interface ChartReference {
  value: number
  /** Sits above the line, at the left. Names what the line is, e.g. `IMC 25`. */
  label: string
}

interface LineChartProps {
  points: ChartPoint[]
  ariaLabel: string
  /** Optional dashed second series, same length as `points` — e.g. a rolling mean. */
  overlay?: Array<number | null>
  formatValue?: (value: number) => string
  /** Unit title above the left axis, e.g. `kg`. Only drawn when given. */
  unit?: string
  secondaryAxis?: SecondaryAxis
  reference?: ChartReference
  className?: string
}

const WIDTH = 320
const HEIGHT = 140
const PAD = { left: 34, right: 8, top: 8, bottom: 18 }
/** Mirrors the left gutter, so the right-hand labels have the same room. */
const SECONDARY_PAD_RIGHT = 34

/**
 * Enough decimals for the axis labels to differ.
 *
 * A weight series that moves by 300 g rounds to the same integer three times
 * over, and an axis that reads « 78 / 78 / 78 » says nothing. Precision is
 * chosen from the ticks themselves rather than fixed per chart, so a series
 * spanning kilos still reads in whole numbers.
 */
function pickDecimals(ticks: number[]): number {
  for (const decimals of [0, 1, 2]) {
    const labels = new Set(ticks.map((value) => value.toFixed(decimals)))
    if (labels.size === ticks.length) return decimals
  }
  return 2
}

interface Pt {
  x: number
  y: number
}

const f = (value: number) => value.toFixed(1)

/**
 * The bezier controls of a monotone cubic spline, first segment first.
 *
 * A plain polyline turns a weight series into a folded sheet, and the folds
 * read as events the body never had. A spline is the fix, but not any spline:
 * Catmull-Rom overshoots around a peak, so a weigh-in of 78,3 kg sitting between
 * two lower ones would be *drawn* at 78,6 — a weight that was never recorded.
 * Fritsch-Carlson tangents flatten to zero at every local extreme, which keeps
 * the curve monotone wherever the data is: it never leaves the interval its own
 * points define.
 *
 * Returns the commands after the opening `M`, so the line and the area beneath
 * it share one curve rather than compute it twice.
 */
function curveCommands(pts: Pt[]): string {
  const n = pts.length
  const dx: number[] = []
  const slope: number[] = []
  for (let i = 0; i < n - 1; i += 1) {
    dx[i] = pts[i + 1].x - pts[i].x
    slope[i] = (pts[i + 1].y - pts[i].y) / dx[i]
  }

  const tangent: number[] = [slope[0]]
  for (let i = 1; i < n - 1; i += 1) {
    if (slope[i - 1] * slope[i] <= 0) {
      // A peak or a trough: a flat tangent is what keeps the curve inside its
      // points instead of bulging past them.
      tangent[i] = 0
    } else {
      const before = 2 * dx[i] + dx[i - 1]
      const after = dx[i] + 2 * dx[i - 1]
      tangent[i] = (before + after) / (before / slope[i - 1] + after / slope[i])
    }
  }
  tangent[n - 1] = slope[n - 2]

  let commands = ''
  for (let i = 0; i < n - 1; i += 1) {
    const third = dx[i] / 3
    const c1 = { x: pts[i].x + third, y: pts[i].y + tangent[i] * third }
    const c2 = { x: pts[i + 1].x - third, y: pts[i + 1].y - tangent[i + 1] * third }
    commands += ` C ${f(c1.x)},${f(c1.y)} ${f(c2.x)},${f(c2.y)} ${f(pts[i + 1].x)},${f(pts[i + 1].y)}`
  }
  return commands
}

/** The drawn line through a run of points. */
function curvePath(pts: Pt[]): string {
  return `M ${f(pts[0].x)},${f(pts[0].y)}${curveCommands(pts)}`
}

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
  formatValue,
  unit,
  secondaryAxis,
  reference,
  className,
}: Readonly<LineChartProps>) {
  const gradientId = useId()
  const values = [...points.map((point) => point.value), ...(overlay ?? [])].filter(
    (value): value is number => value !== null,
  )
  if (values.length < 2) return null

  // The reference stretches the domain but never the ticks: the axis keeps
  // reading the weights actually recorded, and the line labels itself.
  const domain = reference ? [...values, reference.value] : values
  const min = Math.min(...domain)
  const max = Math.max(...domain)
  // A flat series would divide by zero; give it a nominal span instead.
  const span = max - min || Math.max(1, Math.abs(max) * 0.1)
  const top = max + span * 0.1
  const bottom = min - span * 0.1

  // Ticks sit on the data itself, not on the padded extremes: the top gridline
  // marks the highest point recorded rather than an invented ceiling.
  const dataMin = Math.min(...values)
  const dataMax = Math.max(...values)
  const ticks = dataMin === dataMax ? [dataMin] : [dataMax, (dataMin + dataMax) / 2, dataMin]
  const decimals = pickDecimals(ticks)
  const label = formatValue ?? ((value: number) => value.toFixed(decimals).replace('.', ','))

  // The right-hand gutter gets its own precision: converted ticks can land far
  // closer together than the ones they came from, and « 25 / 25 / 25 » would
  // read as a broken axis rather than as a narrow range.
  const secondaryTicks = secondaryAxis ? ticks.map(secondaryAxis.convert) : []
  const secondaryDecimals = pickDecimals(secondaryTicks)
  const secondaryLabel = (value: number) => value.toFixed(secondaryDecimals).replace('.', ',')

  const padRight = secondaryAxis ? SECONDARY_PAD_RIGHT : PAD.right
  const plotWidth = WIDTH - PAD.left - padRight
  const plotHeight = HEIGHT - PAD.top - PAD.bottom

  const x = (index: number) =>
    PAD.left + (points.length === 1 ? plotWidth / 2 : (index / (points.length - 1)) * plotWidth)
  const y = (value: number) =>
    PAD.top + plotHeight - ((value - bottom) / (top - bottom)) * plotHeight

  // Gaps split the line into segments so a break in the data reads as a break,
  // not as a straight line drawn through days that were never recorded.
  const segments: Pt[][] = []
  let current: Pt[] = []
  points.forEach((point, index) => {
    if (point.value === null) {
      if (current.length > 1) segments.push(current)
      current = []
      return
    }
    current.push({ x: x(index), y: y(point.value) })
  })
  if (current.length > 1) segments.push(current)

  const overlayPoints = (overlay ?? [])
    .map((value, index) => (value === null ? null : { x: x(index), y: y(value) }))
    .filter((point): point is Pt => point !== null)

  const lastSegment = segments[segments.length - 1]
  const baseline = PAD.top + plotHeight
  // The fill follows the same curve as the line, never a straight chord: a gap
  // between the two would read as a second, lower series.
  const area = lastSegment
    ? `M ${f(lastSegment[0].x)},${f(baseline)} L ${f(lastSegment[0].x)},${f(lastSegment[0].y)}` +
      `${curveCommands(lastSegment)} L ${f(lastSegment[lastSegment.length - 1].x)},${f(baseline)} Z`
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
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>

      {unit ? (
        <text
          x={PAD.left - 4}
          y={10}
          textAnchor="end"
          fontSize="8"
          fill="hsl(var(--muted-foreground))"
        >
          {unit}
        </text>
      ) : null}
      {secondaryAxis ? (
        <text x={WIDTH - padRight + 6} y={10} fontSize="8" fill="hsl(var(--muted-foreground))">
          {secondaryAxis.label}
        </text>
      ) : null}

      {ticks.map((value, index) => (
        <g key={index}>
          <line
            x1={PAD.left}
            x2={WIDTH - padRight}
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
            {label(value)}
          </text>
          {secondaryAxis ? (
            <text
              x={WIDTH - padRight + 6}
              y={y(value) + 3}
              fontSize="8"
              fill="hsl(var(--muted-foreground))"
            >
              {secondaryLabel(secondaryTicks[index])}
            </text>
          ) : null}
        </g>
      ))}

      {area ? <path d={area} fill={`url(#${gradientId})`} /> : null}

      {reference ? (
        <g>
          <line
            x1={PAD.left}
            x2={WIDTH - padRight}
            y1={y(reference.value)}
            y2={y(reference.value)}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            vectorEffect="non-scaling-stroke"
          />
          <text
            x={PAD.left + 2}
            y={y(reference.value) - 4}
            fontSize="8"
            fill="hsl(var(--muted-foreground))"
          >
            {reference.label}
          </text>
        </g>
      ) : null}

      {segments.map((segment, index) => (
        <path
          key={index}
          d={curvePath(segment)}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {overlayPoints.length > 1 ? (
        <path
          d={curvePath(overlayPoints)}
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
        x={WIDTH - padRight}
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
