import { describe, expect, it } from 'vitest'
import { OffError, parseProduct } from '@/lib/off/product'
import { toMealItem } from '@/lib/foods/food'

function raw(overrides: Record<string, unknown> = {}) {
  return {
    code: '3017620422003',
    product_name: 'Nutella',
    brands: 'Ferrero',
    nutriments: {
      'energy-kcal_100g': 539,
      proteins_100g: 6.3,
      carbohydrates_100g: 57.5,
      fat_100g: 30.9,
    },
    ...overrides,
  }
}

describe('parseProduct', () => {
  it('lit les macros pour 100 g', () => {
    const product = parseProduct(raw())
    expect(product.per100g).toEqual({ kcal: 539, proteinG: 6.3, carbsG: 57.5, fatG: 30.9 })
    expect(product.name).toBe('Nutella')
    expect(product.brand).toBe('Ferrero')
    expect(product.missingMacros).toEqual([])
  })

  it('convertit depuis les kilojoules quand les kcal manquent', () => {
    const product = parseProduct(
      raw({
        nutriments: {
          energy_100g: 2252,
          proteins_100g: 6.3,
          carbohydrates_100g: 57.5,
          fat_100g: 30.9,
        },
      }),
    )
    expect(product.per100g.kcal).toBe(538)
  })

  it('refuse un produit sans aucune énergie', () => {
    expect(() =>
      parseProduct(
        raw({ nutriments: { proteins_100g: 6.3, carbohydrates_100g: 57.5, fat_100g: 30.9 } }),
      ),
    ).toThrowError(expect.objectContaining({ kind: 'no_nutriments' }))
  })

  it('refuse un produit dont les trois macros manquent', () => {
    expect(() => parseProduct(raw({ nutriments: { 'energy-kcal_100g': 539 } }))).toThrowError(
      expect.objectContaining({ kind: 'no_nutriments' }),
    )
  })

  it('compte une macro absente à zéro et le signale', () => {
    const product = parseProduct(
      raw({ nutriments: { 'energy-kcal_100g': 539, proteins_100g: 6.3, fat_100g: 30.9 } }),
    )
    expect(product.per100g.carbsG).toBe(0)
    expect(product.missingMacros).toEqual(['carbsG'])
  })

  it('préfère le nom français', () => {
    expect(parseProduct(raw({ product_name_fr: 'Pâte à tartiner' })).name).toBe('Pâte à tartiner')
  })

  it('retombe sur le code quand aucun nom n’est donné', () => {
    const product = parseProduct(raw({ product_name: '', product_name_fr: '' }))
    expect(product.name).toBe('3017620422003')
  })

  it('lit une portion numérique', () => {
    expect(parseProduct(raw({ serving_quantity: 15 })).servingGrams).toBe(15)
  })

  it('extrait une portion écrite « 30 g »', () => {
    expect(parseProduct(raw({ serving_size: '30 g' })).servingGrams).toBe(30)
  })

  it('retombe sur 100 g quand la portion est vide ou illisible', () => {
    expect(parseProduct(raw({ serving_size: '' })).servingGrams).toBe(100)
    expect(parseProduct(raw({ serving_size: 'une poignée' })).servingGrams).toBe(100)
  })

  it('refuse une charge utile qui n’est pas un produit', () => {
    expect(() => parseProduct(null)).toThrowError(OffError)
    expect(() => parseProduct({ code: '123' })).toThrowError(
      expect.objectContaining({ kind: 'no_nutriments' }),
    )
  })
})

describe('toMealItem', () => {
  const product = parseProduct(raw({ serving_quantity: 15 }))

  it('met les macros à l’échelle de la quantité', () => {
    expect(toMealItem(product, 30)).toEqual({
      name: 'Nutella (Ferrero)',
      quantity: '30 g',
      kcal: 162,
      proteinG: 2,
      carbsG: 17,
      fatG: 9,
    })
  })

  it('rend les valeurs pour 100 g telles quelles', () => {
    const item = toMealItem(product, 100)
    expect(item.kcal).toBe(539)
    expect(item.carbsG).toBe(58)
  })

  it('arrondit sans jamais descendre sous zéro', () => {
    const item = toMealItem(product, 0)
    expect(item.kcal).toBe(0)
    expect(item.proteinG).toBe(0)
  })

  it('omet la marque quand il n’y en a pas', () => {
    const noBrand = parseProduct(raw({ brands: '' }))
    expect(toMealItem(noBrand, 100).name).toBe('Nutella')
  })
})
