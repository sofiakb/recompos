import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { t } from '@/i18n/fr'

interface ConsentSheetProps {
  open: boolean
  onAccept: () => void
  onClose: () => void
}

/** Asked once, before anything leaves the device (spec coach §6.3). */
export function ConsentSheet({ open, onAccept, onClose }: Readonly<ConsentSheetProps>) {
  return (
    <Sheet open={open} onClose={onClose} title={t.coach.consentTitle}>
      <div className="flex flex-col gap-4">
        <p className="text-[15px] leading-relaxed">{t.coach.consentBody}</p>
        <Button size="lg" block onClick={onAccept}>
          {t.coach.consentAccept}
        </Button>
        <Button size="lg" variant="ghost" block onClick={onClose}>
          {t.coach.consentLater}
        </Button>
      </div>
    </Sheet>
  )
}
