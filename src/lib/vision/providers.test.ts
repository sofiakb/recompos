import { describe, expect, it, vi } from 'vitest'
import {
  analyseMeal,
  analyseWithProvider,
  configuredProviders,
  resolveEndpoint,
  testProvider,
  VisionError,
  type ConfiguredProvider,
} from '@/lib/vision/providers'

const DATA_URL = 'data:image/webp;base64,AAAA'

const ANSWER = JSON.stringify({
  label: 'Skyr',
  items: [{ name: 'Skyr', quantity: '150 g', kcal: 90, proteinG: 16, carbsG: 6, fatG: 0 }],
  confidence: 'high',
})

function reply(content: string, status = 200): Response {
  return new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status })
}

function groq(overrides = {}): ConfiguredProvider {
  return { id: 'groq', settings: { apiKey: 'gsk_test', enabled: true, ...overrides } }
}

describe('resolveEndpoint', () => {
  it('uses the provider defaults', () => {
    expect(resolveEndpoint('groq', { apiKey: 'k', enabled: true })).toEqual({
      url: 'https://api.groq.com/openai/v1/chat/completions',
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    })
  })

  it('lets the user override the model', () => {
    expect(resolveEndpoint('groq', { apiKey: 'k', enabled: true, model: 'autre' })?.model).toBe(
      'autre',
    )
  })

  it('trims a trailing slash off a custom endpoint', () => {
    expect(
      resolveEndpoint('custom', {
        apiKey: 'k',
        enabled: true,
        baseUrl: 'http://localhost:9999/v1/',
        model: 'm',
      })?.url,
    ).toBe('http://localhost:9999/v1/chat/completions')
  })

  it('refuses a custom provider with no endpoint or no model', () => {
    expect(resolveEndpoint('custom', { apiKey: 'k', enabled: true, model: 'm' })).toBeNull()
    expect(
      resolveEndpoint('custom', { apiKey: 'k', enabled: true, baseUrl: 'http://x/v1' }),
    ).toBeNull()
  })
})

describe('configuredProviders', () => {
  it('keeps only the ones with a key, in chain order', () => {
    const chain = configuredProviders({
      openrouter: { apiKey: 'or', enabled: true },
      groq: { apiKey: 'gsk', enabled: true },
    })
    expect(chain.map((provider) => provider.id)).toEqual(['groq', 'openrouter'])
  })

  it('skips a disabled or empty entry', () => {
    expect(
      configuredProviders({
        groq: { apiKey: 'gsk', enabled: false },
        openrouter: { apiKey: '   ', enabled: true },
      }),
    ).toEqual([])
  })

  it('skips a custom provider that is not fully configured', () => {
    expect(configuredProviders({ custom: { apiKey: 'k', enabled: true } })).toEqual([])
  })

  it('handles no settings at all', () => {
    expect(configuredProviders(undefined)).toEqual([])
  })
})

describe('analyseWithProvider', () => {
  it('sends the image and the key, and parses the answer', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply(ANSWER))
    const analysis = await analyseWithProvider(groq(), { dataUrl: DATA_URL }, fetchMock)

    expect(analysis.items[0].name).toBe('Skyr')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toContain('api.groq.com')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer gsk_test')
    const body = JSON.parse(init.body as string)
    expect(body.response_format).toEqual({ type: 'json_object' })
    expect(body.messages[1].content[1].image_url.url).toBe(DATA_URL)
  })

  it('passes a user hint through to the prompt', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply(ANSWER))
    await analyseWithProvider(groq(), { dataUrl: DATA_URL, hint: 'riz complet' }, fetchMock)
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string)
    expect(body.messages[1].content[0].text).toContain('riz complet')
  })

  it('asks a second time when the first answer is not usable', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(reply('je ne peux pas analyser cette image'))
      .mockResolvedValueOnce(reply(ANSWER))

    const analysis = await analyseWithProvider(groq(), { dataUrl: DATA_URL }, fetchMock)
    expect(analysis.items).toHaveLength(1)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('gives up after the repair attempt', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply('toujours pas'))
    await expect(analyseWithProvider(groq(), { dataUrl: DATA_URL }, fetchMock)).rejects.toThrow(
      VisionError,
    )
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('names an auth failure rather than calling it a network error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('nope', { status: 401 }))
    await expect(
      analyseWithProvider(groq(), { dataUrl: DATA_URL }, fetchMock),
    ).rejects.toMatchObject({ kind: 'auth' })
  })

  it('names a quota failure', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('slow down', { status: 429 }))
    await expect(
      analyseWithProvider(groq(), { dataUrl: DATA_URL }, fetchMock),
    ).rejects.toMatchObject({ kind: 'rate_limit' })
  })

  it('reports a thrown fetch as a network failure', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(
      analyseWithProvider(groq(), { dataUrl: DATA_URL }, fetchMock),
    ).rejects.toMatchObject({ kind: 'network' })
  })

  it('reports an empty completion', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply('   '))
    await expect(
      analyseWithProvider(groq(), { dataUrl: DATA_URL }, fetchMock),
    ).rejects.toMatchObject({ kind: 'bad_response' })
  })
})

describe('analyseMeal', () => {
  it('falls through to the next provider when the first fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('down', { status: 500 }))
      .mockResolvedValueOnce(reply(ANSWER))

    const outcome = await analyseMeal(
      [groq(), { id: 'openrouter', settings: { apiKey: 'or', enabled: true } }],
      { dataUrl: DATA_URL },
      fetchMock,
    )
    expect(outcome.providerId).toBe('openrouter')
  })

  it('falls through on a stale key too — that is what a second provider is for', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('bad key', { status: 401 }))
      .mockResolvedValueOnce(reply(ANSWER))

    const outcome = await analyseMeal(
      [groq(), { id: 'openrouter', settings: { apiKey: 'or', enabled: true } }],
      { dataUrl: DATA_URL },
      fetchMock,
    )
    expect(outcome.providerId).toBe('openrouter')
  })

  it('stops at the first success instead of polling them all', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply(ANSWER))
    await analyseMeal(
      [groq(), { id: 'openrouter', settings: { apiKey: 'or', enabled: true } }],
      { dataUrl: DATA_URL },
      fetchMock,
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('surfaces the last failure when the whole chain is down', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('nope', { status: 429 }))
    await expect(analyseMeal([groq()], { dataUrl: DATA_URL }, fetchMock)).rejects.toMatchObject({
      kind: 'rate_limit',
    })
  })

  it('says so when nothing is configured', async () => {
    await expect(analyseMeal([], { dataUrl: DATA_URL })).rejects.toMatchObject({ kind: 'auth' })
  })
})

describe('testProvider', () => {
  it('reports the model that answered', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply('{"ok":true}'))
    const result = await testProvider('groq', { apiKey: 'k', enabled: true }, fetchMock)
    expect(result).toEqual({ ok: true, model: 'meta-llama/llama-4-scout-17b-16e-instruct' })
  })

  it('reports why it failed rather than just failing', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 401 }))
    const result = await testProvider('groq', { apiKey: 'k', enabled: true }, fetchMock)
    expect(result).toMatchObject({ ok: false, kind: 'auth' })
  })

  it('refuses to test a half-configured custom provider', async () => {
    const result = await testProvider('custom', { apiKey: 'k', enabled: true })
    expect(result).toMatchObject({ ok: false, kind: 'bad_response' })
  })
})
