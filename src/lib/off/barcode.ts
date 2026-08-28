/**
 * Reading a barcode.
 *
 * `BarcodeDetector` is a Chromium-only API. Safari does not implement it, and
 * every browser on iOS is Safari underneath — which is exactly the device a
 * barcode gets scanned with. So the native detector is used where it exists,
 * and a WebAssembly decoder is downloaded where it does not.
 *
 * That decoder is 449 kB gzipped, nearly three times the app shell, so it is
 * never bundled: it arrives on the first scan and is cached from then on. It is
 * also served from this origin rather than the CDN the library defaults to —
 * an offline-first app cannot hang on a third party being up, and nothing here
 * should tell one that a scan happened.
 */

const SUPPORTED_LENGTHS = new Set([8, 12, 13, 14])

/**
 * The trailing check digit, as defined for EAN/UPC.
 *
 * Worth having for the typed path: a mistyped digit is far more likely than a
 * misread scan, and catching it here saves a request and a wrong « produit
 * inconnu » that reads like OpenFoodFacts' fault.
 */
export function isValidEan(digits: string): boolean {
  if (!/^\d+$/.test(digits)) return false
  if (!SUPPORTED_LENGTHS.has(digits.length)) return false

  const check = Number(digits.at(-1))
  // Weights run 3,1,3,1… from the rightmost digit before the check digit, so
  // the walk counts backwards from the end rather than reversing a copy.
  let sum = 0
  for (let offset = 0; offset < digits.length - 1; offset += 1) {
    sum += Number(digits.at(-2 - offset)) * (offset % 2 === 0 ? 3 : 1)
  }
  return (10 - (sum % 10)) % 10 === check
}

interface DetectedBarcode {
  rawValue: string
}

interface BarcodeDetectorLike {
  detect(source: HTMLVideoElement): Promise<DetectedBarcode[]>
}

type BarcodeDetectorConstructor = new (options?: {
  formats?: readonly string[]
}) => BarcodeDetectorLike

/** The only symbologies a food product carries; anything else is noise. */
const FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e'] as const

let pending: Promise<BarcodeDetectorLike | null> | null = null

async function load(): Promise<BarcodeDetectorLike | null> {
  const native = (globalThis as { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector
  if (typeof native === 'function') return new native({ formats: FORMATS })

  try {
    const [ponyfill, wasm] = await Promise.all([
      import('barcode-detector/ponyfill'),
      import('zxing-wasm/reader/zxing_reader.wasm?url'),
    ])
    // Points the decoder at our own copy. Left alone it fetches from jsDelivr,
    // which would put a third party between the user and their own groceries.
    ponyfill.prepareZXingModule({
      overrides: {
        locateFile: (path: string, prefix: string) =>
          path.endsWith('.wasm') ? wasm.default : `${prefix}${path}`,
      },
    })
    return new ponyfill.BarcodeDetector({ formats: [...FORMATS] }) as BarcodeDetectorLike
  } catch {
    return null
  }
}

async function detector(): Promise<BarcodeDetectorLike | null> {
  pending ??= load()
  const resolved = await pending
  // A download that failed — offline on the first scan — must not poison every
  // later attempt with a cached null.
  if (!resolved) pending = null
  return resolved
}

/**
 * Whether a camera can be opened at all.
 *
 * Decoding is no longer the question, since a decoder can always be fetched;
 * what varies is whether this browser has a camera to point at anything.
 */
export function isCameraAvailable(): boolean {
  return Boolean(navigator.mediaDevices?.getUserMedia)
}

/**
 * Resolves once a detector exists — which means a download on Safari.
 *
 * Awaited before the scan loop starts so the screen can say « préparation »
 * instead of showing a live camera that quietly reads nothing.
 */
export async function prepareBarcodeDetector(): Promise<boolean> {
  return (await detector()) !== null
}

/** One frame, one look. Returns null when the frame holds no readable code. */
export async function detectBarcode(source: HTMLVideoElement): Promise<string | null> {
  const instance = await detector()
  if (!instance) return null
  const results = await instance.detect(source).catch(() => [])
  const value = results[0]?.rawValue
  return value && isValidEan(value) ? value : null
}
