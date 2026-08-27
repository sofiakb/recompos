import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Segmented } from '@/components/ui/segmented'
import { BodyProfileFields } from '@/features/meals/BodyProfileFields'
import { useCalorieTarget } from '@/features/nutrition/useCalorieTarget'
import { DEFICIT_CHOICES, MAX_CALORIE_TARGET_KCAL, MIN_CALORIE_TARGET_KCAL } from '@/lib/nutrition'
import { t } from '@/i18n/fr'

const STEP = 50

/**
 * Two controls, in the order the number is built: how far under maintenance to
 * sit, then the resulting figure — which the stepper can still override outright,
 * freezing it as the protein target does.
 *
 * The deficit is a control rather than a constant because the first version
 * shipped at maintenance while its own documentation claimed a deficit. A number
 * on screen is a number that can be argued with.
 */
export function CalorieTargetEditor() {
  const target = useCalorieTarget()
  const nudge = (delta: number) => target.setManual(target.targetKcal + delta)

  return (
    <div className="flex flex-col gap-4">
      {/* In the order the number is built: what the body burns, how far under to
          sit, then the figure that comes out — which can still be overridden. */}
      <BodyProfileFields target={target} />

      <Segmented
        label={t.meals.deficitLabel}
        value={String(target.deficitPercent)}
        options={DEFICIT_CHOICES.map((choice) => ({
          value: String(choice),
          label: t.meals.deficitValue(choice),
        }))}
        onChange={(value) => target.setDeficit(Number(value))}
      />
      <p className="text-xs text-muted-foreground">{t.meals.deficitHint}</p>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="secondary"
          aria-label={t.meals.calorieStep(-STEP)}
          disabled={target.targetKcal <= MIN_CALORIE_TARGET_KCAL}
          onClick={() => nudge(-STEP)}
        >
          <Minus size={20} aria-hidden />
        </Button>
        <p className="tnum text-center">
          <span className="text-3xl font-semibold">{target.targetKcal}</span>
          <span className="ml-1 text-sm text-muted-foreground">kcal</span>
        </p>
        <Button
          variant="secondary"
          aria-label={t.meals.calorieStep(STEP)}
          disabled={target.targetKcal >= MAX_CALORIE_TARGET_KCAL}
          onClick={() => nudge(STEP)}
        >
          <Plus size={20} aria-hidden />
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {target.mode === 'manual'
          ? t.meals.targetManual
          : target.isFallback
            ? t.meals.targetProvisional
            : t.meals.targetFromWeight(target.maintenanceKcal ?? 0, target.deficitPercent)}
      </p>

      {target.mode === 'manual' ? (
        <div className="flex flex-col items-center gap-1">
          {target.computedKcal !== null ? (
            <p className="tnum text-xs text-muted-foreground">
              {t.meals.calorieAutoValue(target.computedKcal)}
            </p>
          ) : null}
          <Button variant="ghost" onClick={target.useAuto} className="text-primary">
            {t.meals.calorieBackToAuto}
          </Button>
        </div>
      ) : null}

      <p className="text-center text-xs text-muted-foreground">{t.meals.targetHint}</p>
    </div>
  )
}
