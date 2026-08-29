import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { MealSlotList } from '@/features/nutrition/MealSlotList'
import { buildSlotJournal } from '@/features/nutrition/journal'
import { mealTargetKcal } from '@/lib/nutrition'
import { t } from '@/i18n/fr'
import type { MealEntry, MealSlot, ProteinLog } from '@/types/models'

const TARGET_KCAL = 1850

function at(hour: number): string {
  return new Date(2026, 7, 27, hour, 0, 0).toISOString()
}

function meal(overrides: Partial<MealEntry> = {}): MealEntry {
  return {
    id: 'm1',
    date: '2026-08-27',
    timestamp: at(12),
    slot: 'lunch',
    label: 'Poulet, riz, brocolis',
    items: [],
    kcal: 412,
    proteinG: 34,
    carbsG: 40,
    fatG: 12,
    confidence: 'medium',
    source: 'ai',
    status: 'done',
    proteinLogId: 'p1',
    createdAt: at(12),
    updatedAt: at(12),
    ...overrides,
  }
}

function renderList(
  logs: ProteinLog[],
  meals: MealEntry[],
  handlers: Partial<Parameters<typeof MealSlotList>[0]> = {},
) {
  return render(
    <MemoryRouter>
      <MealSlotList
        groups={buildSlotJournal(logs, meals)}
        targetKcal={TARGET_KCAL}
        analysing={[]}
        onAdd={vi.fn()}
        onOpenMeal={vi.fn()}
        onOpenProtein={vi.fn()}
        {...handlers}
      />
    </MemoryRouter>,
  )
}

function rowFor(slot: MealSlot): HTMLElement {
  return screen.getByText(t.meals.slot[slot]).closest('li') as HTMLElement
}

describe('MealSlotList', () => {
  it('gives every meal its share of the day, empty ones included', () => {
    renderList([], [])

    expect(mealTargetKcal(TARGET_KCAL, 'dinner')).toBe(560)
    expect(within(rowFor('dinner')).getByText(t.nutrition.slotTotals(0, 560))).toBeTruthy()
  })

  it('names the protein only when there is some', () => {
    const log: ProteinLog = {
      id: 'p1',
      date: '2026-08-27',
      timestamp: at(12),
      grams: 34,
      sourceType: 'meal',
    }
    renderList([log], [meal()])

    const lunch = within(rowFor('lunch'))
    expect(
      lunch.getByText(`${t.nutrition.slotTotals(412, 740)} · ${t.nutrition.slotProtein(34)}`),
    ).toBeTruthy()
    // Breakfast carried none: it says nothing rather than « 0 g de protéines ».
    expect(within(rowFor('breakfast')).getByText(t.nutrition.slotTotals(0, 460))).toBeTruthy()
  })

  it('adds to the meal whose button was tapped, without asking again', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    renderList([], [], { onAdd })

    await user.click(screen.getByRole('button', { name: t.nutrition.addToSlot.dinner }))

    expect(onAdd).toHaveBeenCalledWith('dinner')
  })

  it('opens a meal for correction from its own line', async () => {
    const user = userEvent.setup()
    const onOpenMeal = vi.fn()
    renderList([], [meal()], { onOpenMeal })

    await user.click(screen.getByRole('button', { name: /Poulet, riz, brocolis/ }))

    expect(onOpenMeal).toHaveBeenCalledWith(expect.objectContaining({ id: 'm1' }))
  })

  it('shows an analysis in flight, and refuses to open it', () => {
    renderList([], [meal({ status: 'analysing', proteinLogId: undefined })])

    const row = screen.getByRole('button', { name: t.meals.analysing })
    expect(row.hasAttribute('disabled')).toBe(true)
  })

  it('keeps a way out to the catalogues', () => {
    renderList([], [])

    expect(screen.getByRole('link', { name: t.nutrition.whatToEat }).getAttribute('href')).toBe(
      '/nutrition/catalogues',
    )
  })
})

describe('MealSlotList — d’où viennent les chiffres', () => {
  it('nomme la table plutôt que d’inventer un code-barres', () => {
    renderList([], [meal({ source: 'food', analysedBy: 'ciqual', label: 'Riz blanc, cuit' })])

    expect(screen.getByText(`Riz blanc, cuit · ${t.foods.source.ciqual}`)).toBeTruthy()
  })

  it('retombe sur un mot générique quand la table n’a pas été notée', () => {
    renderList([], [meal({ source: 'food', label: 'Riz blanc, cuit' })])

    expect(screen.getByText(`Riz blanc, cuit · ${t.foods.badge}`)).toBeTruthy()
  })

  it('garde « code-barres » pour ce qui a vraiment été scanné', () => {
    renderList([], [meal({ source: 'barcode', label: 'Nutella' })])

    expect(screen.getByText(`Nutella · ${t.barcode.badge}`)).toBeTruthy()
  })
})
