import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LineChart } from '@/components/charts/LineChart'

/** The drawn series: the filled area under it is a path too, and is not one. */
function lines(container: HTMLElement): SVGPathElement[] {
  return [...container.querySelectorAll<SVGPathElement>('path[stroke]')]
}

/** Every y the curve is drawn through, control points included. */
function drawnYs(path: SVGPathElement): number[] {
  return [...(path.getAttribute('d') ?? '').matchAll(/-?[\d.]+,(-?[\d.]+)/g)].map((match) =>
    Number(match[1]),
  )
}

function axisLabels(container: HTMLElement): string[] {
  // The two date captions sit at the bottom; the axis labels are the ones
  // anchored to the end of the left gutter.
  return [...container.querySelectorAll('text[text-anchor="end"]')]
    .map((node) => node.textContent ?? '')
    .filter((text) => /\d/.test(text))
    .slice(0, 3)
}

describe('LineChart', () => {
  it('draws nothing below two points', () => {
    const { container } = render(
      <LineChart ariaLabel="Poids" points={[{ label: '1 jan', value: 78 }]} />,
    )
    expect(container.querySelector('svg')).toBeNull()
  })

  it('adds decimals so a narrow series does not repeat the same tick', () => {
    const { container } = render(
      <LineChart
        ariaLabel="Poids"
        points={[
          { label: '23 août', value: 78 },
          { label: '25 août', value: 78.1 },
          { label: '27 août', value: 78.3 },
        ]}
      />,
    )
    const labels = axisLabels(container)
    expect(labels).toHaveLength(3)
    expect(new Set(labels).size).toBe(3)
    expect(labels.every((label) => label.includes(','))).toBe(true)
  })

  it('keeps whole numbers when the series spans enough to tell them apart', () => {
    const { container } = render(
      <LineChart
        ariaLabel="Poids"
        points={[
          { label: '1 jan', value: 74 },
          { label: '1 fév', value: 78 },
          { label: '1 mar', value: 82 },
        ]}
      />,
    )
    expect(axisLabels(container)).toEqual(['82', '78', '74'])
  })

  it('labels the extremes of the data, not a padded ceiling', () => {
    const { container } = render(
      <LineChart
        ariaLabel="Tour de taille"
        points={[
          { label: '1 jan', value: 90 },
          { label: '1 fév', value: 100 },
        ]}
      />,
    )
    const labels = axisLabels(container)
    expect(labels[0]).toBe('100')
    expect(labels[labels.length - 1]).toBe('90')
  })

  it('honours an explicit formatter', () => {
    const { container } = render(
      <LineChart
        ariaLabel="Index"
        points={[
          { label: 'S1', value: 100 },
          { label: 'S2', value: 130 },
        ]}
        formatValue={(value) => `${value} %`}
      />,
    )
    expect(axisLabels(container)[0]).toBe('130 %')
  })

  it('reads the same curve in a second unit on the right', () => {
    const { container } = render(
      <LineChart
        ariaLabel="Poids lissé et IMC"
        unit="kg"
        secondaryAxis={{ label: 'IMC', convert: (kg) => Math.round((kg / 1.78 ** 2) * 10) / 10 }}
        points={[
          { label: '20 juil.', value: 79.6 },
          { label: '24 août', value: 78.1 },
        ]}
      />,
    )
    const right = [...container.querySelectorAll('text:not([text-anchor])')].map(
      (node) => node.textContent ?? '',
    )
    expect(right).toContain('IMC')
    expect(right).toContain('25,1')
    expect(right).toContain('24,6')
    // One line, not two: the second axis is a reading, not a second series.
    expect(lines(container)).toHaveLength(1)
  })

  it('leaves the right gutter alone without a secondary axis', () => {
    const { container } = render(
      <LineChart
        ariaLabel="Poids"
        points={[
          { label: '1 jan', value: 78 },
          { label: '2 jan', value: 79 },
        ]}
      />,
    )
    expect(container.querySelectorAll('text:not([text-anchor])')).toHaveLength(1)
  })

  it('names itself for screen readers', () => {
    render(
      <LineChart
        ariaLabel="Poids"
        points={[
          { label: '1 jan', value: 78 },
          { label: '2 jan', value: 79 },
        ]}
      />,
    )
    expect(screen.getByRole('img', { name: 'Poids' })).toBeTruthy()
  })
})

describe('LineChart curve', () => {
  const PEAK = [
    { label: '23 août', value: 77.4 },
    { label: '27 août', value: 78.3 },
    { label: '3 sept.', value: 77.0 },
  ]

  it('draws a curve, not a run of straight chords', () => {
    const { container } = render(<LineChart ariaLabel="Poids" points={PEAK} />)

    expect(lines(container)[0].getAttribute('d')).toContain('C')
  })

  /**
   * The reason the spline is monotone rather than Catmull-Rom. A rounded peak
   * that bulges past 78,3 kg draws a weight that was never recorded — on a
   * chart whose whole job is to say what the scale said.
   */
  it('never bulges past the weigh-ins it joins', () => {
    const { container } = render(<LineChart ariaLabel="Poids" points={PEAK} />)

    // `M a C c c a C c c a` — every third y from the start is a weigh-in, the
    // rest are the bezier handles that could carry the curve outside them.
    const ys = drawnYs(lines(container)[0])
    const weighIns = ys.filter((_, index) => index % 3 === 0)
    expect(weighIns).toHaveLength(3)

    // Screen coordinates: a smaller y is a heavier weight.
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(Math.min(...weighIns) - 0.001)
    expect(Math.max(...ys)).toBeLessThanOrEqual(Math.max(...weighIns) + 0.001)
  })

  it('breaks the line where the data breaks, and curves each run', () => {
    const { container } = render(
      <LineChart
        ariaLabel="Poids"
        points={[
          { label: '1 jan', value: 78 },
          { label: '2 jan', value: 79 },
          { label: '3 jan', value: null },
          { label: '4 jan', value: 77 },
          { label: '5 jan', value: 76 },
        ]}
      />,
    )

    expect(lines(container)).toHaveLength(2)
  })
})

describe('LineChart reference', () => {
  const POINTS = [
    { label: '23 août', value: 77.4 },
    { label: '3 sept.', value: 77.0 },
  ]

  it('draws the line dashed, and names it', () => {
    const { container } = render(
      <LineChart ariaLabel="Poids" points={POINTS} reference={{ value: 75.7, label: 'IMC 25' }} />,
    )

    const dashed = container.querySelector('line[stroke-dasharray]')
    expect(dashed).not.toBeNull()
    expect([...container.querySelectorAll('text')].map((node) => node.textContent)).toContain(
      'IMC 25',
    )
  })

  it('stretches the drawing to hold it, rather than cropping it away', () => {
    const { container } = render(
      <LineChart ariaLabel="Poids" points={POINTS} reference={{ value: 75.7, label: 'IMC 25' }} />,
    )

    const dashed = container.querySelector('line[stroke-dasharray]') as SVGLineElement
    const y = Number(dashed.getAttribute('y1'))
    const curveYs = drawnYs(lines(container)[0])
    // Below the whole series on screen, and still inside the plot.
    expect(y).toBeGreaterThan(Math.max(...curveYs))
    expect(y).toBeLessThan(140)
  })

  it('leaves the axis reading the weights actually recorded', () => {
    const { container } = render(
      <LineChart ariaLabel="Poids" points={POINTS} reference={{ value: 75.7, label: 'IMC 25' }} />,
    )

    // 75,7 never becomes a tick: it is a threshold, not a weigh-in.
    expect(axisLabels(container)).toEqual(['77,4', '77,2', '77,0'])
  })
})
