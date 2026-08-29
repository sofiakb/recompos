import { describe, expect, it } from 'vitest'
import { normalise, toMealItem, type Food } from '@/lib/foods/food'

const NECTARINE: Food = {
  id: '13039',
  source: 'ciqual',
  name: 'Nectarine, pulpe, crue',
  servingGrams: 100,
  per100g: { kcal: 44, proteinG: 1.1, carbsG: 8.9, fatG: 0.3 },
  missingMacros: [],
}

describe('toMealItem', () => {
  it('met la portion dans la quantité et les macros à l’échelle', () => {
    expect(toMealItem(NECTARINE, 150)).toEqual({
      name: 'Nectarine, pulpe, crue',
      quantity: '150 g',
      kcal: 66,
      proteinG: 2,
      carbsG: 13,
      fatG: 0,
    })
  })

  it('accole la marque au nom quand il y en a une', () => {
    const item = toMealItem({ ...NECTARINE, source: 'off', brand: 'Danone' }, 100)

    expect(item.name).toBe('Nectarine, pulpe, crue (Danone)')
  })

  it('ne descend pas sous zéro', () => {
    expect(toMealItem(NECTARINE, -50)).toMatchObject({ quantity: '0 g', kcal: 0 })
  })
})

describe('normalise', () => {
  it('efface accents, casse et ponctuation', () => {
    expect(normalise('Crème fraîche, épaisse')).toBe('creme fraiche epaisse')
  })

  it('rend une chaîne vide pour du vide', () => {
    expect(normalise('  —  ')).toBe('')
  })
})
