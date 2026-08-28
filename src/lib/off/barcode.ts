/**
 * Reading a barcode, with the browser's own detector.
 *
 * `BarcodeDetector` ships in Chrome and in Safari 17+, and is absent elsewhere.
 * That is the whole reason the sheet above keeps a numeric field: a scanner
 * library would cost more bundle than every chart in the app put together, to
 * serve the browsers that are already the minority here.
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
  detect(source: CanvasImageSource): Promise<DetectedBarcode[]>
}

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => BarcodeDetectorLike

function detectorConstructor(): BarcodeDetectorConstructor | null {
  const found = (globalThis as { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector
  return typeof found === 'function' ? found : null
}

export function isBarcodeScanSupported(): boolean {
  return detectorConstructor() !== null
}

/** One frame, one look. Returns null when the frame holds no readable code. */
export async function detectBarcode(source: CanvasImageSource): Promise<string | null> {
  const Detector = detectorConstructor()
  if (!Detector) return null
  const detector = new Detector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] })
  const results = await detector.detect(source).catch(() => [])
  const value = results[0]?.rawValue
  return value && isValidEan(value) ? value : null
}
