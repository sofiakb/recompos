/**
 * Client-side photo downscaling (PRD §6.5).
 *
 * A phone camera writes 4 MB per shot; a monthly progress photo needs a
 * fraction of that. Everything happens on a canvas in the page — the file never
 * touches the network, and the original is never stored.
 */
export const MAX_EDGE_PX = 1200
export const WEBP_QUALITY = 0.8

export interface EncodedImage {
  bytes: ArrayBuffer
  mimeType: string
  widthPx: number
  heightPx: number
  byteSize: number
}

/** Fits the long edge to `maxEdge`, never enlarging a photo that is already small. */
export function fitWithin(
  width: number,
  height: number,
  maxEdge = MAX_EDGE_PX,
): { width: number; height: number } {
  const longest = Math.max(width, height)
  if (longest <= maxEdge) return { width, height }
  const ratio = maxEdge / longest
  return { width: Math.round(width * ratio), height: Math.round(height * ratio) }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('image decode failed'))
    }
    image.src = url
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('encode failed'))),
      type,
      quality,
    )
  })
}

export async function encodePhoto(file: File): Promise<EncodedImage> {
  const image = await loadImage(file)
  const { width, height } = fitWithin(image.naturalWidth, image.naturalHeight)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('canvas unavailable')
  context.drawImage(image, 0, 0, width, height)

  // Older Safari silently hands back a PNG when asked for WebP, so the actual
  // type is read off the blob rather than assumed.
  const blob = await canvasToBlob(canvas, 'image/webp', WEBP_QUALITY)
  const bytes = await blob.arrayBuffer()

  return {
    bytes,
    mimeType: blob.type || 'image/webp',
    widthPx: width,
    heightPx: height,
    byteSize: bytes.byteLength,
  }
}

/** Object URL for a stored photo. The caller must revoke it. */
export function photoObjectUrl(bytes: ArrayBuffer, mimeType: string): string {
  return URL.createObjectURL(new Blob([bytes], { type: mimeType }))
}
