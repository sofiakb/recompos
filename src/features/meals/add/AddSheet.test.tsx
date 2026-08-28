import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddSheet } from '@/features/meals/add/AddSheet'
import { t } from '@/i18n/fr'
import type { RecentMeal } from '@/features/meals/useRecentMeals'

const RECENT: RecentMeal[] = [
  { label: 'Skyr et myrtilles', kcal: 248, proteinG: 46, items: [] },
  { label: 'Poulet, riz, brocolis', kcal: 612, proteinG: 52, items: [] },
]

function renderSheet(overrides: Partial<Parameters<typeof AddSheet>[0]> = {}) {
  const props = {
    slot: 'lunch' as const,
    consumedKcal: 412,
    targetKcal: 740,
    canAnalyse: true,
    describing: false,
    recent: RECENT,
    onClose: vi.fn(),
    onPickRecent: vi.fn(),
    onProtein: vi.fn(),
    onCustomProtein: vi.fn(),
    onKcalOnly: vi.fn(),
    onOpenCamera: vi.fn(),
    onDescribe: vi.fn(),
    onBarcode: vi.fn(),
    ...overrides,
  }
  render(<AddSheet {...props} />)
  return props
}

const tab = (name: RegExp) => screen.getByRole('tab', { name })

describe('AddSheet', () => {
  it('says which meal it is adding to, and where that meal stands', () => {
    renderSheet()

    expect(screen.getByText(t.meals.slot.lunch)).toBeTruthy()
    expect(screen.getByText(t.nutrition.slotTotals(412, 740))).toBeTruthy()
  })

  it('opens on the search tab, with the meals already eaten before', () => {
    renderSheet()

    expect(tab(new RegExp(t.nutrition.tabSearch)).getAttribute('aria-selected')).toBe('true')
    expect(screen.getByText('Skyr et myrtilles')).toBeTruthy()
    expect(screen.getByText(t.nutrition.habitLine(248, 46))).toBeTruthy()
  })

  it('filters the habits as you type', async () => {
    const user = userEvent.setup()
    renderSheet()

    await user.type(screen.getByRole('searchbox'), 'skyr')

    expect(screen.getByText('Skyr et myrtilles')).toBeTruthy()
    expect(screen.queryByText('Poulet, riz, brocolis')).toBeNull()
  })

  it('adds a habit again in one tap', async () => {
    const user = userEvent.setup()
    const props = renderSheet()

    await user.click(
      screen.getByRole('button', { name: t.nutrition.addAgain('Skyr et myrtilles') }),
    )

    expect(props.onPickRecent).toHaveBeenCalledWith(RECENT[0])
  })

  it('anchors the action only on the two tabs that have one', async () => {
    const user = userEvent.setup()
    renderSheet()

    expect(screen.queryByRole('button', { name: t.nutrition.openCamera })).toBeNull()
    await user.click(tab(new RegExp(t.nutrition.tabPhoto)))
    expect(screen.getByRole('button', { name: t.nutrition.openCamera })).toBeTruthy()
  })

  it('refuses to estimate an empty description', async () => {
    const user = userEvent.setup()
    const props = renderSheet()
    await user.click(tab(new RegExp(t.nutrition.tabDescribe)))

    expect(
      screen.getByRole('button', { name: t.nutrition.estimate }).hasAttribute('disabled'),
    ).toBe(true)

    await user.type(screen.getByRole('textbox'), 'deux œufs')
    await user.click(screen.getByRole('button', { name: t.nutrition.estimate }))

    expect(props.onDescribe).toHaveBeenCalledWith('deux œufs')
  })

  it('says why the two model-backed tabs are dead without a key', async () => {
    const user = userEvent.setup()
    renderSheet({ canAnalyse: false })
    await user.click(tab(new RegExp(t.nutrition.tabPhoto)))

    expect(screen.getByText(t.meals.noProvider)).toBeTruthy()
    expect(
      screen.getByRole('button', { name: t.nutrition.openCamera }).hasAttribute('disabled'),
    ).toBe(true)
  })

  it('logs a protein dose from the quick tab', async () => {
    const user = userEvent.setup()
    const props = renderSheet()
    await user.click(tab(new RegExp(t.nutrition.tabQuick)))

    await user.click(screen.getByRole('button', { name: '+30 g' }))

    expect(props.onProtein).toHaveBeenCalledWith(30)
  })

  it('takes calories on their own, and refuses a blank', async () => {
    const user = userEvent.setup()
    const props = renderSheet()
    await user.click(tab(new RegExp(t.nutrition.tabQuick)))

    const add = screen.getByRole('button', { name: t.nutrition.addKcal })
    expect(add.hasAttribute('disabled')).toBe(true)

    await user.type(screen.getByRole('textbox', { name: t.nutrition.kcalPlaceholder }), '250')
    await user.click(add)

    expect(props.onKcalOnly).toHaveBeenCalledWith(250)
  })

  it('stays shut when no meal has been chosen', () => {
    renderSheet({ slot: null })

    expect(screen.queryByRole('tablist')).toBeNull()
  })
})
