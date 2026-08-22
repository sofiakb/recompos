import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { addPhoto, allPhotos, deletePhoto } from '@/db/repositories/photoRepository'
import { photoObjectUrl } from '@/lib/image'
import { toLogicalDate } from '@/lib/date'
import { haptic } from '@/lib/utils'
import type { PhotoAngle, ProgressPhoto } from '@/types/models'

export interface PhotosState {
  /** Newest first. */
  photos: ProgressPhoto[]
  /** Object URL per photo id, revoked when the set changes. */
  urls: Map<string, string>
  totalBytes: number
  add: (file: File, angle: PhotoAngle) => Promise<void>
  remove: (id: string) => Promise<void>
}

export function usePhotos(): PhotosState {
  const query = useLiveQuery(() => allPhotos(), [], [])
  const photos = useMemo(() => query ?? [], [query])
  const [urls, setUrls] = useState<Map<string, string>>(new Map())

  // Object URLs are a leak if they outlive their photo, so they are rebuilt and
  // revoked as one unit whenever the set changes.
  useEffect(() => {
    const next = new Map(
      photos.map((photo) => [photo.id, photoObjectUrl(photo.bytes, photo.mimeType)]),
    )
    setUrls(next)
    return () => {
      for (const url of next.values()) URL.revokeObjectURL(url)
    }
  }, [photos])

  const add = useCallback(async (file: File, angle: PhotoAngle) => {
    await addPhoto(file, angle, toLogicalDate())
    haptic()
  }, [])

  const remove = useCallback((id: string) => deletePhoto(id), [])

  return {
    photos,
    urls,
    totalBytes: photos.reduce((total, photo) => total + photo.byteSize, 0),
    add,
    remove,
  }
}
