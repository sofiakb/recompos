/**
 * A stand-in for a vision provider, for local end-to-end runs.
 *
 * Its job is NOT to be permissive. It enforces the constraints the real service
 * documents, so a request shape that would earn a 400 in production earns one
 * here first:
 *
 *   - `response_format: json_object` refused unless a message says « json »
 *   - an unknown model id answers 404 `model_not_found`
 *   - a request over 20 MB is refused
 *   - more than 3 images in one request is refused
 *
 * The first two exist because both shipped as real bugs, found on a phone
 * rather than in CI.
 *
 *   node tools/mock-vision.mjs
 *
 * Then in Réglages → Analyse photo des repas: « Endpoint personnalisé », any
 * key, endpoint http://localhost:4319/v1, model qwen/qwen3.8-27b.
 */
import { createServer } from 'node:http'

const PORT = 4319
let lastRequest = null
let lastProbe = null

const ANSWER = {
  label: 'Poulet, riz, brocolis',
  items: [
    { name: 'Blanc de poulet', quantity: '150 g', kcal: 248, proteinG: 46, carbsG: 0, fatG: 5 },
    { name: 'Riz basmati', quantity: '200 g cuit', kcal: 260, proteinG: 5, carbsG: 56, fatG: 1 },
    { name: 'Brocolis', quantity: '120 g', kcal: 41, proteinG: 3, carbsG: 8, fatG: 0 },
  ],
  confidence: 'medium',
  notes: 'La matière grasse de cuisson est estimée.',
}

/**
 * Only the local preview and dev servers may call this.
 *
 * A wildcard would let any page open in the same browser post to a server that
 * echoes back what it received, including an Authorization header. It costs
 * nothing to name the two origins that actually need it.
 */
const ALLOWED_ORIGINS = new Set([
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

/** Well under the 20 MB the real service accepts, and enough for any meal photo. */
const MAX_BODY_BYTES = 24 * 1024 * 1024

createServer((req, res) => {
  const origin = req.headers.origin ?? ''
  const cors = {
    ...(ALLOWED_ORIGINS.has(origin) ? { 'Access-Control-Allow-Origin': origin } : {}),
    Vary: 'Origin',
    'Access-Control-Allow-Headers': 'authorization,content-type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors)
    res.end()
    return
  }
  if (req.url === '/__last' || req.url === '/__probe') {
    res.writeHead(200, { ...cors, 'Content-Type': 'application/json' })
    res.end(JSON.stringify((req.url === '/__probe' ? lastProbe : lastRequest) ?? {}))
    return
  }
  let body = ''
  let aborted = false
  req.on('data', (chunk) => {
    if (aborted) return
    body += chunk
    // Bounded on the way in: an unbounded accumulator is a memory leak waiting
    // for a bad client, even on a local tool.
    if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
      aborted = true
      res.writeHead(413, cors)
      res.end()
      req.destroy()
    }
  })
  req.on('end', () => {
    if (aborted) return
    let parsed = null
    try {
      parsed = JSON.parse(body)
    } catch {
      parsed = null
    }
    const auth = req.headers.authorization ?? ''

    // The documented rules, enforced. The point of this stand-in is not to be
    // permissive — it is to refuse what the real service refuses, so a request
    // shape that would earn a 400 in production earns one here first.
    const KNOWN_MODELS = ['qwen/qwen3.8-27b', 'qwen/qwen3.6-27b', 'faux-modele-vision']
    const MAX_BYTES = 20 * 1024 * 1024
    const MAX_IMAGES = 3
    const bad = (status, message, code) => {
      res.writeHead(status, { ...cors, 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          error: { message, type: 'invalid_request_error', ...(code ? { code } : {}) },
        }),
      )
    }

    if (Buffer.byteLength(body) > MAX_BYTES) {
      return bad(400, 'Request too large')
    }
    if (!KNOWN_MODELS.includes(parsed?.model)) {
      return bad(
        404,
        `The model \`${parsed?.model}\` does not exist or you do not have access to it.`,
        'model_not_found',
      )
    }
    const allText = JSON.stringify(parsed?.messages ?? [])
    if (parsed?.response_format?.type === 'json_object' && !/json/i.test(allText)) {
      return bad(
        400,
        "'messages' must contain the word 'json' in some form, to use 'response_format' of type 'json_object'.",
      )
    }
    const imageCount = (parsed?.messages ?? []).flatMap((m) =>
      Array.isArray(m.content) ? m.content.filter((part) => part.type === 'image_url') : [],
    ).length
    if (imageCount > MAX_IMAGES) {
      return bad(400, `Too many images: ${imageCount} (max ${MAX_IMAGES})`)
    }
    // The key-test call is text-only; the meal call carries an image part.
    const content = parsed?.messages?.at(-1)?.content
    const isImage = Array.isArray(content) && content.some((part) => part.type === 'image_url')
    if (isImage) {
      const image = content.find((part) => part.type === 'image_url').image_url.url
      lastRequest = {
        auth,
        model: parsed.model,
        responseFormat: parsed.response_format,
        imagePrefix: image.slice(0, 24),
        imageBytes: image.length,
        systemPrompt: parsed.messages[0]?.content?.slice(0, 60),
      }
    } else {
      // The key-test call: recorded so the browser run can assert on the bytes
      // that actually left the page, not on what the code looks like.
      lastProbe = {
        model: parsed?.model,
        responseFormat: parsed?.response_format,
        temperature: parsed?.temperature,
        maxCompletionTokens: parsed?.max_completion_tokens,
        messages: JSON.stringify(parsed?.messages ?? []),
      }
    }
    res.writeHead(200, { ...cors, 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        choices: [{ message: { content: isImage ? JSON.stringify(ANSWER) : '{"ok":true}' } }],
      }),
    )
  })
}).listen(PORT, () => console.log(`mock vision on ${PORT}`))
