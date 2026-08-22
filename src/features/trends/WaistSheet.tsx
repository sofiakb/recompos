import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { MAX_WAIST_CM, MIN_WAIST_CM } from '@/lib/nutrition'
import { t } from '@/i18n/fr'

interface WaistSheetProps {
  open: boolean
  initialCm: number | null
  onClose: () => void
  onSubmit: (waistCm: number) => void
}

export function WaistSheet({ open, initialCm, onClose, onSubmit }: WaistSheetProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (open) setValue(initialCm ? String(initialCm) : '')
  }, [open, initialCm])

  const parsed = Number(value.replace(',', '.'))
  const isValid = Number.isFinite(parsed) && parsed >= MIN_WAIST_CM && parsed <= MAX_WAIST_CM

  return (
    <Sheet open={open} onClose={onClose} title={t.waist.logTitle}>
      <p className="mb-3 text-sm text-muted-foreground">{t.waist.logHint}</p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          autoFocus
          aria-label={t.waist.logTitle}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="88"
          className="tnum min-h-[56px] flex-1 rounded-lg border border-border bg-background px-4 text-2xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <span className="text-lg text-muted-foreground">cm</span>
      </div>
      <Button
        size="lg"
        block
        className="mt-3"
        disabled={!isValid}
        onClick={() => {
          if (isValid) onSubmit(parsed)
        }}
      >
        {t.common.save}
      </Button>
    </Sheet>
  )
}
