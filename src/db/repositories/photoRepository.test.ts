import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RecompDb } from '@/db/dexie'
import {
  allPhotos,
  deletePhoto,
  photoBytesTotal,
  photosForAngle,
} from '@/db/repositories/photoRepository'
import type { PhotoAngle, ProgressPhoto } from '@/types/models'

let db: RecompDb

function photo(id: string, date: string, angle: PhotoAngle, size = 100): ProgressPhoto {
  return {
    id,
    date,
    bytes: new Uint8Array(size).buffer,
    mimeType: 'image/webp',
    angle,
    widthPx: 900,
    heightPx: 1200,
    byteSize: size,
    createdAt: `${date}T09:00:00.000Z`,
  }
}

beforeEach(async () => {
  db = new RecompDb(`test-${Math.random().toString(36).slice(2)}`)
  await db.open()
  await db.photos.bulkAdd([
    photo('a', '2026-06-01', 'front', 120),
    photo('b', '2026-07-01', 'front', 140),
    photo('c', '2026-07-01', 'side', 160),
  ])
})

afterEach(async () => {
  await db.delete()
})

describe('photoRepository', () => {
  it('lists photos newest first', async () => {
    expect((await allPhotos(db)).map((row) => row.id)).toEqual(['b', 'c', 'a'])
  })

  it('filters by angle', async () => {
    expect((await photosForAngle('front', db)).map((row) => row.id)).toEqual(['b', 'a'])
    expect(await photosForAngle('back', db)).toEqual([])
  })

  it('round-trips the bytes through IndexedDB', async () => {
    const stored = await db.photos.get('a')
    expect(stored?.bytes.byteLength).toBe(120)
    expect(stored?.mimeType).toBe('image/webp')
  })

  it('totals the stored size', async () => {
    expect(await photoBytesTotal(db)).toBe(420)
  })

  it('deletes one photo and leaves the rest', async () => {
    await deletePhoto('b', db)
    expect((await allPhotos(db)).map((row) => row.id)).toEqual(['c', 'a'])
  })
})
