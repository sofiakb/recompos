import { describe, expect, it, vi } from 'vitest'
import { fetchProduct } from '@/lib/off/client'

const BODY = {
  code: '3017620422003',
  status: 1,
  product: {
    code: '3017620422003',
    product_name: 'Nutella',
    brands: 'Ferrero',
    nutriments: {
      'energy-kcal_100g': 539,
      proteins_100g: 6.3,
      carbohydrates_100g: 57.5,
      fat_100g: 30.9,
    },
  },
}

function ok(payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status: 200 })
}

describe('fetchProduct', () => {
  it('rend un produit analysé', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok(BODY))
    const product = await fetchProduct('3017620422003', fetchImpl as unknown as typeof fetch)
    expect(product.name).toBe('Nutella')
  })

  it("interroge l'endpoint v2 en s'identifiant", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok(BODY))
    await fetchProduct('3017620422003', fetchImpl as unknown as typeof fetch)
    const url = String(fetchImpl.mock.calls[0][0])
    expect(url).toContain('https://world.openfoodfacts.org/api/v2/product/3017620422003.json')
    expect(url).toContain('app_name=RecompOS')
    expect(url).toContain('fields=')
  })

  it("n'essaie pas d'écrire un User-Agent, que le navigateur interdit", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok(BODY))
    await fetchProduct('3017620422003', fetchImpl as unknown as typeof fetch)
    const init = (fetchImpl.mock.calls[0][1] ?? {}) as RequestInit
    expect(JSON.stringify(init.headers ?? {})).not.toMatch(/user-agent/i)
  })

  it('traite status 0 comme un produit inconnu, malgré le HTTP 200', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(ok({ code: '0000', status: 0, status_verbose: 'no code' }))
    await expect(
      fetchProduct('0000000000000', fetchImpl as unknown as typeof fetch),
    ).rejects.toMatchObject({ kind: 'not_found' })
  })

  it('remonte une erreur serveur sur un 429', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('slow down', { status: 429 }))
    await expect(
      fetchProduct('3017620422003', fetchImpl as unknown as typeof fetch),
    ).rejects.toMatchObject({ kind: 'server' })
  })

  it('remonte une panne réseau', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('failed to fetch'))
    await expect(
      fetchProduct('3017620422003', fetchImpl as unknown as typeof fetch),
    ).rejects.toMatchObject({ kind: 'network' })
  })

  it('remonte un corps illisible', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('pas du json', { status: 200 }))
    await expect(
      fetchProduct('3017620422003', fetchImpl as unknown as typeof fetch),
    ).rejects.toMatchObject({ kind: 'bad_response' })
  })

  it('propage no_nutriments depuis le parseur', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        ok({ status: 1, product: { code: '1', product_name: 'Vide', nutriments: {} } }),
      )
    await expect(fetchProduct('1', fetchImpl as unknown as typeof fetch)).rejects.toMatchObject({
      kind: 'no_nutriments',
    })
  })
})
