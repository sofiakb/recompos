import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { db } from '@/db/dexie'
import { MealSheet } from '@/features/meals/MealSheet'
import { t } from '@/i18n/fr'
import type { MealEntry } from '@/types/models'

const AT = '2026-08-29T12:10:00.000Z'

const MEAL: MealEntry = {
  id: 'm1',
  date: '2026-08-29',
  timestamp: AT,
  slot: 'lunch',
  label: 'Poulet aux olives, frites',
  items: [
    {
      name: 'poulet aux olives',
      quantity: '1 cuisse',
      kcal: 220,
      proteinG: 31,
      carbsG: 2,
      fatG: 10,
    },
    { name: 'frites maison', quantity: '200 g', kcal: 625, proteinG: 7, carbsG: 82, fatG: 30 },
  ],
  kcal: 845,
  proteinG: 38,
  carbsG: 84,
  fatG: 40,
  confidence: 'medium',
  source: 'ai',
  status: 'done',
  createdAt: AT,
  updatedAt: AT,
}

beforeEach(async () => {
  await db.favorites.clear()
})

function setup(meal: MealEntry = MEAL) {
  const handlers = { onEdit: vi.fn(), onAdd: vi.fn(), onDelete: vi.fn(), onRetry: vi.fn() }
  render(<MealSheet meal={meal} targetKcal={740} onClose={vi.fn()} {...handlers} />)
  return { ...handlers, user: userEvent.setup() }
}

describe('MealSheet — le repas se lit', () => {
  it('n’affiche pas un seul champ de saisie', () => {
    setup()

    expect(screen.queryAllByRole('textbox')).toHaveLength(0)
    expect(screen.getByText('frites maison')).toBeInTheDocument()
    expect(screen.getByText('200 g')).toBeInTheDocument()
  })

  it('situe le total dans la part du repas', () => {
    setup()

    expect(screen.getByText('845')).toBeInTheDocument()
    expect(screen.getByText(t.meals.outOfTarget(740))).toBeInTheDocument()
    expect(screen.getByText(t.meals.overBudget(105))).toBeInTheDocument()
  })

  it('renvoie l’ajout à la feuille du journal plutôt qu’à un bouton à lui', async () => {
    const { onAdd, user } = setup()
    await user.click(screen.getByRole('button', { name: t.meals.addItem }))

    expect(onAdd).toHaveBeenCalled()
  })

  it('ne propose de corriger l’estimation que là où il y en a une', () => {
    const { unmount } = render(
      <MealSheet
        meal={{ ...MEAL, photoId: 'p1' }}
        targetKcal={740}
        onClose={vi.fn()}
        onEdit={vi.fn()}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        onRetry={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: t.meals.correctEstimate })).toBeInTheDocument()
    unmount()

    setup({ ...MEAL, source: 'food' })
    expect(screen.queryByRole('button', { name: t.meals.correctEstimate })).not.toBeInTheDocument()
  })
})

describe('MealSheet — une ligne s’ouvre sur sa quantité', () => {
  it('ouvre la feuille de quantité sur la ligne touchée', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: t.nutrition.editItem('frites maison') }))

    expect(screen.getByLabelText(t.meals.quantityLabel)).toHaveValue('200 g')
    expect(
      screen.getByText(t.meals.lineFrom(t.meals.slotOf.lunch, t.meals.lineOrigin.photo)),
    ).toBeInTheDocument()
  })

  it('rend les lignes du repas avec celle qui vient de changer', async () => {
    const { onEdit, user } = setup()
    await user.click(screen.getByRole('button', { name: t.nutrition.editItem('frites maison') }))
    await user.click(screen.getByLabelText(t.meals.quantityDown))
    await user.click(screen.getByRole('button', { name: t.common.save }))

    expect(onEdit).toHaveBeenCalledWith({
      items: [
        MEAL.items[0],
        expect.objectContaining({ name: 'frites maison', quantity: '190 g', kcal: 594 }),
      ],
    })
  })

  it('recompose le nom du repas quand une ligne s’en va', async () => {
    const { onEdit, user } = setup()
    await user.click(screen.getByRole('button', { name: t.nutrition.editItem('frites maison') }))
    await user.click(screen.getByLabelText(t.meals.removeItem('frites maison')))

    expect(onEdit).toHaveBeenCalledWith({ items: [MEAL.items[0]], label: 'poulet aux olives' })
  })

  it('supprime le repas plutôt que de le laisser vide', async () => {
    const { onDelete, onEdit, user } = setup({ ...MEAL, items: [MEAL.items[1]] })
    await user.click(screen.getByRole('button', { name: t.nutrition.editItem('frites maison') }))
    await user.click(screen.getByLabelText(t.meals.removeItem('frites maison')))

    expect(onDelete).toHaveBeenCalled()
    expect(onEdit).not.toHaveBeenCalled()
  })
})
