import { writeFileSync } from 'node:fs'

// EAN-13, rendered straight to a Y4M file so Chromium can play it as a camera.
// If these tables are wrong the decoder simply will not read the code, which
// makes the whole thing self-checking.
const L = [
  '0001101',
  '0011001',
  '0010011',
  '0111101',
  '0100011',
  '0110001',
  '0101111',
  '0111011',
  '0110111',
  '0001011',
]
const G = [
  '0100111',
  '0110011',
  '0011011',
  '0100001',
  '0011101',
  '0111001',
  '0000101',
  '0010001',
  '0001001',
  '0010111',
]
const R = L.map((code) => [...code].map((b) => (b === '0' ? '1' : '0')).join(''))
const PARITY = [
  'LLLLLL',
  'LLGLGG',
  'LLGGLG',
  'LLGGGL',
  'LGLLGG',
  'LGGLLG',
  'LGGGLL',
  'LGLGLG',
  'LGLGGL',
  'LGGLGL',
]

function modules(ean) {
  const d = [...ean].map(Number)
  const parity = PARITY[d[0]]
  let bits = '101'
  for (let i = 0; i < 6; i++) bits += (parity[i] === 'L' ? L : G)[d[i + 1]]
  bits += '01010'
  for (let i = 0; i < 6; i++) bits += R[d[i + 7]]
  return bits + '101'
}

const EAN = process.argv[2] ?? '3017620422003'
const W = 640,
  H = 480,
  SCALE = 4,
  FRAMES = 60
const bits = modules(EAN)
const barW = bits.length * SCALE
const left = Math.floor((W - barW) / 2)
const top = 120,
  barH = 240

// Y plane: white page, black bars, generous quiet zone on both sides.
const y = Buffer.alloc(W * H, 235)
for (let row = top; row < top + barH; row++) {
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] !== '1') continue
    for (let px = 0; px < SCALE; px++) y[row * W + left + i * SCALE + px] = 16
  }
}
const uv = Buffer.alloc((W / 2) * (H / 2), 128)

const chunks = [Buffer.from(`YUV4MPEG2 W${W} H${H} F25:1 Ip A1:1 C420\n`)]
for (let f = 0; f < FRAMES; f++) chunks.push(Buffer.from('FRAME\n'), y, uv, uv)
writeFileSync('barcode.y4m', Buffer.concat(chunks))
console.log(`barcode.y4m écrit — EAN ${EAN}, ${bits.length} modules, ${FRAMES} images`)
