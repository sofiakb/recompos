import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BottomNav } from '@/components/shared/BottomNav'
import { t } from '@/i18n/fr'

function labels(): string[] {
  return screen
    .getAllByRole('link')
    .map((link) => link.textContent?.trim() ?? '')
    .filter(Boolean)
}

describe('BottomNav', () => {
  it('orders the tabs by how often a day touches them', () => {
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>,
    )
    // Read from the catalogue, not spelled out: this test is about the order,
    // and the rename is asserted on its own below.
    expect(labels()).toEqual([t.nav.today, t.nav.nutrition, t.nav.workouts, t.nav.trends])
  })

  it('keeps the trends route under its new name', () => {
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>,
    )
    // Renaming the tab must not move the path: existing bookmarks still work.
    expect(screen.getByRole('link', { name: 'Progression' })).toHaveAttribute('href', '/trends')
  })
})
