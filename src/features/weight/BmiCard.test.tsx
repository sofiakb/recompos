import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BmiCard } from '@/features/weight/BmiCard'
import { t } from '@/i18n/fr'

function renderCard(smoothedKg: number, heightCm: number | null) {
  return render(
    <MemoryRouter>
      <BmiCard smoothedKg={smoothedKg} heightCm={heightCm} />
    </MemoryRouter>,
  )
}

describe('BmiCard', () => {
  it('shows the index, its band and the height it was computed on', () => {
    renderCard(78.4, 178)

    expect(screen.getByText('24,7')).toBeTruthy()
    expect(screen.getByText(t.trends.bmiBand.normal)).toBeTruthy()
    expect(screen.getByText('sur 1,78 m')).toBeTruthy()
  })

  it('names the rail for a screen reader', () => {
    renderCard(78.4, 178)

    expect(
      screen.getByRole('img', {
        name: t.trends.bmiScaleLabel('24,7', t.trends.bmiBand.normal),
      }),
    ).toBeTruthy()
  })

  it('offers to fill the height in rather than inventing one', () => {
    renderCard(78.4, null)

    // No number at all: an index on a guessed height would look just as
    // authoritative as one on a real height.
    expect(screen.queryByText(/\d,\d/)).toBeNull()
    expect(screen.getByRole('link', { name: t.trends.bmiNoHeight }).getAttribute('href')).toBe(
      '/settings/objectifs',
    )
  })
})
