import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LineChart } from '@/components/charts/LineChart'

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
    // One polyline, not two: the second axis is a reading, not a second series.
    expect(container.querySelectorAll('polyline')).toHaveLength(1)
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
