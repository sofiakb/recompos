import { describe, expect, it, vi } from 'vitest'
import { askCoach } from '@/lib/coach/ask'
import { buildDigest } from '@/lib/coach/digest'
import { WEEKS } from '@/lib/coach/fixtures'
import { PERSONAS } from '@/lib/coach/personas'
import { LlmError, type ConfiguredProvider } from '@/lib/llm/client'
import type { CoachMessage } from '@/types/models'

const GOOD = JSON.stringify({
  constat: 'Tes protéines tiennent bien cette semaine.',
  suggestion: { titre: 'Un skyr', detail: 'Ajoute un skyr au dessert.' },
  question: null,
})
const GUILTY = JSON.stringify({
  constat: 'Tu as fait un écart samedi.',
  suggestion: null,
  question: null,
})

function reply(content: string, status = 200): Response {
  return new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status })
}
function groq(): ConfiguredProvider {
  return { id: 'groq', settings: { apiKey: 'gsk_test', enabled: true } }
}
function input(question = 'Bilan de ma semaine', history: CoachMessage[] = []) {
  return { persona: PERSONAS.nutrition, question, digest: buildDigest(WEEKS.regular), history }
}
const asFetch = (f: unknown) => f as typeof fetch
const bodyOf = (fetchImpl: ReturnType<typeof vi.fn>, call: number) =>
  JSON.parse(String(fetchImpl.mock.calls[call][1].body))

describe('askCoach', () => {
  it('rend une réponse en un appel', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(reply(GOOD))
    const outcome = await askCoach([groq()], input(), asFetch(fetchImpl))
    expect(outcome).toMatchObject({ kind: 'reply', providerId: 'groq', rewrites: 0 })
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })

  it('envoie le résumé, la persona et les réglages du coach', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(reply(GOOD))
    await askCoach([groq()], input(), asFetch(fetchImpl))
    const body = bodyOf(fetchImpl, 0)
    expect(body.messages[0]).toEqual({ role: 'system', content: PERSONAS.nutrition.systemPrompt })
    expect(body.messages.at(-1).content).toContain('"aujourdhui":"2026-11-01"')
    expect(body.messages.at(-1).content).toContain('Ma question : Bilan de ma semaine')
    expect(body.temperature).toBe(0.7)
    expect(body.reasoning_effort).toBe('low')
    expect(body.model).toBe('openai/gpt-oss-120b')
    expect(body.response_format).toEqual({ type: 'json_object' })
  })

  it("n'appelle rien sur un message de détresse, même sans service configuré", async () => {
    const fetchImpl = vi.fn()
    const outcome = await askCoach([], input('je vais me faire vomir'), asFetch(fetchImpl))
    expect(outcome).toEqual({ kind: 'distress', distress: 'eating' })
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('refuse sans service configuré', async () => {
    await expect(askCoach([], input(), asFetch(vi.fn()))).rejects.toMatchObject({ kind: 'auth' })
  })

  it('répare une réponse illisible une fois', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(reply('Voici mon avis'))
      .mockResolvedValueOnce(reply(GOOD))
    const outcome = await askCoach([groq()], input(), asFetch(fetchImpl))
    expect(outcome.kind).toBe('reply')
    expect(fetchImpl).toHaveBeenCalledTimes(2)
  })

  it('fait réécrire une réponse culpabilisante, en nommant le mot', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(reply(GUILTY))
      .mockResolvedValueOnce(reply(GOOD))
    const outcome = await askCoach([groq()], input(), asFetch(fetchImpl))
    expect(outcome).toMatchObject({ kind: 'reply', rewrites: 1 })
    const second = bodyOf(fetchImpl, 1)
    expect(second.messages.at(-1).content).toContain('« écart »')
    expect(second.messages.at(-2)).toEqual({ role: 'assistant', content: GUILTY })
  })

  it('ne montre jamais une réponse toujours fautive : repli neutre', async () => {
    // A fresh Response per call: a body can only be read once.
    const fetchImpl = vi.fn().mockImplementation(() => Promise.resolve(reply(GUILTY)))
    const outcome = await askCoach([groq()], input(), asFetch(fetchImpl))
    expect(outcome).toEqual({ kind: 'fallback', providerId: 'groq' })
    expect(fetchImpl).toHaveBeenCalledTimes(2)
  })

  it('passe au service suivant sur une clé refusée', async () => {
    const openrouter: ConfiguredProvider = {
      id: 'openrouter',
      settings: { apiKey: 'sk', enabled: true, model: 'm', textModel: 'm' },
    }
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(reply('', 401))
      .mockResolvedValueOnce(reply(GOOD))
    const outcome = await askCoach([groq(), openrouter], input(), asFetch(fetchImpl))
    expect(outcome).toMatchObject({ kind: 'reply', providerId: 'openrouter' })
  })

  it('replie sur le modèle de secours quand le défaut a disparu', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(reply('model_not_found', 404))
      .mockResolvedValueOnce(reply(GOOD))
    const outcome = await askCoach([groq()], input(), asFetch(fetchImpl))
    expect(outcome.kind).toBe('reply')
    const second = bodyOf(fetchImpl, 1)
    expect(second.model).toBe('llama-3.3-70b-versatile')
    expect(second).not.toHaveProperty('reasoning_effort')
  })

  it('rejette avec la dernière erreur quand tout échoue', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(reply('', 429))
    await expect(askCoach([groq()], input(), asFetch(fetchImpl))).rejects.toBeInstanceOf(LlmError)
  })

  it("rejoue l'historique, sans les réponses synthétiques", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(reply(GOOD))
    const base = { persona: 'nutrition' as const, timestamp: '', date: '' }
    const history: CoachMessage[] = [
      { ...base, id: '1', role: 'user', text: 'q1' },
      {
        ...base,
        id: '2',
        role: 'coach',
        reply: { constat: 'c1', suggestion: null, question: null },
      },
      { ...base, id: '3', role: 'coach', text: 'fixe', synthetic: true },
    ]
    await askCoach([groq()], input('q2', history), asFetch(fetchImpl))
    const messages = bodyOf(fetchImpl, 0).messages
    expect(messages).toHaveLength(4)
    expect(messages[1]).toEqual({ role: 'user', content: 'q1' })
    expect(messages[2].role).toBe('assistant')
    expect(messages[2].content).toContain('c1')
  })
})
