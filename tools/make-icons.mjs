/**
 * Draws the app icon at every size the manifest asks for.
 *
 *   node tools/make-icons.mjs
 *
 * A rasteriser rather than a checked-in binary: the icon is four rounded bars
 * on a ground, and both colours come from the theme. When the accent moves
 * again, this file is where it moves — not in an image editor, and not in a
 * dependency the app does not otherwise need.
 *
 * The mark is `docs/../public/favicon.svg` in code: three rising bars over a
 * baseline. The SVG stays the source for the browser tab; this draws the same
 * geometry so the two never drift.
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'

/** Supersampling factor. Straight edges do not need it; the corners do. */
const SS = 4

// The accent, both ends of its gradient, and the ground — the tokens of
// `src/index.css` resolved to sRGB.
const BRIGHT = [0x83, 0xec, 0xd4] // hsl(166 74% 72%)
const DEEP = [0x38, 0xc7, 0xad] // hsl(169 56% 50%)
const GROUND = [0x0b, 0x0d, 0x0c] // hsl(170 8% 5%)

/** The mark, on a 100×100 grid: [x, y, w, h, r]. */
const BARS = [
  [20, 76, 60, 6, 3],
  [22, 52, 14, 18, 4],
  [43, 38, 14, 32, 4],
  [64, 22, 14, 48, 4],
]
/** The rounded square the mark sits on, when the icon draws its own ground. */
const PLATE_RADIUS = 22

function insideRoundedRect(px, py, [x, y, w, h, r]) {
  if (px < x || px > x + w || py < y || py > y + h) return false
  const cx = Math.min(Math.max(px, x + r), x + w - r)
  const cy = Math.min(Math.max(py, y + r), y + h - r)
  const dx = px - cx
  const dy = py - cy
  return dx * dx + dy * dy <= r * r
}

/**
 * One icon, as raw RGBA.
 *
 * `safe` is the share of the edge a maskable icon must be able to lose: Android
 * crops it to whatever shape the launcher uses, so the mark is drawn smaller
 * and the ground runs to the edge with no rounding of its own.
 */
function draw(size, { maskable = false } = {}) {
  const safe = maskable ? 0.1 : 0
  const dim = size * SS
  const pixels = Buffer.alloc(dim * dim * 4)

  // The mark occupies the middle of the grid, inset by the safe zone.
  const scale = (dim * (1 - 2 * safe)) / 100
  const offset = dim * safe

  for (let py = 0; py < dim; py += 1) {
    for (let px = 0; px < dim; px += 1) {
      // Back to the 100×100 grid, at the centre of the pixel.
      const gx = (px + 0.5 - offset) / scale
      const gy = (py + 0.5 - offset) / scale
      const plateX = (px + 0.5) / (dim / 100)
      const plateY = (py + 0.5) / (dim / 100)

      const onPlate = maskable || insideRoundedRect(plateX, plateY, [0, 0, 100, 100, PLATE_RADIUS])
      const onMark = BARS.some((bar) => insideRoundedRect(gx, gy, bar))

      const i = (py * dim + px) * 4
      if (onMark) {
        // The accent ramp runs across the mark, bright to deep, like every
        // other accent surface in the app.
        const t = Math.min(1, Math.max(0, (gx + gy) / 200))
        pixels[i] = Math.round(BRIGHT[0] + (DEEP[0] - BRIGHT[0]) * t)
        pixels[i + 1] = Math.round(BRIGHT[1] + (DEEP[1] - BRIGHT[1]) * t)
        pixels[i + 2] = Math.round(BRIGHT[2] + (DEEP[2] - BRIGHT[2]) * t)
        pixels[i + 3] = 255
      } else if (onPlate) {
        pixels[i] = GROUND[0]
        pixels[i + 1] = GROUND[1]
        pixels[i + 2] = GROUND[2]
        pixels[i + 3] = 255
      }
      // Off the plate stays transparent: an apple-touch-icon gets its own
      // opaque pass, a favicon keeps its corners cut.
    }
  }

  return downsample(pixels, dim, size)
}

/** Box filter back to the target size — this is where the corners get smooth. */
function downsample(pixels, dim, size) {
  const out = Buffer.alloc(size * size * 4)
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let r = 0
      let g = 0
      let b = 0
      let a = 0
      for (let sy = 0; sy < SS; sy += 1) {
        for (let sx = 0; sx < SS; sx += 1) {
          const i = ((y * SS + sy) * dim + (x * SS + sx)) * 4
          // Premultiplied, or a transparent pixel's black would bleed into the
          // edge it sits next to.
          const alpha = pixels[i + 3] / 255
          r += pixels[i] * alpha
          g += pixels[i + 1] * alpha
          b += pixels[i + 2] * alpha
          a += pixels[i + 3]
        }
      }
      const count = SS * SS
      const alpha = a / count
      const j = (y * size + x) * 4
      const un = alpha === 0 ? 0 : 255 / alpha
      out[j] = Math.round((r / count) * un)
      out[j + 1] = Math.round((g / count) * un)
      out[j + 2] = Math.round((b / count) * un)
      out[j + 3] = Math.round(alpha)
    }
  }
  return out
}

/** Flattens transparency onto the ground, for icons that may not keep alpha. */
function onGround(rgba) {
  const out = Buffer.from(rgba)
  for (let i = 0; i < out.length; i += 4) {
    const alpha = out[i + 3] / 255
    for (let c = 0; c < 3; c += 1) {
      out[i + c] = Math.round(out[i + c] * alpha + GROUND[c] * (1 - alpha))
    }
    out[i + 3] = 255
  }
  return out
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body) >>> 0)
  return Buffer.concat([length, body, crc])
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(buffer) {
  let c = 0xffffffff
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return c ^ 0xffffffff
}

function png(rgba, size) {
  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header[8] = 8 // bit depth
  header[9] = 6 // truecolour with alpha
  // Each row is prefixed with its filter type; 0 is « none », which deflate
  // compresses well enough for four flat colours.
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y += 1) {
    raw[y * (size * 4 + 1)] = 0
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const ICONS = [
  { path: 'public/icons/icon-192.png', size: 192 },
  { path: 'public/icons/icon-512.png', size: 512 },
  { path: 'public/icons/icon-maskable-512.png', size: 512, maskable: true },
  // iOS never rounds an alpha corner itself — it fills it black. The Apple
  // icon is flattened onto the ground and squared off; the OS masks it.
  { path: 'public/apple-touch-icon.png', size: 180, flatten: true },
]

for (const { path, size, maskable, flatten } of ICONS) {
  const rgba = draw(size, { maskable: maskable || flatten })
  writeFileSync(path, png(flatten ? onGround(rgba) : rgba, size))
  console.log(`${path} — ${size}×${size}`)
}
