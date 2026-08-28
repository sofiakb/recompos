import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MealEditorSheet } from '@/features/meals/MealEditorSheet'
import type { MealEntry } from '@/types/models'

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
