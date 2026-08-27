import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCalorieTarget } from '@/features/nutrition/useCalorieTarget'
import { MAX_CALORIE_TARGET_KCAL, MIN_CALORIE_TARGET_KCAL } from '@/lib/nutrition'
import { t } from '@/i18n/fr'

const STEP = 50

/**
 * Same contract as the protein target: touching it freezes it.
 *
 * The hint under the stepper is the important part. A coefficient times a weight
 * is a starting point, not a prescription — the number worth keeping is the one
 * adjusted against three weeks of weight trend.
 */
export function CalorieTargetEditor() {
  const target = useCalorieTarget()
  const nudge = (delta: number) => target.setManual(target.targetKcal + delta)

  return (
    <div className="flex flex-col gap-3">
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
            : t.meals.targetFromWeight(target.smoothedWeightKg ?? 0, target.kcalPerKg)}
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
