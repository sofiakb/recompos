import { describe, expect, it, vi } from 'vitest'
import { OffError } from '@/lib/off/product'
import { searchProducts } from '@/lib/off/search'

const NUTRIMENTS = {
  'energy-kcal_100g': 46,
  proteins_100g: 3.2,
  carbohydrates_100g: 5.1,
  fat_100g: 1.6,
}

const QUERY = 'café au lait senseo'

const SENSEO = {
  code: '8711000530092',
  product_name_fr: 'Café au lait',
  brands: 'Senseo',
  nutriments: NUTRIMENTS,
}

/** What `/api/v2/search` actually returned for « café au lait senseo ». */
const UNRELATED = [
  { code: '1', product_name_fr: 'Prince', brands: 'LU', nutriments: NUTRIMENTS },
  { code: '2', product_name_fr: 'Skyr nature 0 %', brands: 'Yoplait', nutriments: NUTRIMENTS },
  { code: '3', product_name_fr: 'Noir Intense', brands: 'Lindt', nutriments: NUTRIMENTS },
]

function ok(payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status: 200 })
}

function stub(payload: unknown) {
  return vi.fn().mockResolvedValue(ok(payload)) as unknown as typeof fetch
}

describe('searchProducts', () => {
  it('rend les produits trouvés, avec leur table pour 100 g', async () => {
    const found = await searchProducts(QUERY, {
      fetchImpl: stub({ hits: [SENSEO] }),
    })

    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({
      id: '8711000530092',
      source: 'off',
      name: 'Café au lait',
      brand: 'Senseo',
      per100g: { kcal: 46, proteinG: 3.2, carbsG: 5.1, fatG: 1.6 },
    })
  })

  it('écarte ce qui ne répond pas à la question', async () => {
    // Le symptôme qui a fait tomber `/api/v2/search` : la requête ignorée, et la
    // tête de la base rendue telle quelle. Une liste vide vaut mieux que ça.
    const found = await searchProducts(QUERY, {
      fetchImpl: stub({ hits: UNRELATED }),
    })

    expect(found).toEqual([])
  })

  it('classe par nombre de mots retrouvés', async () => {
    const partial = { ...SENSEO, code: '4', product_name_fr: 'Café noir', brands: 'Carte Noire' }
    const found = await searchProducts(QUERY, {
      fetchImpl: stub({ hits: [partial, SENSEO] }),
    })

    expect(found.map((food) => food.brand)).toEqual(['Senseo', 'Carte Noire'])
  })

  it('ignore les mots trop courts pour vouloir dire quelque chose', async () => {
    // « au » est dans la moitié des noms de la base : il ne doit rien cautionner.
    const found = await searchProducts('au', { fetchImpl: stub({ hits: UNRELATED }) })

    expect(found).toEqual([])
  })

  it('ne laisse pas « Yoplait » se faire passer pour « lait »', async () => {
    const yaourt = { code: '5', product_name_fr: 'Skyr', brands: 'Yoplait', nutriments: NUTRIMENTS }
    const found = await searchProducts('lait', { fetchImpl: stub({ hits: [yaourt] }) })

    expect(found).toEqual([])
  })

  it('trouve quand même « à la grecque » sur « grec »', async () => {
    const grec = {
      code: '6',
      product_name_fr: 'Yaourt à la grecque',
      brands: 'Danone',
      nutriments: NUTRIMENTS,
    }
    const found = await searchProducts('yaourt grec', { fetchImpl: stub({ hits: [grec] }) })

    expect(found.map((food) => food.name)).toEqual(['Yaourt à la grecque'])
  })

  it('tolère le pluriel tapé dans la requête', async () => {
    const tomate = {
      code: '7',
      product_name_fr: 'Tomate pelée',
      brands: 'Mutti',
      nutriments: NUTRIMENTS,
    }
    const found = await searchProducts('tomates pelées', { fetchImpl: stub({ hits: [tomate] }) })

    expect(found).toHaveLength(1)
  })

  it('écarte les fiches sans valeurs nutritionnelles au lieu de proposer des zéros', async () => {
    const empty = { code: '0', product_name_fr: 'Café au lait Senseo', nutriments: {} }
    const found = await searchProducts(QUERY, {
      fetchImpl: stub({ hits: [empty, SENSEO] }),
    })

    expect(found.map((food) => food.brand)).toEqual(['Senseo'])
  })

  it('interroge le moteur plein texte, pas le filtre par tags', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok({ hits: [] }))
    await searchProducts('yaourt', { fetchImpl: fetchImpl as unknown as typeof fetch })

    const url = new URL(String(fetchImpl.mock.calls[0][0]))
    expect(url.origin + url.pathname).toBe('https://search.openfoodfacts.org/search')
    expect(url.searchParams.get('q')).toBe('yaourt')
    expect(url.searchParams.get('langs')).toBe('fr')
    expect(url.searchParams.get('fields')).toContain('nutriments')
  })

  it('retombe sur le CGI historique quand le moteur ne répond pas', async () => {
    const fetchImpl = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(ok({ products: [SENSEO] }))
    const found = await searchProducts(QUERY, {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })

    expect(found.map((food) => food.brand)).toEqual(['Senseo'])
    const url = new URL(String(fetchImpl.mock.calls[1][0]))
    expect(url.origin + url.pathname).toBe('https://fr.openfoodfacts.org/cgi/search.pl')
    expect(url.searchParams.get('search_terms')).toBe(QUERY)
    expect(url.searchParams.get('json')).toBe('1')
  })

  it('ne part pas sur une seule lettre', async () => {
    const fetchImpl = vi.fn()
    expect(await searchProducts('y', { fetchImpl: fetchImpl as unknown as typeof fetch })).toEqual(
      [],
    )
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('dit « réseau » quand aucune des deux routes ne répond', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'))
    await expect(
      searchProducts('yaourt', { fetchImpl: fetchImpl as unknown as typeof fetch }),
    ).rejects.toThrow(OffError)
  })

  it('signale une erreur serveur des deux côtés', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('', { status: 503 }))
    await expect(
      searchProducts('yaourt', { fetchImpl: fetchImpl as unknown as typeof fetch }),
    ).rejects.toMatchObject({ kind: 'server' })
  })

  it('supporte une réponse sans tableau de produits', async () => {
    expect(await searchProducts('yaourt', { fetchImpl: stub({}) })).toEqual([])
  })
})
