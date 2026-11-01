import { useEffect, useState } from 'react'
import { Sheet } from '@/components/ui/sheet'
import type { CoachDigest } from '@/lib/coach/types'
import { t } from '@/i18n/fr'

interface DigestSheetProps {
  open: boolean
  onClose: () => void
  load: () => Promise<CoachDigest>
}

/**
 * « Voir ce que le coach voit » (spec coach §6.1): the exact summary sent with
 * every question, indented and nothing else. Trust comes from seeing it whole.
 */
export function DigestSheet({ open, onClose, load }: Readonly<DigestSheetProps>) {
  const [digest, setDigest] = useState<CoachDigest | null>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setDigest(null)
    void load().then((value) => {
      if (!cancelled) setDigest(value)
    })
    return () => {
      cancelled = true
    }
  }, [open, load])

  return (
    <Sheet open={open} onClose={onClose} title={t.coach.digestTitle} tall>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        <p className="text-sm text-muted-foreground">{t.coach.digestExplain}</p>
        {digest ? (
          <pre className="whitespace-pre-wrap break-words rounded-md bg-muted/40 p-3 text-xs">
            {JSON.stringify(digest, null, 2)}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground">{t.coach.digestLoading}</p>
        )}
      </div>
    </Sheet>
  )
}
