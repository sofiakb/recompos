import { describe, expect, it, vi } from 'vitest'
import { OffError } from '@/lib/off/product'
import { searchProducts } from '@/lib/off/search'

const NUTELLA = {
  code: '3017620422003',
  product_name_fr: 'Nutella',
  brands: 'Ferrero, Nutella',
  serving_quantity: 15,
  nutriments: {
    'energy-kcal_100g': 539,
    proteins_100g: 6.3,
    carbohydrates_100g: 57.5,
    fat_100g: 30.9,
  },
}

/** The database is full of these: a name, and nothing anyone can eat by. */
const EMPTY_RECORD = { code: '000', product_name: 'Pot vide', nutriments: {} }

function ok(payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status: 200 })
}

function stub(payload: unknown) {
  return vi.fn().mockResolvedValue(ok(payload)) as unknown as typeof fetch
}

describe('searchProducts', () => {
  it('rend les produits trouvés, avec leur table pour 100 g', async () => {
    const found = await searchProducts('nutella', { fetchImpl: stub({ products: [NUTELLA] }) })

    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({
      id: '3017620422003',
      source: 'off',
      name: 'Nutella',
      brand: 'Ferrero',
      per100g: { kcal: 539, proteinG: 6.3, carbsG: 57.5, fatG: 30.9 },
    })
  })

  it('écarte les fiches sans valeurs nutritionnelles au lieu de proposer des zéros', async () => {
    const found = await searchProducts('pot', {
      fetchImpl: stub({ products: [EMPTY_RECORD, NUTELLA] }),
    })

    expect(found.map((food) => food.name)).toEqual(['Nutella'])
  })

  it('interroge l’instance française en s’identifiant et en filtrant les champs', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok({ products: [] }))
    await searchProducts('yaourt', { fetchImpl: fetchImpl as unknown as typeof fetch })

    const url = new URL(String(fetchImpl.mock.calls[0][0]))
    expect(url.origin + url.pathname).toBe('https://fr.openfoodfacts.org/api/v2/search')
    expect(url.searchParams.get('search_terms')).toBe('yaourt')
    expect(url.searchParams.get('app_name')).toBe('RecompOS')
    expect(url.searchParams.get('fields')).toContain('nutriments')
  })

  it('ne part pas sur une seule lettre', async () => {
    const fetchImpl = vi.fn()
    expect(await searchProducts('y', { fetchImpl: fetchImpl as unknown as typeof fetch })).toEqual(
      [],
    )
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('dit « réseau » plutôt que de rendre une liste vide silencieuse', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'))
    await expect(
      searchProducts('yaourt', { fetchImpl: fetchImpl as unknown as typeof fetch }),
    ).rejects.toThrow(OffError)
  })

  it('signale une erreur serveur', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('', { status: 503 }))
    await expect(
      searchProducts('yaourt', { fetchImpl: fetchImpl as unknown as typeof fetch }),
    ).rejects.toMatchObject({ kind: 'server' })
  })

  it('supporte une réponse sans tableau de produits', async () => {
    expect(await searchProducts('yaourt', { fetchImpl: stub({}) })).toEqual([])
  })
})
