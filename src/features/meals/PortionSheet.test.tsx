import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PortionSheet } from '@/features/meals/PortionSheet'
import type { Food } from '@/lib/foods/food'

const PRODUCT: Food = {
  id: '3017620422003',
  source: 'off',
  name: 'Nutella',
  brand: 'Ferrero',
  servingGrams: 15,
  per100g: { kcal: 539, proteinG: 6.3, carbsG: 57.5, fatG: 30.9 },
  missingMacros: [],
}

const GRAMS = 'Quantité (g)'

function setup(food: Food = PRODUCT) {
  const onAdd = vi.fn()
  render(<PortionSheet open food={food} onClose={vi.fn()} onAdd={onAdd} />)
  return { onAdd, user: userEvent.setup() }
}

describe('PortionSheet', () => {
  it('pré-remplit la quantité avec la portion du produit', () => {
    setup()
    expect(screen.getByLabelText(GRAMS)).toHaveValue('15')
  })

  it('affiche les macros de cette quantité', () => {
    setup()
    expect(screen.getByText('81 kcal')).toBeInTheDocument()
  })

  it('recalcule les macros quand la quantité change', async () => {
    const { user } = setup()
    const field = screen.getByLabelText(GRAMS)
    await user.clear(field)
    await user.type(field, '30')
    expect(screen.getByText('162 kcal')).toBeInTheDocument()
  })

  it('rend un MealItem à la quantité choisie', async () => {
    const { onAdd, user } = setup()
    const field = screen.getByLabelText(GRAMS)
    await user.clear(field)
    await user.type(field, '30')
    await user.click(screen.getByRole('button', { name: 'Ajouter' }))
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Nutella (Ferrero)', quantity: '30 g', kcal: 162 }),
    )
  })

  it("refuse d'ajouter une quantité nulle", async () => {
    const { user } = setup()
    const field = screen.getByLabelText(GRAMS)
    await user.clear(field)
    expect(screen.getByRole('button', { name: 'Ajouter' })).toBeDisabled()
  })

  it('signale une macro que la fiche ne donnait pas', () => {
    setup({ ...PRODUCT, missingMacros: ['carbsG'] })
    expect(screen.getByText(/glucides/i)).toBeInTheDocument()
  })
})
