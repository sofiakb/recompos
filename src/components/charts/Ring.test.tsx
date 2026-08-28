import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Ring } from '@/components/charts/Ring'

function percentOf(label: string): string | null {
  return screen.getByRole('progressbar', { name: label }).getAttribute('aria-valuenow')
}

describe('Ring', () => {
  it('reports how full it is', () => {
    render(<Ring size={150} stroke={11} ratio={0.5} ariaLabel="Calories" />)

    expect(percentOf('Calories')).toBe('50')
  })

  it('caps at 100 rather than filling a second lap', () => {
    render(<Ring size={150} stroke={11} ratio={1.6} ariaLabel="Calories" />)

    expect(percentOf('Calories')).toBe('100')
  })

  it('floors at 0 rather than drawing a negative arc', () => {
    render(<Ring size={74} stroke={7} ratio={-0.3} ariaLabel="Glucides" />)

    expect(percentOf('Glucides')).toBe('0')
  })

  it('shows whatever is put in the middle', () => {
    render(
      <Ring size={150} stroke={11} ratio={0.3} ariaLabel="Calories">
        <span>603</span>
      </Ring>,
    )

    expect(screen.getByText('603')).toBeTruthy()
  })

  it('paints the muted accent for a macro the app has no opinion about', () => {
    const { container } = render(
      <Ring size={74} stroke={7} ratio={0.4} ariaLabel="Lipides" accent="muted" />,
    )
    const arc = container.querySelectorAll('circle')[1]

    expect(arc.getAttribute('stroke')).toBe('hsl(var(--muted-foreground))')
  })
})
