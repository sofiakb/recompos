import { describe, expect, it } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
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

/** jsdom never scrolls on its own: move the page, then say so. */
async function scrollTo(y: number): Promise<void> {
  await act(async () => {
    window.scrollY = y
    window.dispatchEvent(new Event('scroll'))
  })
}

describe('BottomNav, collapsed while reading down', () => {
  function nav(): HTMLElement {
    return screen.getByRole('navigation', { name: 'Navigation principale' })
  }

  it('collapses on the way down and opens again on the way up', async () => {
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>,
    )
    expect(nav()).toHaveAttribute('data-collapsed', 'false')

    await scrollTo(400)
    await waitFor(() => expect(nav()).toHaveAttribute('data-collapsed', 'true'))

    await scrollTo(200)
    await waitFor(() => expect(nav()).toHaveAttribute('data-collapsed', 'false'))
  })

  it('stands open at the top of the page, whatever the last direction was', async () => {
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>,
    )
    await scrollTo(400)
    await waitFor(() => expect(nav()).toHaveAttribute('data-collapsed', 'true'))

    // Straight back to the top — a jump, not a scroll up past the threshold.
    await scrollTo(0)
    await waitFor(() => expect(nav()).toHaveAttribute('data-collapsed', 'false'))
  })

  it('keeps every tab reachable while collapsed', async () => {
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>,
    )
    await scrollTo(400)
    await waitFor(() => expect(nav()).toHaveAttribute('data-collapsed', 'true'))

    // Clipped out of sight, not out of the document: a collapsed bar that
    // unmounted its links would strand the keyboard and the screen reader.
    expect(labels()).toEqual([t.nav.today, t.nav.nutrition, t.nav.workouts, t.nav.trends])
  })
})
