import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { t } from '@/i18n/fr'

interface CapturePreviewSheetProps {
  open: boolean
  /** Object URL of the encoded photo, owned by the caller. */
  previewUrl: string
  onCancel: () => void
  onConfirm: (context: string) => void
  pending: boolean
}

/**
 * The half-second between taking the photo and sending it.
 *
 * It exists for one sentence: the person is still in front of the plate and
 * knows things the picture does not — that the rice is wholegrain, that the
 * sauce is light. Said here, it costs one call. Said afterwards in the
 * correction box, it costs two.
 */
export function CapturePreviewSheet({
  open,
  previewUrl,
  onCancel,
  onConfirm,
  pending,
}: CapturePreviewSheetProps) {
  const [context, setContext] = useState('')

  useEffect(() => {
    if (open) setContext('')
  }, [open])

  return (
    <Sheet open={open} onClose={onCancel} title={t.meals.previewTitle}>
      <div className="flex flex-col gap-3">
        <img
          src={previewUrl}
          alt={t.meals.previewAlt}
          className="h-48 w-full rounded-lg object-cover"
        />
        <p className="text-sm text-muted-foreground">{t.meals.previewHint}</p>
        <Textarea
          aria-label={t.meals.previewFieldLabel}
          value={context}
          placeholder={t.meals.previewPlaceholder}
          onChange={(event) => setContext(event.target.value)}
        />
        <Button size="lg" block disabled={pending} onClick={() => onConfirm(context.trim())}>
          <Sparkles size={16} aria-hidden />
          {pending ? t.meals.analysing : t.meals.previewSubmit}
        </Button>
        <Button variant="outline" block disabled={pending} onClick={onCancel}>
          {t.common.cancel}
        </Button>
      </div>
    </Sheet>
  )
}
