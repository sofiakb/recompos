import { describe, expect, it, vi } from 'vitest'
import { analyseMealText } from '@/lib/llm/meal'
import { LlmError, type ConfiguredProvider } from '@/lib/llm/client'

const ANSWER = JSON.stringify({
  label: 'Poulet riz',
  items: [
    { name: 'Blanc de poulet', quantity: '200 g', kcal: 330, proteinG: 62, carbsG: 0, fatG: 7 },
    { name: 'Riz cuit', quantity: '150 g', kcal: 195, proteinG: 4, carbsG: 42, fatG: 1 },
  ],
  confidence: 'medium',
})

function reply(content: string, status = 200): Response {
  return new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status })
}

function groq(overrides = {}): ConfiguredProvider {
  return { id: 'groq', settings: { apiKey: 'gsk_test', enabled: true, ...overrides } }
}

describe('analyseMealText', () => {
  it('lit un repas décrit et recalcule les totaux depuis les lignes', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(reply(ANSWER))
    const outcome = await analyseMealText(
      [groq()],
      '200 g de poulet et 150 g de riz',
      fetchImpl as unknown as typeof fetch,
    )
    expect(outcome.providerId).toBe('groq')
    expect(outcome.analysis.items).toHaveLength(2)
    expect(outcome.analysis.kcal).toBe(525)
    expect(outcome.analysis.proteinG).toBe(66)
  })

  it('utilise le modèle texte et non le modèle vision', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(reply(ANSWER))
    await analyseMealText(
      [groq({ model: 'vision-a-moi', textModel: 'texte-a-moi' })],
      'une pomme',
      fetchImpl as unknown as typeof fetch,
    )
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1].body))
    expect(body.model).toBe('texte-a-moi')
  })

  it("n'envoie aucune image", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(reply(ANSWER))
    await analyseMealText([groq()], 'une pomme', fetchImpl as unknown as typeof fetch)
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1].body))
    expect(JSON.stringify(body)).not.toContain('image_url')
  })

  it('porte la description dans le message utilisateur', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(reply(ANSWER))
    await analyseMealText([groq()], 'tajine de poulet', fetchImpl as unknown as typeof fetch)
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1].body))
    expect(JSON.stringify(body)).toContain('tajine de poulet')
  })

  it('répare une réponse enrobée de prose', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(reply('Voici : pas du JSON du tout'))
      .mockResolvedValueOnce(reply(ANSWER))
    const outcome = await analyseMealText(
      [groq()],
      'une pomme',
      fetchImpl as unknown as typeof fetch,
    )
    expect(outcome.analysis.items).toHaveLength(2)
    expect(fetchImpl).toHaveBeenCalledTimes(2)
  })

  it('passe au provider suivant après un quota atteint', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response('rate limited', { status: 429 }))
      .mockResolvedValueOnce(reply(ANSWER))
    const outcome = await analyseMealText(
      [groq(), { id: 'openrouter', settings: { apiKey: 'k', enabled: true, textModel: 'a/b' } }],
      'une pomme',
      fetchImpl as unknown as typeof fetch,
    )
    expect(outcome.providerId).toBe('openrouter')
  })

  it('remonte une erreur typée quand aucun provider ne répond', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('boom', { status: 500 }))
    await expect(
      analyseMealText([groq()], 'une pomme', fetchImpl as unknown as typeof fetch),
    ).rejects.toBeInstanceOf(LlmError)
  })

  it("refuse d'appeler quoi que ce soit sans provider configuré", async () => {
    await expect(analyseMealText([], 'une pomme')).rejects.toMatchObject({ kind: 'auth' })
  })
})
