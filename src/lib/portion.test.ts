import { describe, expect, it } from 'vitest'
import { amountOf, rescale, type Portion } from '@/lib/portion'

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
