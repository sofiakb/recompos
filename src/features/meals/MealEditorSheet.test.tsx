import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { db } from '@/db/dexie'
import { toggleFavorite } from '@/db/repositories/favoriteRepository'
import { MealEditorSheet } from '@/features/meals/MealEditorSheet'
import { t } from '@/i18n/fr'
import type { Food } from '@/lib/foods/food'
import type { MealEntry, MealItem } from '@/types/models'

const CREME: Food = {
  id: '19548',
  source: 'ciqual',
  name: 'Crème fraîche épaisse, 30 % MG',
  servingGrams: 100,
  per100g: { kcal: 293, proteinG: 2, carbsG: 3, fatG: 30 },
  missingMacros: [],
}

const searchFoods = vi.hoisted(() => vi.fn())
vi.mock('@/lib/foods/search', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/foods/search')>()),
  searchFoods,
}))

const AT = '2026-08-28T20:00:00.000Z'

const MEAL: MealEntry = {
  id: 'm1',
  date: '2026-08-28',
  timestamp: AT,
  slot: 'dinner',
  label: 'Penne à la crème',
  items: [{ name: 'penne', quantity: '150 g', kcal: 195, proteinG: 8, carbsG: 38, fatG: 1 }],
  kcal: 195,
  proteinG: 8,
  carbsG: 38,
  fatG: 1,
  confidence: 'medium',
  source: 'manual',
  status: 'done',
  createdAt: AT,
  updatedAt: AT,
}

const PORTION = 'Portion 1'
const KCAL = 'kcal 1'
const PROTEIN = 'Protéines (g) 1'
const CARBS = 'Glucides (g) 1'

const COFFEE = 'Café au lait dosette (Senseo)'
const COFFEE_ITEMS: MealItem[] = [
  { name: 'Café au lait', quantity: '1 tasse', kcal: 171, proteinG: 2, carbsG: 18, fatG: 8 },
]

beforeEach(async () => {
  await db.favorites.clear()
})

function setup(meal: MealEntry = MEAL) {
  const onSave = vi.fn()
  render(
    <MealEditorSheet
      open
      meal={meal}
      onClose={vi.fn()}
      onSave={onSave}
      onDelete={vi.fn()}
      onRetry={vi.fn()}
    />,
  )
  return { onSave, user: userEvent.setup() }
}

async function retype(user: ReturnType<typeof userEvent.setup>, label: string, text: string) {
  const field = screen.getByLabelText(label)
  await user.clear(field)
  await user.type(field, text)
}

describe('MealEditorSheet — la portion entraîne les macros', () => {
  it('recalcule les macros quand la portion grandit', async () => {
    const { user } = setup()
    await retype(user, PORTION, '200 g')

    expect(screen.getByLabelText(KCAL)).toHaveValue('260')
    expect(screen.getByLabelText(PROTEIN)).toHaveValue('11')
    expect(screen.getByLabelText(CARBS)).toHaveValue('51')
  })

  it('repart de la portion de départ, pas du dernier calcul', async () => {
    const { user } = setup()
    // Effacer puis retaper la même valeur passe par « 1 g » et « 15 g » : sans
    // base fixe, les arrondis successifs auraient rongé les 195 kcal.
    await retype(user, PORTION, '150 g')

    expect(screen.getByLabelText(KCAL)).toHaveValue('195')
    expect(screen.getByLabelText(CARBS)).toHaveValue('38')
  })

  it('respecte une macro corrigée à la main ensuite', async () => {
    const { user } = setup()
    await retype(user, PORTION, '300 g')
    expect(screen.getByLabelText(KCAL)).toHaveValue('390')

    // La personne sait que ces pâtes-là sont plus riches : 500 pour 300 g.
    await retype(user, KCAL, '500')
    await retype(user, PORTION, '600 g')

    expect(screen.getByLabelText(KCAL)).toHaveValue('1000')
  })

  it('met le total à jour avec la portion', async () => {
    const { user } = setup()
    await retype(user, PORTION, '300 g')

    expect(screen.getByText('390 kcal')).toBeInTheDocument()
  })

  it('laisse les macros tranquilles quand la portion n’est pas chiffrable', async () => {
    const { user } = setup()
    await retype(user, PORTION, 'une poignée')

    expect(screen.getByLabelText(KCAL)).toHaveValue('195')
  })
})

