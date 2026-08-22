import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { MAX_WEIGHT_KG, MIN_WEIGHT_KG } from '@/lib/nutrition'
import { t } from '@/i18n/fr'

interface WeightSheetProps {
  open: boolean
  initialKg: number | null
  onClose: () => void
  onSubmit: (weightKg: number) => void
}

export function WeightSheet({ open, initialKg, onClose, onSubmit }: WeightSheetProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (open) setValue(initialKg ? String(initialKg) : '')
  }, [open, initialKg])

  const parsed = Number(value.replace(',', '.'))
  const isValid = Number.isFinite(parsed) && parsed >= MIN_WEIGHT_KG && parsed <= MAX_WEIGHT_KG

  return (
    <Sheet open={open} onClose={onClose} title={t.weight.logTitle}>
      <p className="mb-3 text-sm text-muted-foreground">{t.weight.logHint}</p>
      <div className="flex items-center gap-2">
        <input
          // decimal keypad rather than a full keyboard: this is a number entry.
          type="text"
          inputMode="decimal"
          autoFocus
          aria-label={t.weight.logTitle}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="80,5"
          className="tnum min-h-[56px] flex-1 rounded-lg border border-border bg-background px-4 text-2xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <span className="text-lg text-muted-foreground">kg</span>
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
