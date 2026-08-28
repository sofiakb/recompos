import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  detectBarcode,
  isCameraAvailable,
  isValidEan,
  prepareBarcodeDetector,
} from '@/lib/off/barcode'
import { t } from '@/i18n/fr'

interface BarcodeScannerProps {
  /** The camera runs only while this is true — a tab left behind must let go of it. */
  active: boolean
  onDetected: (barcode: string) => void
}

const FRAME_INTERVAL_MS = 400

/** Three states, one line each: nesting them as ternaries reads worse. */
function hintFor(preparing: boolean, scanning: boolean): string {
  if (preparing) return t.barcode.preparing
  if (scanning) return t.barcode.scanHint
  return t.barcode.typeHint
}

/**
 * The camera, and the field that exists because the camera often is not there.
 *
 * `BarcodeDetector` is missing on most non-Chromium browsers and `getUserMedia`
 * fails on a refused permission or an insecure origin. All three land in the
 * same place — the numeric field — because a scanner that cannot scan should
 * still let someone read the digits off the box.
 */
export function BarcodeScanner({ active, onDetected }: Readonly<BarcodeScannerProps>) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scanning, setScanning] = useState(false)
  const [preparing, setPreparing] = useState(false)
  const [typed, setTyped] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Held in a ref, not in the effect's dependencies. Both call sites pass an
  // inline arrow, so a new identity arrives on every parent render — and an
  // effect that re-runs on every render tears the camera down as fast as it
  // opens it, which is what « la caméra ne s'ouvre pas » looked like.
  const onDetectedRef = useRef(onDetected)
  useEffect(() => {
    onDetectedRef.current = onDetected
  })

  useEffect(() => {
    if (!active) return
    setTyped('')
    setError(null)
    if (!isCameraAvailable()) return

    let stream: MediaStream | null = null
    let timer: number | null = null
    let stopped = false

    // Both named rather than inlined into `setInterval(… .then(…))`: three
    // anonymous callbacks deep, the thing that actually happens on a hit stops
    // being findable.
    const accept = (code: string | null) => {
      if (!code || stopped) return
      stopped = true
      onDetectedRef.current(code)
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

      // Safari has to download the decoder first. Starting the loop before it
      // lands would show a live camera that silently reads nothing.
      setPreparing(true)
      const ready = await prepareBarcodeDetector()
      if (stopped) return
      setPreparing(false)
      if (!ready) {
        setError(t.barcode.readerFailed)
        return
      }

      timer = window.setInterval(scanFrame, FRAME_INTERVAL_MS)
    }

    void start()
    return () => {
      stopped = true
      if (timer !== null) window.clearInterval(timer)
      stream?.getTracks().forEach((track) => track.stop())
      setScanning(false)
      setPreparing(false)
    }
  }, [active])

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
    <div className="flex flex-col gap-3">
      <video
        ref={videoRef}
        className={scanning ? 'h-56 w-full rounded-lg bg-muted object-cover' : 'hidden'}
        muted
        playsInline
        aria-label={t.barcode.cameraLabel}
      />

      <p className="text-sm text-muted-foreground">{hintFor(preparing, scanning)}</p>

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

      {error ? <output className="block text-sm text-muted-foreground">{error}</output> : null}

      <Button size="lg" block disabled={!typed.trim()} onClick={submitTyped}>
        <Search size={16} aria-hidden />
        {t.barcode.search}
      </Button>
    </div>
  )
}
