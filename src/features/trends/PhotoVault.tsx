import { useRef, useState } from 'react'
import { Camera, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Segmented } from '@/components/ui/segmented'
import { usePhotos } from '@/features/trends/usePhotos'
import { useUiStore } from '@/stores/uiStore'
import { formatBytes } from '@/lib/format'
import { formatLongDate } from '@/lib/date'
import { t } from '@/i18n/fr'
import type { PhotoAngle } from '@/types/models'
import { TapTarget } from '@/components/ui/tap-target'

const ANGLE_OPTIONS = [
  { value: 'front' as const, label: t.photos.angle.front },
  { value: 'side' as const, label: t.photos.angle.side },
  { value: 'back' as const, label: t.photos.angle.back },
]

/**
 * Monthly photos, stored as bytes in IndexedDB (PRD §6.5).
 *
 * The comparison is deliberately first-versus-latest rather than a picker: the
 * useful question after three months is "against where I started", and any other
 * pair is one tap away in the grid below.
 */
export function PhotoVault() {
  const photos = usePhotos()
  const showToast = useUiStore((state) => state.showToast)
  const [angle, setAngle] = useState<PhotoAngle>('front')
  const fileInput = useRef<HTMLInputElement>(null)

  const ofAngle = photos.photos.filter((photo) => photo.angle === angle)
  const newest = ofAngle[0]
  const oldest = ofAngle[ofAngle.length - 1]
  const hasPair = ofAngle.length > 1

  const onFile = async (file: File | undefined) => {
    if (!file) return
    try {
      await photos.add(file, angle)
      showToast(t.photos.added)
    } catch {
      showToast(t.photos.failed)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.photos.title}</CardTitle>
        <CardDescription>{t.photos.hint}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Segmented
          label={t.photos.angleLabel}
          value={angle}
          options={ANGLE_OPTIONS}
          onChange={setAngle}
        />

        {hasPair ? (
          <div>
            <p className="mb-1 text-xs text-muted-foreground">{t.photos.compare}</p>
            <div className="grid grid-cols-2 gap-2">
              {[oldest, newest].map((photo) => (
                <figure key={photo.id} className="flex flex-col gap-1">
                  <img
                    src={photos.urls.get(photo.id)}
                    alt={t.photos.of(formatLongDate(photo.date), t.photos.angle[photo.angle])}
                    className="aspect-[3/4] w-full rounded-lg object-cover"
                  />
                  <figcaption className="text-[11px] text-muted-foreground">
                    {formatLongDate(photo.date)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ) : null}

        {ofAngle.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.photos.empty}</p>
        ) : (
          <ul className="grid grid-cols-3 gap-2">
            {ofAngle.map((photo) => (
              <li key={photo.id} className="relative">
                <img
                  src={photos.urls.get(photo.id)}
                  alt={t.photos.of(formatLongDate(photo.date), t.photos.angle[photo.angle])}
                  className="aspect-[3/4] w-full rounded-md object-cover"
                />
                <TapTarget
                  type="button"
                  aria-label={t.photos.delete}
                  onClick={async () => {
                    await photos.remove(photo.id)
                    showToast(t.photos.deleted)
                  }}
                  className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-md bg-background/80 text-muted-foreground backdrop-blur transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Trash2 size={14} aria-hidden />
                </TapTarget>
              </li>
            ))}
          </ul>
        )}

        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            void onFile(event.target.files?.[0])
            // Reset so re-picking the same file fires change again.
            event.target.value = ''
          }}
        />
        <Button variant="outline" block onClick={() => fileInput.current?.click()}>
          <Camera size={18} aria-hidden />
          {t.photos.add}
        </Button>

        {photos.photos.length > 0 ? (
          <p className="tnum text-xs text-muted-foreground">
            {t.photos.storage(formatBytes(photos.totalBytes), photos.photos.length)}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
