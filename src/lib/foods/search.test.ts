import { describe, expect, it, vi } from 'vitest'
import { searchFoods } from '@/lib/foods/search'

const YAOURT = {
  code: '3033490004743',
  product_name_fr: 'Yaourt nature',
  brands: 'Danone',
  nutriments: {
    'energy-kcal_100g': 60,
    proteins_100g: 4,
    carbohydrates_100g: 5,
    fat_100g: 3,
  },
}

const DOUBLON = { ...YAOURT, code: '999', serving_quantity: 125 }

function stub(products: unknown[]) {
  return vi
    .fn()
    .mockResolvedValue(
      new Response(JSON.stringify({ products }), { status: 200 }),
    ) as unknown as typeof fetch
}

describe('searchFoods', () => {
  it('rend les produits du réseau — la table locale n’est pas encore déposée', async () => {
    const result = await searchFoods('yaourt', { fetchImpl: stub([YAOURT]) })

    expect(result.foods.map((food) => food.name)).toEqual(['Yaourt nature'])
    expect(result.networkFailed).toBe(false)
  })

  it('fond deux fiches du même produit en une seule ligne', async () => {
    const result = await searchFoods('yaourt', { fetchImpl: stub([YAOURT, DOUBLON]) })

    expect(result.foods).toHaveLength(1)
  })

  it('ne demande rien sous deux lettres', async () => {
    const fetchImpl = vi.fn()
    const result = await searchFoods('y', { fetchImpl: fetchImpl as unknown as typeof fetch })

    expect(result).toEqual({ foods: [], networkFailed: false })
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('dit que le réseau a manqué plutôt que de rendre une liste vide muette', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'))
    const result = await searchFoods('yaourt', {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })

    expect(result.foods).toEqual([])
    expect(result.networkFailed).toBe(true)
  })

  it('plafonne la liste', async () => {
    const many = Array.from({ length: 30 }, (_, index) => ({
      ...YAOURT,
      code: String(index),
      product_name_fr: `Yaourt ${index}`,
    }))
    const result = await searchFoods('yaourt', { fetchImpl: stub(many), limit: 5 })

    expect(result.foods).toHaveLength(5)
  })
})