describe('MealEditorSheet — chercher un aliment', () => {
  it('ajoute une ligne avec les macros de la portion choisie', async () => {
    searchFoods.mockResolvedValue({ foods: [CREME], networkFailed: false })
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: t.foods.fromEditor }))
    await user.type(screen.getByLabelText(t.nutrition.searchPlaceholder), 'creme')
    await user.click(await screen.findByLabelText(t.foods.add(CREME.name)))

    // La table est pour 100 g ; la seule question qui reste est la portion.
    const grams = screen.getByLabelText(t.foods.portion.gramsLabel)
    await user.clear(grams)
    await user.type(grams, '30')
    await user.click(screen.getByRole('button', { name: t.foods.portion.add }))

    expect(screen.getByLabelText('Aliment 2')).toHaveValue(CREME.name)
    expect(screen.getByLabelText('kcal 2')).toHaveValue('88')
    expect(screen.getByLabelText('Lipides (g) 2')).toHaveValue('9')
  })
})

describe('MealEditorSheet — reprendre un favori', () => {
  it('propose la reprise même sans favori, et dit où est l’étoile', async () => {
    // Cacher le bouton tant qu'il n'y a rien rendait la fonction introuvable
    // pour qui n'avait pas déjà trouvé l'étoile.
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: t.favorites.fromEditor }))

    expect(screen.getByText(t.favorites.emptyFromEditor)).toBeTruthy()
  })

  it('ajoute les lignes du favori au repas ouvert', async () => {
    await toggleFavorite(COFFEE, COFFEE_ITEMS, db)
    const { user } = setup()

    await user.click(await screen.findByRole('button', { name: t.favorites.fromEditor }))
    await user.click(await screen.findByRole('button', { name: t.nutrition.addAgain(COFFEE) }))

    // Les pâtes restent : un favori apporte des lignes, il ne remplace pas le repas.
    expect(screen.getByLabelText('Aliment 1')).toHaveValue('penne')
    // La ligne porte le nom touché, pas celui de l'item d'origine.
    expect(screen.getByLabelText('Aliment 2')).toHaveValue(COFFEE)
    expect(screen.getByLabelText('kcal 2')).toHaveValue('171')
    expect(screen.getByText(t.meals.kcal(366))).toBeTruthy()
  })

  it('n’offre pas de désépingler depuis un repas ouvert', async () => {
    await toggleFavorite(COFFEE, COFFEE_ITEMS, db)
    const { user } = setup()

    await user.click(await screen.findByRole('button', { name: t.favorites.fromEditor }))

    expect(screen.queryByLabelText(t.favorites.remove(COFFEE))).toBeNull()
  })
})

describe('MealEditorSheet — épingler une ligne', () => {
  it('épingle l’aliment de la ligne, sa quantité et ses macros', async () => {
    const { user } = setup()

    await user.click(screen.getByLabelText(t.favorites.add('penne')))

    await expect
      .poll(async () => (await db.favorites.toArray()).map((row) => row.items))
      .toEqual([MEAL.items])
  })

  it('montre l’étoile pleine et la retouche pour désépingler', async () => {
    const { user } = setup()

    await user.click(screen.getByLabelText(t.favorites.add('penne')))
    const star = await screen.findByLabelText(t.favorites.remove('penne'))
    expect(star.getAttribute('aria-pressed')).toBe('true')

    await user.click(star)

    await expect.poll(async () => db.favorites.count()).toBe(0)
  })

  it('n’épingle pas une ligne encore sans nom', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: t.meals.addItem }))
    const blank = screen.getByLabelText(t.favorites.add('2'))

    expect(blank.hasAttribute('disabled')).toBe(true)
    await user.click(blank)
    expect(await db.favorites.count()).toBe(0)
  })

  it('rend la ligne épinglée à un autre repas', async () => {
    const { user } = setup()
    await user.click(screen.getByLabelText(t.favorites.add('penne')))
    await screen.findByLabelText(t.favorites.remove('penne'))

    await user.click(screen.getByRole('button', { name: t.favorites.fromEditor }))
    await user.click(await screen.findByRole('button', { name: t.nutrition.addAgain('penne') }))

    // La quantité revient telle quelle : une dosette est toujours la même dosette.
    expect(screen.getByLabelText('Portion 2')).toHaveValue('150 g')
    expect(screen.getByLabelText('kcal 2')).toHaveValue('195')
  })
})
