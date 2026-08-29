import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { db } from '@/db/dexie'
import { NutritionScreen } from '@/screens/NutritionScreen'
import { useSettingsStore } from '@/stores/settingsStore'
import { t } from '@/i18n/fr'

/**
 * The two write routes, held open so the sheet can be watched mid-flight.
 *
 * A local write finishes inside the same tick as the click that started it, so
 * a test that merely waits for the sheet to close cannot tell « closed after »
 * from « closed before » — it passes either way. Holding the promise is what
 * makes the two distinguishable. Everything else the screen leans on runs for
 * real against the in-memory database.
 */
const hold = vi.hoisted(() => ({
  describe: { release: () => {}, calls: [] as string[] },
  manual: { release: () => {}, calls: [] as string[] },
}))

const describeMeal = vi.hoisted(() =>
  vi.fn(
    (description: string) =>
      new Promise<void>((resolve) => {
        hold.describe.calls.push(description)
        hold.describe.release = resolve
      }),
  ),
)

const addManual = vi.hoisted(() =>
  vi.fn(
    (label: string) =>
      new Promise<void>((resolve) => {
        hold.manual.calls.push(label)
        hold.manual.release = resolve
      }),
  ),
)

vi.mock('@/features/nutrition/useMeals', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/features/nutrition/useMeals')>()
  return {
    ...original,
    useMeals: (date?: string) => ({
      ...original.useMeals(date),
      canAnalyse: true,
      describeMeal,
      addManual,
    }),
  }
})

const DESCRIPTION = 'deux œufs et du pain'

function renderScreen() {
  render(
    <MemoryRouter initialEntries={['/nutrition']}>
      <NutritionScreen />
    </MemoryRouter>,
  )
  return userEvent.setup()
}

/** The tab strip exists only inside the add sheet. */
const sheetIsOpen = () => screen.queryByRole('tablist') !== null

async function startDescribing(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: t.nutrition.addToSlot.breakfast }))
  await user.click(screen.getByRole('tab', { name: new RegExp(t.nutrition.tabDescribe) }))
  await user.type(screen.getByRole('textbox'), DESCRIPTION)
  await user.click(screen.getByRole('button', { name: t.nutrition.estimate }))
}

describe('NutritionScreen — la feuille se ferme après le travail, pas avant', () => {
  beforeEach(async () => {
    describeMeal.mockClear()
    addManual.mockClear()
    hold.describe.calls.length = 0
    hold.manual.calls.length = 0
    await db.meals.clear()
    await db.proteinLogs.clear()
    useSettingsStore.setState(useSettingsStore.getInitialState())
  })

  it('garde la feuille ouverte pendant l’analyse, avec son bouton en attente', async () => {
    const user = renderScreen()

    await startDescribing(user)

    expect(hold.describe.calls).toEqual([DESCRIPTION])
    expect(sheetIsOpen()).toBe(true)
    expect(screen.getByRole('button', { name: t.meals.analysing })).toBeTruthy()
  })

  it('la ferme une fois l’analyse rendue', async () => {
    const user = renderScreen()
    await startDescribing(user)

    hold.describe.release()

    await waitFor(() => expect(sheetIsOpen()).toBe(false))
  })

  it('conserve ce qui a été écrit quand l’appel échoue', async () => {
    const user = renderScreen()
    describeMeal.mockRejectedValueOnce(new Error('réseau'))

    await startDescribing(user)

    // La description est la seule copie qui existe : la perdre coûterait la saisie.
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue(DESCRIPTION))
    expect(sheetIsOpen()).toBe(true)
  })

  it('ne ferme la feuille qu’une fois les calories écrites', async () => {
    const user = renderScreen()

    await user.click(screen.getByRole('button', { name: t.nutrition.addToSlot.breakfast }))
    await user.click(screen.getByRole('tab', { name: new RegExp(t.nutrition.tabQuick) }))
    await user.type(screen.getByRole('textbox', { name: t.nutrition.kcalPlaceholder }), '250')
    await user.click(screen.getByRole('button', { name: t.nutrition.addKcal }))

    expect(hold.manual.calls).toEqual([t.nutrition.kcalOnly])
    expect(sheetIsOpen()).toBe(true)

    hold.manual.release()

    await waitFor(() => expect(sheetIsOpen()).toBe(false))
  })
})
