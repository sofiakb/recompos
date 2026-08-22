import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MAX_PROTEIN_TARGET_GRAMS, MIN_PROTEIN_TARGET_GRAMS } from '@/lib/nutrition'
import { t } from '@/i18n/fr'

const STEP = 5

interface ProteinTargetStepperProps {
  value: number
  onChange: (grams: number) => void
}

/**
 * A stepper rather than a slider: it is precise with a thumb, and 5 g is the
 * only granularity that matters against a target derived from body weight.
 */
export function ProteinTargetStepper({ value, onChange }: ProteinTargetStepperProps) {
  const clamp = (next: number) =>
    Math.min(MAX_PROTEIN_TARGET_GRAMS, Math.max(MIN_PROTEIN_TARGET_GRAMS, next))

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        size="icon"
        variant="outline"
        aria-label={`-${STEP} g`}
        disabled={value <= MIN_PROTEIN_TARGET_GRAMS}
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
        disabled={value >= MAX_PROTEIN_TARGET_GRAMS}
        onClick={() => onChange(clamp(value + STEP))}
      >
        <Plus size={20} aria-hidden />
      </Button>
    </div>
  )
}
