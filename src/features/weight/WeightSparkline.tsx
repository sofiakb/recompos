interface WeightSparklineProps {
  /** Oldest first. */
  values: number[]
  className?: string
}

/**
 * Hand-drawn SVG rather than Recharts: the trends module brings the charting
 * library, and a 12-point line does not justify 100 kB before then.
 */
export function WeightSparkline({ values, className }: WeightSparklineProps) {
  if (values.length < 2) return null

  const width = 100
  const height = 28
  const min = Math.min(...values)
  const max = Math.max(...values)
  // A flat series would divide by zero; give it a nominal 1 kg span instead.
  const span = max - min || 1

  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width
    const y = height - ((value - min) / span) * (height - 4) - 2
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
