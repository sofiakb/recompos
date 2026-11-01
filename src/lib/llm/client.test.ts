import { describe, expect, it, vi } from 'vitest'
import { postCompletion, resolveEndpoint, supportsReasoningEffort } from '@/lib/llm/client'

const KEY = { apiKey: 'gsk_test', enabled: true } as const

const TEXT_MODEL = 'un-modele-texte'

describe('resolveEndpoint, modalité texte', () => {
  it('sert le modèle texte par défaut de Groq', () => {
    expect(resolveEndpoint('groq', KEY, 'text')?.model).toBe('openai/gpt-oss-120b')
  })

  it('garde le modèle vision par défaut sans modalité précisée', () => {
    expect(resolveEndpoint('groq', KEY)?.model).toBe(resolveEndpoint('groq', KEY, 'vision')?.model)
  })

  it('lit textModel, pas model, en texte', () => {
    const settings = { ...KEY, model: 'un-modele-vision', textModel: TEXT_MODEL }
    expect(resolveEndpoint('groq', settings, 'text')?.model).toBe(TEXT_MODEL)
    expect(resolveEndpoint('groq', settings, 'vision')?.model).toBe('un-modele-vision')
  })

  it('replie sur le modèle texte de secours quand on le demande', () => {
    expect(resolveEndpoint('groq', KEY, 'text', true)?.model).toBe('llama-3.3-70b-versatile')
  })

  it("ne replie jamais sur un modèle texte que l'utilisateur a saisi", () => {
    const settings = { ...KEY, textModel: 'le-mien' }
    expect(resolveEndpoint('groq', settings, 'text', true)?.model).toBe('le-mien')
  })

  it("refuse un provider sans défaut texte tant que rien n'est saisi", () => {
    expect(resolveEndpoint('openrouter', KEY, 'text')).toBeNull()
    expect(resolveEndpoint('openrouter', { ...KEY, textModel: 'x/y' }, 'text')?.model).toBe('x/y')
  })
})

describe('postCompletion, modalité texte', () => {
  it('envoie le modèle texte dans le corps de la requête', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ choices: [{ message: { content: 'ok' } }] })),
      )
    await postCompletion(
      'groq',
      { ...KEY, textModel: TEXT_MODEL },
      [{ role: 'user', content: 'coucou' }],
      fetchImpl as unknown as typeof fetch,
      false,
      'text',
    )
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1].body))
    expect(body.model).toBe(TEXT_MODEL)
  })
})

describe('postCompletion, options', () => {
  function okReply(): Response {
    return new Response(JSON.stringify({ choices: [{ message: { content: '{"ok":true}' } }] }), {
      status: 200,
    })
  }
  const json = [{ role: 'user', content: 'Réponds en JSON' }]
  const asFetch = (f: unknown) => f as typeof fetch

  it("garde le corps actuel quand aucune option n'est passée", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okReply())
    await postCompletion('groq', KEY, json, asFetch(fetchImpl), false, 'text')
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1].body))
    expect(body.temperature).toBe(0.5)
    expect(body.max_completion_tokens).toBe(2048)
    expect(body).not.toHaveProperty('reasoning_effort')
  })

  it('applique température et budget demandés', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okReply())
    await postCompletion('groq', KEY, json, asFetch(fetchImpl), false, 'text', {
      temperature: 0.7,
      maxTokens: 1500,
    })
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1].body))
    expect(body.temperature).toBe(0.7)
    expect(body.max_completion_tokens).toBe(1500)
  })

  it('envoie reasoning_effort à gpt-oss', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okReply())
    await postCompletion('groq', KEY, json, asFetch(fetchImpl), false, 'text', {
      reasoningEffort: 'low',
    })
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1].body))
    expect(body.model).toBe('openai/gpt-oss-120b')
    expect(body.reasoning_effort).toBe('low')
  })

  it("ne l'envoie pas au modèle de repli, qui ne le connaît pas", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okReply())
    await postCompletion('groq', KEY, json, asFetch(fetchImpl), true, 'text', {
      reasoningEffort: 'low',
    })
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1].body))
    expect(body.model).toBe('llama-3.3-70b-versatile')
    expect(body).not.toHaveProperty('reasoning_effort')
  })
})

describe('supportsReasoningEffort', () => {
  it("reconnaît gpt-oss et rien d'autre", () => {
    expect(supportsReasoningEffort('openai/gpt-oss-120b')).toBe(true)
    expect(supportsReasoningEffort('openai/gpt-oss-20b')).toBe(true)
    expect(supportsReasoningEffort('llama-3.3-70b-versatile')).toBe(false)
  })
})
