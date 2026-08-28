import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { detectBarcode, isBarcodeScanSupported, isValidEan } from '@/lib/off/barcode'
import { t } from '@/i18n/fr'

interface BarcodeScanSheetProps {
  open: boolean
  onClose: () => void
  onDetected: (barcode: string) => void
}

const FRAME_INTERVAL_MS = 400

/**
 * The camera, and the field that exists because the camera often is not there.
 *
 * `BarcodeDetector` is missing on most non-Chromium browsers and `getUserMedia`
 * fails on a refused permission or an insecure origin. All three land in the
 * same place — the numeric field — because a scanner that cannot scan should
 * still let someone read the digits off the box.
 */
export function BarcodeScanSheet({ open, onClose, onDetected }: BarcodeScanSheetProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scanning, setScanning] = useState(false)
  const [typed, setTyped] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setTyped('')
    setError(null)
    if (!isBarcodeScanSupported() || !navigator.mediaDevices?.getUserMedia) return

    let stream: MediaStream | null = null
    let timer: number | null = null
    let stopped = false

    // Both named rather than inlined into `setInterval(… .then(…))`: three
    // anonymous callbacks deep, the thing that actually happens on a hit stops
    // being findable.
    const accept = (code: string | null) => {
      if (!code || stopped) return
      stopped = true
      onDetected(code)
    }

    const scanFrame = () => {
      const video = videoRef.current
      if (!video) return
      void detectBarcode(video).then(accept)
    }

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
      } catch {
        // Refused or unavailable: the typed field below is already on screen.
        return
      }
      if (stopped) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      const video = videoRef.current
      if (!video) return
      video.srcObject = stream
      await video.play().catch(() => undefined)
      setScanning(true)

      timer = window.setInterval(scanFrame, FRAME_INTERVAL_MS)
    }

    void start()
    return () => {
      stopped = true
      if (timer !== null) window.clearInterval(timer)
      stream?.getTracks().forEach((track) => track.stop())
      setScanning(false)
    }
  }, [open, onDetected])

  const submitTyped = () => {
    const digits = typed.trim()
    if (!isValidEan(digits)) {
      setError(t.barcode.invalid)
      return
    }
    setError(null)
    onDetected(digits)
  }

  return (
    <Sheet open={open} onClose={onClose} title={t.barcode.scanTitle}>
      <div className="flex flex-col gap-3">
        {scanning ? (
          <video
            ref={videoRef}
            className="h-56 w-full rounded-lg bg-muted object-cover"
            muted
            playsInline
            aria-label={t.barcode.cameraLabel}
          />
        ) : (
          <video ref={videoRef} className="hidden" muted playsInline />
        )}

        <p className="text-sm text-muted-foreground">
          {scanning ? t.barcode.scanHint : t.barcode.typeHint}
        </p>

        <Field label={t.barcode.digitsLabel}>
          {(id) => (
            <Input
              id={id}
              inputMode="numeric"
              autoComplete="off"
              className="tnum"
              placeholder="3017620422003"
              value={typed}
              onChange={(event) => {
                setTyped(event.target.value)
                setError(null)
              }}
            />
          )}
        </Field>

        {error ? (
          <p className="text-sm text-muted-foreground" role="status">
            {error}
          </p>
        ) : null}

        <Button size="lg" block disabled={!typed.trim()} onClick={submitTyped}>
          <Search size={16} aria-hidden />
          {t.barcode.search}
        </Button>
      </div>
    </Sheet>
  )
}
