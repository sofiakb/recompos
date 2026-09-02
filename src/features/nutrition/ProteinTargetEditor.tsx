import { Button } from '@/components/ui/button'
import { ProteinTargetStepper } from '@/features/nutrition/ProteinTargetStepper'
import { t } from '@/i18n/fr'
import type { ProteinTargetState } from '@/features/nutrition/useProteinTarget'

interface ProteinTargetEditorProps {
  target: ProteinTargetState
}

/**
 * Shows where the target comes from, and lets it be overridden.
 *
 * Touching the stepper switches to manual and freezes the number — the app never
 * moves a figure the user set. Going back to auto is one explicit tap.
 */
export function ProteinTargetEditor({ target }: ProteinTargetEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      <ProteinTargetStepper value={target.targetGrams} onChange={target.setManual} />

      <p className="text-center text-xs text-muted-foreground">
        {target.mode === 'auto' && target.weightKg !== null
          ? t.nutrition.targetFromWeight(target.weightKg, target.gramsPerKg)
          : null}
        {target.isFallback ? t.nutrition.targetNoWeight : null}
        {target.mode === 'manual' ? t.settings.proteinManual : null}
      </p>

      {target.mode === 'manual' ? (
        <div className="flex flex-col items-center gap-1">
          {target.computedGrams !== null ? (
            <p className="tnum text-xs text-muted-foreground">
              {t.settings.proteinAutoValue(target.computedGrams)}
            </p>
          ) : null}
          <Button variant="ghost" onClick={target.useAuto} className="text-primary">
            {t.settings.proteinBackToAuto}
          </Button>
        </div>
      ) : (
        <p className="text-center text-xs text-muted-foreground">{t.settings.proteinEditHint}</p>
      )}
    </div>
  )
}
