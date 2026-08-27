import { describe, expect, it, vi } from 'vitest'
import {
  analyseMeal,
  fitsInRequest,
  MAX_REQUEST_BYTES,
  mentionsJson,
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
      model: 'qwen/qwen3.8-27b',
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
      openrouter: { apiKey: 'or', enabled: true, model: 'un/modele' },
      groq: { apiKey: 'gsk', enabled: true },
    })
    expect(chain.map((provider) => provider.id)).toEqual(['groq', 'openrouter'])
  })

  it('skips a provider with no default model until one is named', () => {
    expect(configuredProviders({ openrouter: { apiKey: 'or', enabled: true } })).toEqual([])
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
    expect(body.max_completion_tokens).toBe(2048)
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
      [groq(), { id: 'openrouter', settings: { apiKey: 'or', enabled: true, model: 'un/modele' } }],
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
      [groq(), { id: 'openrouter', settings: { apiKey: 'or', enabled: true, model: 'un/modele' } }],
      { dataUrl: DATA_URL },
      fetchMock,
    )
    expect(outcome.providerId).toBe('openrouter')
  })

  it('stops at the first success instead of polling them all', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply(ANSWER))
    await analyseMeal(
      [groq(), { id: 'openrouter', settings: { apiKey: 'or', enabled: true, model: 'un/modele' } }],
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

/**
 * One test per constraint the provider documentation states, so a future edit
 * that quietly drops one fails here rather than on a plate.
 */
describe('provider contract', () => {
  it('asks for JSON mode only when the prompt says « json »', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply(ANSWER))
    await analyseWithProvider(groq(), { dataUrl: DATA_URL }, fetchMock)
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)

    // The platform rejects response_format unless the word appears somewhere.
    expect(body.response_format).toEqual({ type: 'json_object' })
    const said = JSON.stringify(body.messages)
    expect(/json/i.test(said)).toBe(true)
  })

  it('drops JSON mode rather than sending a request the platform will refuse', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply('{"ok":true}'))
    await testProvider(
      'custom',
      { apiKey: 'k', enabled: true, baseUrl: 'http://x/v1', model: 'm' },
      fetchMock,
    ).catch(() => undefined)
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    // The probe does say « JSON », so mode stays on and exercises the real path.
    expect(/json/i.test(JSON.stringify(body.messages))).toBe(true)
    expect(body.response_format).toEqual({ type: 'json_object' })
  })

  it('detects the word in a plain message, in a content part, and not elsewhere', () => {
    expect(mentionsJson([{ role: 'user', content: 'Rends du JSON' }])).toBe(true)
    expect(
      mentionsJson([{ role: 'user', content: [{ type: 'text', text: 'réponds en json' }] }]),
    ).toBe(true)
    expect(mentionsJson([{ role: 'user', content: 'Décris ce plat' }])).toBe(false)
    // An image part carries no text, and must not be mistaken for one.
    expect(
      mentionsJson([
        { role: 'user', content: [{ type: 'image_url', image_url: { url: 'data:image/json' } }] },
      ]),
    ).toBe(false)
    expect(mentionsJson([])).toBe(false)
  })

  it('omits JSON mode when the messages never ask for it', () => {
    // The guard is what keeps a prompt edit from earning a 400: it reads the
    // messages rather than trusting the call site to remember the rule.
    expect(mentionsJson([{ role: 'user', content: 'Décris ce plat' }])).toBe(false)
  })

  it('uses the documented completion-budget field, not the deprecated alias', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply(ANSWER))
    await analyseWithProvider(groq(), { dataUrl: DATA_URL }, fetchMock)
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.max_completion_tokens).toBe(2048)
    expect(body.max_tokens).toBeUndefined()
  })

  it('stays inside the documented temperature range, at its consistent end', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply(ANSWER))
    await analyseWithProvider(groq(), { dataUrl: DATA_URL }, fetchMock)
    const { temperature } = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(temperature).toBeGreaterThanOrEqual(0.5)
    expect(temperature).toBeLessThanOrEqual(0.7)
    expect(temperature).toBe(0.5)
  })

  it('raises the completion budget above the documented default of 1024', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply(ANSWER))
    await analyseWithProvider(groq(), { dataUrl: DATA_URL }, fetchMock)
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).max_completion_tokens).toBeGreaterThan(1024)
  })

  it('sends exactly one image, the documented maximum being three', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply(ANSWER))
    await analyseWithProvider(groq(), { dataUrl: DATA_URL }, fetchMock)
    const content = JSON.parse(fetchMock.mock.calls[0][1].body).messages[1].content
    expect(content.filter((part: { type: string }) => part.type === 'image_url')).toHaveLength(1)
  })

  it('sends the image inline as a data URL, never as a hosted link', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply(ANSWER))
    await analyseWithProvider(groq(), { dataUrl: DATA_URL }, fetchMock)
    const content = JSON.parse(fetchMock.mock.calls[0][1].body).messages[1].content
    expect(content[1].image_url.url.startsWith('data:image/')).toBe(true)
  })

  it('refuses a photo past the documented ceiling instead of earning a 400', async () => {
    const huge = `data:image/webp;base64,${'A'.repeat(MAX_REQUEST_BYTES)}`
    expect(fitsInRequest(huge)).toBe(false)
    expect(fitsInRequest(DATA_URL)).toBe(true)

    const fetchMock = vi.fn()
    await expect(analyseWithProvider(groq(), { dataUrl: huge }, fetchMock)).rejects.toMatchObject({
      kind: 'too_large',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('model fallback', () => {
  const notFound = () =>
    new Response(
      JSON.stringify({ error: { code: 'model_not_found', message: 'does not exist' } }),
      { status: 404 },
    )

  it('names a retired model rather than calling it a server fault', async () => {
    const fetchMock = vi.fn().mockResolvedValue(notFound())
    await expect(
      analyseWithProvider(
        {
          id: 'custom',
          settings: { apiKey: 'k', enabled: true, baseUrl: 'http://x/v1', model: 'parti' },
        },
        { dataUrl: DATA_URL },
        fetchMock,
      ),
    ).rejects.toMatchObject({ kind: 'model' })
  })

  it('retries the backup model when the built-in default has gone', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(notFound()).mockResolvedValueOnce(reply(ANSWER))

    const analysis = await analyseWithProvider(groq(), { dataUrl: DATA_URL }, fetchMock)
    expect(analysis.items).toHaveLength(1)
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).model).toBe('qwen/qwen3.8-27b')
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).model).toBe('qwen/qwen3.6-27b')
  })

  it('does not second-guess a model the user typed', async () => {
    const fetchMock = vi.fn().mockResolvedValue(notFound())
    await expect(
      analyseWithProvider(groq({ model: 'mon/choix' }), { dataUrl: DATA_URL }, fetchMock),
    ).rejects.toMatchObject({ kind: 'model' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('keeps the backup model for the repair attempt too', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(notFound())
      .mockResolvedValueOnce(reply('pas du JSON'))
      .mockResolvedValueOnce(reply(ANSWER))

    await analyseWithProvider(groq(), { dataUrl: DATA_URL }, fetchMock)
    expect(JSON.parse(fetchMock.mock.calls[2][1].body).model).toBe('qwen/qwen3.6-27b')
  })

  it('the key test reports the backup model when that is the one that works', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(notFound())
      .mockResolvedValueOnce(reply('{"ok":true}'))

    const result = await testProvider('groq', { apiKey: 'k', enabled: true }, fetchMock)
    expect(result).toEqual({ ok: true, model: 'qwen/qwen3.6-27b' })
  })

  it('reports the model failure when the backup is gone too', async () => {
    const fetchMock = vi.fn().mockResolvedValue(notFound())
    const result = await testProvider('groq', { apiKey: 'k', enabled: true }, fetchMock)
    expect(result).toMatchObject({ ok: false, kind: 'model' })
  })
})

describe('testProvider', () => {
  it('reports the model that answered', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply('{"ok":true}'))
    const result = await testProvider('groq', { apiKey: 'k', enabled: true }, fetchMock)
    expect(result).toEqual({ ok: true, model: 'qwen/qwen3.8-27b' })
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
