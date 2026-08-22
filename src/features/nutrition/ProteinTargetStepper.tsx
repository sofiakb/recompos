import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { t } from '@/i18n/fr'

export const MIN_PROTEIN_TARGET = 80
export const MAX_PROTEIN_TARGET = 250
const STEP = 10

interface ProteinTargetStepperProps {
  value: number
  onChange: (grams: number) => void
}

/**
 * A stepper rather than a slider: it is precise with a thumb, and 10 g is the
 * only granularity that matters here.
 */
export function ProteinTargetStepper({ value, onChange }: ProteinTargetStepperProps) {
  const clamp = (next: number) => Math.min(MAX_PROTEIN_TARGET, Math.max(MIN_PROTEIN_TARGET, next))

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        size="icon"
        variant="outline"
        aria-label={`-${STEP} g`}
        disabled={value <= MIN_PROTEIN_TARGET}
        onClick={() => onChange(clamp(value - STEP))}
      >
        <Minus size={20} aria-hidden />
      </Button>
      <p className="tnum text-center">
        <span className="text-3xl font-semibold">{value}</span>
        <span className="ml-1 text-sm text-muted-foreground">{t.onboarding.protein.unit}</span>
      </p>
      <Button
        size="icon"
        variant="outline"
        aria-label={`+${STEP} g`}
        disabled={value >= MAX_PROTEIN_TARGET}
        onClick={() => onChange(clamp(value + STEP))}
      >
        <Plus size={20} aria-hidden />
      </Button>
    </div>
  )
}
