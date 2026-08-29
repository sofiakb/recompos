import { describe, expect, it } from 'vitest'
import { linesOf } from '@/features/meals/favoriteLines'
import type { MealItem } from '@/types/models'

const COFFEE = 'Café au lait dosette (Senseo)'
const KCAL_ONLY: MealItem = {
  name: 'Calories seules',
  quantity: '',
  kcal: 171,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
}
const SKYR: MealItem = {
  name: 'Skyr nature',
  quantity: '150 g',
  kcal: 95,
  proteinG: 17,
  carbsG: 6,
  fatG: 0,
}
const BERRIES: MealItem = {
  name: 'Myrtilles',
  quantity: '60 g',
  kcal: 34,
  proteinG: 0,
  carbsG: 8,
  fatG: 0,
}

describe('linesOf', () => {
  it('donne à la ligne unique le nom qui a été touché', () => {
    const lines = linesOf({ label: COFFEE, kcal: 171, proteinG: 0, items: [KCAL_ONLY] })

    expect(lines).toEqual([{ ...KCAL_ONLY, name: COFFEE }])
  })

  it('ne touche pas aux macros en renommant', () => {
    const [line] = linesOf({ label: COFFEE, kcal: 171, proteinG: 0, items: [KCAL_ONLY] })

    expect(line.kcal).toBe(171)
    expect(line.quantity).toBe(KCAL_ONLY.quantity)
  })

  it('laisse chaque ligne se nommer quand il y en a plusieurs', () => {
    // Le libellé résume la combinaison ; il n'appartient à aucune des lignes.
    const lines = linesOf({
      label: 'Skyr et myrtilles',
      kcal: 129,
      proteinG: 17,
      items: [SKYR, BERRIES],
    })

    expect(lines).toEqual([SKYR, BERRIES])
  })

  it('ne fabrique rien à partir d’un favori sans ligne', () => {
    expect(linesOf({ label: COFFEE, kcal: 0, proteinG: 0, items: [] })).toEqual([])
  })
})
