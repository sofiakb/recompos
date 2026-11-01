import { describe, expect, it, vi } from 'vitest'
import { askCoach, cleanAnswer, HISTORY_LINES } from '@/lib/coach/ask'
import { buildDigest } from '@/lib/coach/digest'
import { WEEKS } from '@/lib/coach/fixtures'
import { PERSONAS } from '@/lib/coach/personas'
import { LlmError, type ConfiguredProvider } from '@/lib/llm/client'
import type { CoachMessage } from '@/types/models'

const GOOD = 'Ça va bien, merci ! Et toi, comment se passe ta journée côté repas ?'
const GUILTY = 'Tu as fait un écart samedi, tu peux le rattraper.'

function reply(content: string, status = 200): Response {
  return new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status })
}
/** A fresh Response per call: a body can only be read once. */
const always = (content: string, status = 200) =>
  vi.fn().mockImplementation(() => Promise.resolve(reply(content, status)))
function groq(): ConfiguredProvider {
  return { id: 'groq', settings: { apiKey: 'gsk_test', enabled: true } }
}
function input(question = 'Ça va ?', history: CoachMessage[] = []) {
  return { persona: PERSONAS.nutrition, question, digest: buildDigest(WEEKS.regular), history }
}
const asFetch = (f: unknown) => f as typeof fetch
const bodyOf = (fetchImpl: ReturnType<typeof vi.fn>, call: number) =>
  JSON.parse(String(fetchImpl.mock.calls[call][1].body))
const base = { persona: 'nutrition' as const, timestamp: '', date: '' }

describe('askCoach', () => {
  it('rend la réponse du coach en texte, en un appel', async () => {
    const fetchImpl = always(GOOD)
    const outcome = await askCoach([groq()], input(), asFetch(fetchImpl))
    expect(outcome).toEqual({ kind: 'reply', text: GOOD, providerId: 'groq', rewrites: 0 })
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })

  it('envoie la question telle quelle, et le contexte une seule fois, en système', async () => {
    const fetchImpl = always(GOOD)
    await askCoach([groq()], input('Ça va ?'), asFetch(fetchImpl))
    const body = bodyOf(fetchImpl, 0)
    expect(body.messages[0].role).toBe('system')
    expect(body.messages[0].content).toContain('"aujourdhui":"2026-11-01"')
    expect(body.messages.at(-1)).toEqual({ role: 'user', content: 'Ça va ?' })
    expect(JSON.stringify(body.messages.slice(1))).not.toContain('aujourdhui')
  })

  it('ne force jamais le mode JSON, même si on parle de json', async () => {
    const fetchImpl = always(GOOD)
    await askCoach([groq()], input('c’est quoi un fichier json ?'), asFetch(fetchImpl))
    const body = bodyOf(fetchImpl, 0)
    expect(body).not.toHaveProperty('response_format')
    expect(body.temperature).toBe(0.8)
    expect(body.reasoning_effort).toBe('low')
  })

  it('rejoue la conversation, ancien format compris, sans les réponses fixes', async () => {
    const fetchImpl = always(GOOD)
    const history: CoachMessage[] = [
      { ...base, id: '1', role: 'user', text: 'J’ai pris 6 kg' },
      { ...base, id: '2', role: 'coach', text: 'Ça arrive. Qu’est-ce qui a changé ?' },
      { ...base, id: '3', role: 'user', text: 'Les raclettes' },
      { ...base, id: '4', role: 'coach', text: 'fixe', synthetic: true },
      {
        ...base,
        id: '5',
        role: 'coach',
        reply: { constat: 'Ancienne réponse.', suggestion: null, question: 'Et toi ?' },
      },
    ]
    await askCoach([groq()], input('Comment faire ?', history), asFetch(fetchImpl))
    const messages = bodyOf(fetchImpl, 0).messages.slice(1)
    expect(messages).toEqual([
      { role: 'user', content: 'J’ai pris 6 kg' },
      { role: 'assistant', content: 'Ça arrive. Qu’est-ce qui a changé ?' },
      { role: 'user', content: 'Les raclettes' },
      { role: 'assistant', content: 'Ancienne réponse. Et toi ?' },
      { role: 'user', content: 'Comment faire ?' },
    ])
  })

  it('suit un vrai fil : vingt lignes d’historique', () => {
    expect(HISTORY_LINES).toBe(20)
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

  it('fait réécrire une réponse culpabilisante, en nommant les mots', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(reply(GUILTY))
      .mockResolvedValueOnce(reply(GOOD))
    const outcome = await askCoach([groq()], input(), asFetch(fetchImpl))
    expect(outcome).toMatchObject({ kind: 'reply', text: GOOD, rewrites: 1 })
    const second = bodyOf(fetchImpl, 1)
    expect(second.messages.at(-1).content).toContain('« écart »')
    expect(second.messages.at(-2)).toEqual({ role: 'assistant', content: GUILTY })
  })

  it('ne montre jamais une réponse toujours fautive : repli neutre', async () => {
    const fetchImpl = always(GUILTY)
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
    expect(bodyOf(fetchImpl, 1).model).toBe('llama-3.3-70b-versatile')
  })

  it('rejette avec la dernière erreur quand tout échoue', async () => {
    const fetchImpl = always('', 429)
    await expect(askCoach([groq()], input(), asFetch(fetchImpl))).rejects.toBeInstanceOf(LlmError)
  })
})

describe('cleanAnswer', () => {
  it('retire le gras markdown, les titres et les guillemets d’enrobage', () => {
    expect(cleanAnswer('"## Coucou\nTu peux **essayer** ça."')).toBe('Coucou\nTu peux essayer ça.')
  })
})
