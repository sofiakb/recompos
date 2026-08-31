import { describe, expect, it } from 'vitest'
import {
  amountOf,
  convertUnit,
  formatPortions,
  isPortions,
  isWeighed,
  quantityChips,
  rescale,
  stepQuantity,
  type Portion,
} from '@/lib/portion'

const PENNE: Portion = { quantity: '150 g', kcal: 195, proteinG: 8, carbsG: 38, fatG: 1 }

describe('amountOf', () => {
  it('lit le nombre de tête', () => {
    expect(amountOf('150 g')).toBe(150)
    expect(amountOf('1 nectarine')).toBe(1)
    expect(amountOf('0,5 bol')).toBe(0.5)
  })

  it('rend null quand il n’y a pas de nombre', () => {
    expect(amountOf('une poignée')).toBeNull()
    expect(amountOf('')).toBeNull()
  })
})

describe('rescale', () => {
  it('suit la nouvelle portion', () => {
    expect(rescale(PENNE, '200 g')).toEqual({ kcal: 260, proteinG: 11, carbsG: 51, fatG: 1 })
  })

  it('redescend aussi', () => {
    expect(rescale(PENNE, '75 g')).toEqual({ kcal: 98, proteinG: 4, carbsG: 19, fatG: 1 })
  })

  it('compte le pluriel comme la même unité', () => {
    const fruit: Portion = { quantity: '1 nectarine', kcal: 60, proteinG: 1, carbsG: 15, fatG: 0 }
    expect(rescale(fruit, '2 nectarines')).toEqual({
      kcal: 120,
      proteinG: 2,
      carbsG: 30,
      fatG: 0,
    })
  })

  it('ne bouge pas quand l’unité change : ce n’est plus la même chose', () => {
    expect(rescale(PENNE, '2 bols')).toBeNull()
  })

  it('attend que l’unité soit retapée plutôt que de deviner', () => {
    // « 150 g » passe par « 200 » avant « 200 g » : rien ne bouge entre-temps.
    expect(rescale(PENNE, '200')).toBeNull()
  })

  it('laisse les macros tranquilles tant qu’aucun nombre n’est lisible', () => {
    expect(rescale(PENNE, ' g')).toBeNull()
    expect(rescale({ ...PENNE, quantity: 'une poignée' }, 'deux poignées')).toBeNull()
  })

  it('accepte zéro : une portion retirée vaut zéro, pas l’ancienne valeur', () => {
    expect(rescale(PENNE, '0 g')).toEqual({ kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 })
  })

  it('ne divise pas par une base nulle', () => {
    expect(rescale({ ...PENNE, quantity: '0 g' }, '150 g')).toBeNull()
  })

  it('repart toujours de la base, donc taper puis effacer ne grignote rien', () => {
    const once = rescale(PENNE, '15 g')
    expect(once).not.toBeNull()
    expect(rescale(PENNE, '150 g')).toEqual({ kcal: 195, proteinG: 8, carbsG: 38, fatG: 1 })
  })
})

describe('stepQuantity', () => {
  it('avance de dix en dix sur ce qui se pèse', () => {
    expect(stepQuantity('150 g', 1)).toBe('160 g')
    expect(stepQuantity('150 g', -1)).toBe('140 g')
    expect(stepQuantity('20 cl', 1)).toBe('30 cl')
  })

  it('avance d’un demi sur ce qui se compte', () => {
    expect(stepQuantity('1 cuisse', 1)).toBe('1,5 cuisse')
    expect(stepQuantity('1,5 cuisse', 1)).toBe('2 cuisse')
  })

  it('ne descend jamais sous zéro', () => {
    expect(stepQuantity('5 g', -1)).toBe('0 g')
  })

  it('ne réécrit que le nombre, pas la phrase autour', () => {
    expect(stepQuantity('1 cuisse (~150 g)', 1)).toBe('1,5 cuisse (~150 g)')
  })

  it('rend la quantité telle quelle quand aucun nombre ne s’y lit', () => {
    expect(stepQuantity('une poignée', 1)).toBe('une poignée')
  })
})

describe('quantityChips', () => {
  it('propose des raccourcis pour ce qui se pèse', () => {
    expect(quantityChips('150 g')).toEqual(['50 g', '100 g', '150 g', '200 g'])
  })

  it('n’en propose aucun pour une unité qu’il faudrait accorder', () => {
    expect(quantityChips('1 cuisse')).toEqual([])
    expect(quantityChips('')).toEqual([])
  })
})

describe('convertUnit', () => {
  it('lit un poids en portions', () => {
    expect(convertUnit('168 g', 168, 'portions')).toBe('1 portion')
    expect(convertUnit('252 g', 168, 'portions')).toBe('1,5 portion')
    expect(convertUnit('336 g', 168, 'portions')).toBe('2 portions')
  })

  it('et des portions en poids', () => {
    expect(convertUnit('1,5 portion', 168, 'grams')).toBe('252 g')
    expect(convertUnit('2 portions', 168, 'grams')).toBe('336 g')
  })

  it('ne bouge pas quand la quantité est déjà dans l’unité demandée', () => {
    expect(convertUnit('168 g', 168, 'grams')).toBe('168 g')
    expect(convertUnit('1 portion', 168, 'portions')).toBe('1 portion')
  })

  it('refuse ce qu’il ne peut pas convertir honnêtement', () => {
    expect(convertUnit('une poignée', 168, 'portions')).toBeNull()
    expect(convertUnit('168 g', 0, 'portions')).toBeNull()
  })

  it('fait l’aller-retour sans dérive', () => {
    const portions = convertUnit('252 g', 168, 'portions')
    expect(portions).not.toBeNull()
    expect(convertUnit(portions ?? '', 168, 'grams')).toBe('252 g')
  })
})

describe('les portions comptées', () => {
  it('prend le pluriel à partir de deux, comme le français', () => {
    expect(formatPortions(0.5)).toBe('0,5 portion')
    expect(formatPortions(1)).toBe('1 portion')
    expect(formatPortions(2)).toBe('2 portions')
  })

  it('avance d’une demie et garde son accord', () => {
    expect(stepQuantity('1,5 portion', 1)).toBe('2 portions')
    expect(stepQuantity('2 portions', -1)).toBe('1,5 portion')
  })

  it('se reconnaît au singulier comme au pluriel', () => {
    expect(isPortions('1 portion')).toBe(true)
    expect(isPortions('2 portions')).toBe(true)
    expect(isPortions('150 g')).toBe(false)
    expect(isWeighed('150 g')).toBe(true)
    expect(isWeighed('1 cuisse')).toBe(false)
  })

  it('met les macros à l’échelle des portions comme du poids', () => {
    const pod: Portion = { quantity: '1 portion', kcal: 67, proteinG: 2, carbsG: 7, fatG: 3 }
    expect(rescale(pod, '2 portions')).toEqual({ kcal: 134, proteinG: 4, carbsG: 14, fatG: 6 })
  })
})
