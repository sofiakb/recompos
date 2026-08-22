/** The photo vault. Bytes stay in IndexedDB and never leave the device. */
import { db, type RecompDb } from '@/db/dexie'
import { encodePhoto } from '@/lib/image'
import { toLogicalDate, type IsoDate } from '@/lib/date'
import { createId } from '@/lib/utils'
import type { PhotoAngle, ProgressPhoto } from '@/types/models'

export async function addPhoto(
  file: File,
  angle: PhotoAngle,
  date: IsoDate = toLogicalDate(),
  database: RecompDb = db,
): Promise<ProgressPhoto> {
  const encoded = await encodePhoto(file)
  const photo: ProgressPhoto = {
    id: createId(),
    date,
    angle,
    createdAt: new Date().toISOString(),
    ...encoded,
  }
  await database.photos.add(photo)
  return photo
}

/** Newest first — the comparison view pairs the newest against the oldest. */
export async function allPhotos(database: RecompDb = db): Promise<ProgressPhoto[]> {
  const rows = await database.photos.toArray()
  return rows.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
}

export async function photosForAngle(
  angle: PhotoAngle,
  database: RecompDb = db,
): Promise<ProgressPhoto[]> {
  return (await allPhotos(database)).filter((photo) => photo.angle === angle)
}

export async function deletePhoto(id: string, database: RecompDb = db): Promise<void> {
  await database.photos.delete(id)
}

export async function photoBytesTotal(database: RecompDb = db): Promise<number> {
  const rows = await database.photos.toArray()
  return rows.reduce((total, photo) => total + photo.byteSize, 0)
}
