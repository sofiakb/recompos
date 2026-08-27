import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCalorieTarget } from '@/features/nutrition/useCalorieTarget'
import { cn } from '@/lib/utils'
import { t } from '@/i18n/fr'
import type { DayMacros } from '@/db/repositories/mealRepository'

interface CalorieCardProps {
  macros: DayMacros
}

const MACROS = [
  { key: 'proteinG', label: 'Protéines', kcalPerG: 4 },
  { key: 'carbsG', label: 'Glucides', kcalPerG: 4 },
  { key: 'fatG', label: 'Lipides', kcalPerG: 9 },
] as const

/**
 * The day's calories against the target.
 *
 * A bar rather than a ring: the protein counter already owns the ring, and two
 * rings on one screen would read as two competing goals rather than one target
 * and its breakdown.
 */
export function CalorieCard({ macros }: CalorieCardProps) {
  const target = useCalorieTarget()
  const over = macros.kcal > target.targetKcal
  const percent =
    target.targetKcal === 0 ? 0 : Math.min(100, (macros.kcal / target.targetKcal) * 100)
  const macroKcal = MACROS.map((macro) => macros[macro.key] * macro.kcalPerG)
  const macroTotal = macroKcal.reduce((total, value) => total + value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.meals.dayTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-2">
          <p className="tnum">
            <span className="text-3xl font-semibold">{macros.kcal}</span>
            <span className="ml-1 text-sm text-muted-foreground">/ {target.targetKcal} kcal</span>
          </p>
          <p className="tnum text-sm text-muted-foreground">
            {over
              ? t.meals.dayOver(macros.kcal - target.targetKcal)
              : t.meals.dayRemaining(target.targetKcal - macros.kcal)}
          </p>
        </div>

        <div
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={macros.kcal}
          aria-valuemin={0}
          aria-valuemax={target.targetKcal}
          aria-label={t.meals.dayOf(macros.kcal, target.targetKcal)}
        >
          <div
            className={cn('h-full rounded-full', over ? 'bg-muted-foreground' : 'bg-primary')}
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* One line rather than three stacked bars. The split between macros is
            a detail you read once a day; the bars gave it the same weight as
            the calorie total itself. */}
        {macroTotal > 0 ? (
          <p className="tnum text-[13px] text-muted-foreground">
            {t.meals.macrosShort(macros.proteinG, macros.carbsG, macros.fatG)}
          </p>
        ) : null}

        <p className="text-xs text-muted-foreground">
          {target.mode === 'manual'
            ? t.meals.targetManual
            : target.isFallback
              ? t.meals.targetProvisional
              : t.meals.targetFromWeight(target.maintenanceKcal ?? 0, target.deficitPercent)}
        </p>
      </CardContent>
    </Card>
  )
}
