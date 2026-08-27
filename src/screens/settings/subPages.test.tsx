import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppSettingsScreen } from '@/screens/settings/AppSettingsScreen'
import { DataSettingsScreen } from '@/screens/settings/DataSettingsScreen'
import { GoalsSettingsScreen } from '@/screens/settings/GoalsSettingsScreen'
import { HabitsSettingsScreen } from '@/screens/settings/HabitsSettingsScreen'
import { VisionSettingsScreen } from '@/screens/settings/VisionSettingsScreen'
import { WorkoutsSettingsScreen } from '@/screens/settings/WorkoutsSettingsScreen'
import { t } from '@/i18n/fr'

const PAGES = [
  { Screen: GoalsSettingsScreen, title: t.settings.sections.goals.title },
  { Screen: HabitsSettingsScreen, title: t.settings.sections.habits.title },
  { Screen: WorkoutsSettingsScreen, title: t.settings.sections.workouts.title },
  { Screen: VisionSettingsScreen, title: t.settings.sections.vision.title },
  { Screen: DataSettingsScreen, title: t.settings.sections.data.title },
  { Screen: AppSettingsScreen, title: t.settings.sections.app.title },
] as const

describe('settings sub-pages', () => {
  it.each(PAGES)('$title renders under its own heading', ({ Screen, title }) => {
    render(
      <MemoryRouter>
        <Screen />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title)
  })

  it.each(PAGES)('$title offers a way back to the rubric list', ({ Screen }) => {
    render(
      <MemoryRouter>
        <Screen />
      </MemoryRouter>,
    )
    // Without it a rubric is a dead end: the nav bar has no settings tab.
    expect(screen.getByRole('link', { name: t.onboarding.back })).toHaveAttribute(
      'href',
      '/settings',
    )
  })

  it('keeps photo retention beside what produces the photos', () => {
    render(
      <MemoryRouter>
        <VisionSettingsScreen />
      </MemoryRouter>,
    )
    // The retention control names its group rather than printing a caption,
    // so it is reachable by role and not by text.
    expect(screen.getByRole('radiogroup', { name: t.meals.retention })).toBeInTheDocument()
  })
})
