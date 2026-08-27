import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { appRoutes } from '@/app/routes'
import { SettingsScreen } from '@/screens/SettingsScreen'
import { useSettingsStore } from '@/stores/settingsStore'
import { t } from '@/i18n/fr'

/** Every path the router can actually render, as an in-app link would spell it. */
function declaredPaths(): Set<string> {
  const paths = new Set<string>()
  for (const parent of appRoutes) {
    for (const child of parent.children ?? []) {
      if ('index' in child && child.index) paths.add('/')
      else if (child.path) paths.add(`/${child.path}`)
    }
  }
  return paths
}

function renderSettings() {
  return render(
    <MemoryRouter initialEntries={['/settings']}>
      <SettingsScreen />
    </MemoryRouter>,
  )
}

describe('SettingsScreen', () => {
  beforeEach(() => {
    useSettingsStore.persist.clearStorage()
    useSettingsStore.setState(useSettingsStore.getInitialState())
  })

  it('offers six rubrics instead of a flat wall of cards', () => {
    renderSettings()
    const list = screen.getByRole('list')
    expect(within(list).getAllByRole('link')).toHaveLength(6)
  })

  it('sends every rubric to a path the router declares', () => {
    renderSettings()
    const declared = declaredPaths()
    const targets = within(screen.getByRole('list'))
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))

    expect(targets).not.toContain(null)
    for (const target of targets) {
      // A row pointing at an undeclared path renders a blank screen, silently.
      expect(declared).toContain(target)
    }
  })

  it('counts the live floor in the habits subtitle', () => {
    renderSettings()
    const { habits } = useSettingsStore.getState()
    const floor = habits.filter((habit) => habit.kind === 'floor' && !habit.archivedAt).length
    const stack = habits.filter((habit) => habit.kind === 'stack' && !habit.archivedAt).length

    expect(screen.getByText(t.settings.habitsCount(floor, stack))).toBeInTheDocument()
  })

  it('no longer carries the weight card, which lives in Progression', () => {
    renderSettings()
    // The card used to sit on both screens at once — the duplication the
    // refonte set out to remove.
    expect(screen.queryByText(t.weight.title)).not.toBeInTheDocument()
    expect(screen.queryByText(t.weight.logCta)).not.toBeInTheDocument()
  })
})
