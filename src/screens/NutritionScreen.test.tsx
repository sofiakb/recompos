import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { db } from '@/db/dexie'
import { NutritionScreen } from '@/screens/NutritionScreen'
import { useSettingsStore } from '@/stores/settingsStore'
import { addDays, formatLongDate, toLogicalDate } from '@/lib/date'
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

/** Testing Library collapses U+00A0 and U+202F to a plain space before matching. */
const plain = (text: string) => text.replaceAll(/[\u00a0\u202f]/gu, ' ')

/** The logged-days pill, whatever numbers it happens to carry. */
const LOGGED_PILL = /^\d+ \/ \d+ j$/

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

  it('compte les jours saisis, et les garde en remontant la semaine', async () => {
    // Le chiffre parlait du plancher d'habitudes, sur un écran fait de kcal — et
    // il disparaissait dès qu'on quittait aujourd'hui.
    const state = useSettingsStore.getState()
    useSettingsStore.setState({
      settings: { ...state.settings, installedAt: '2026-01-01T09:00:00.000Z' },
    })
    const yesterday = addDays(toLogicalDate(), -1)
    await db.proteinLogs.add({
      id: 'log-hier',
      date: yesterday,
      timestamp: `${yesterday}T12:00:00.000Z`,
      grams: 30,
      sourceType: 'meal',
    })
    const user = renderScreen()

    // Une seule journée saisie sur les sept, et la fenêtre glisse avec le jour lu :
    // hier, elle est le dernier de ses sept jours.
    await waitFor(() =>
      expect(screen.getByText(plain(t.nutrition.loggedDaysLabel(1, 7)))).toBeTruthy(),
    )

    await user.click(screen.getByRole('button', { name: t.nutrition.previousDay }))

    // L'en-tête et la barre de navigation portent tous deux la date.
    await waitFor(() => expect(screen.getAllByText(formatLongDate(yesterday)).length).toBe(2))
    expect(screen.getByText(plain(t.nutrition.loggedDaysLabel(1, 7)))).toBeTruthy()
  })

  it('ne compte rien avant l’installation, plutôt qu’un 0 / 7 j accusateur', async () => {
    // installedAt vaut « maintenant » par défaut : la veille est antérieure à
    // l'app, et sept jours manqués n'y ont jamais existé.
    const user = renderScreen()
    await user.click(screen.getByRole('button', { name: t.nutrition.previousDay }))

    await waitFor(() =>
      expect(screen.getAllByText(formatLongDate(addDays(toLogicalDate(), -1))).length).toBe(2),
    )
    expect(screen.queryByText(LOGGED_PILL)).toBeNull()
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
