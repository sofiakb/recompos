import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProteinRing } from '@/features/nutrition/ProteinRing'

describe('ProteinRing', () => {
  it('reports progress to assistive tech', () => {
    render(<ProteinRing totalGrams={70} targetGrams={140} remainingGrams={70} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
  })

  it('caps the arc at 100% when the target is passed', () => {
    // Going over target is not a failure state: the ring simply stops filling.
    render(<ProteinRing totalGrams={200} targetGrams={140} remainingGrams={0} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    expect(screen.getByText('200')).toBeInTheDocument()
  })

  it('shows what is left rather than a deficit', () => {
    render(<ProteinRing totalGrams={40} targetGrams={140} remainingGrams={100} />)
    expect(screen.getByText('encore 100 g')).toBeInTheDocument()
  })

  it('switches to a reached state instead of a zero', () => {
    render(<ProteinRing totalGrams={140} targetGrams={140} remainingGrams={0} />)
    expect(screen.getByText('Cible atteinte')).toBeInTheDocument()
  })

  it('does not divide by zero on an empty target', () => {
    render(<ProteinRing totalGrams={0} targetGrams={0} remainingGrams={0} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })
})
