import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FoodSearchSheet } from '@/features/meals/FoodSearchSheet'
import { t } from '@/i18n/fr'
import type { Food } from '@/lib/foods/food'

const NECTARINE: Food = {
  id: '13039',
  source: 'ciqual',
  name: 'Nectarine, pulpe, crue',
  servingGrams: 100,
  per100g: { kcal: 44, proteinG: 1, carbsG: 9, fatG: 0 },
  missingMacros: [],
}

const searchFoods = vi.hoisted(() => vi.fn())
vi.mock('@/lib/foods/search', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/foods/search')>()),
  searchFoods,
}))

function setup() {
  const onPick = vi.fn()
  render(<FoodSearchSheet open onClose={vi.fn()} onPick={onPick} />)
  return { onPick, user: userEvent.setup() }
}

describe('FoodSearchSheet', () => {
  it('attend deux lettres avant de chercher quoi que ce soit', async () => {
    searchFoods.mockResolvedValue({ foods: [], networkFailed: false })
    const { user } = setup()

    await user.type(screen.getByLabelText(t.nutrition.searchPlaceholder), 'n')

    expect(screen.getByText(t.foods.tooShort)).toBeTruthy()
    expect(searchFoods).not.toHaveBeenCalled()
  })

  it('propose l’aliment avec ses macros pour 100 g', async () => {
    searchFoods.mockResolvedValue({ foods: [NECTARINE], networkFailed: false })
    const { user } = setup()

    await user.type(screen.getByLabelText(t.nutrition.searchPlaceholder), 'nectarine')

    expect(await screen.findByText(NECTARINE.name)).toBeTruthy()
    expect(screen.getByText(`Ciqual · ${t.foods.per100(44, 1)}`)).toBeTruthy()
  })

  it('rend l’aliment choisi, la portion restant à demander', async () => {
    searchFoods.mockResolvedValue({ foods: [NECTARINE], networkFailed: false })
    const { onPick, user } = setup()

    await user.type(screen.getByLabelText(t.nutrition.searchPlaceholder), 'nectarine')
    await user.click(await screen.findByLabelText(t.foods.add(NECTARINE.name)))

    expect(onPick).toHaveBeenCalledWith(NECTARINE)
  })

  it('dit que le réseau a manqué au lieu de laisser croire à une absence', async () => {
    searchFoods.mockResolvedValue({ foods: [], networkFailed: true })
    const { user } = setup()

    await user.type(screen.getByLabelText(t.nutrition.searchPlaceholder), 'nectarine')

    expect(await screen.findByText(t.foods.offline)).toBeTruthy()
  })

  it('dit quand rien ne correspond', async () => {
    searchFoods.mockResolvedValue({ foods: [], networkFailed: false })
    const { user } = setup()

    await user.type(screen.getByLabelText(t.nutrition.searchPlaceholder), 'zzzz')

    expect(await screen.findByText(t.foods.noMatch)).toBeTruthy()
  })
})
