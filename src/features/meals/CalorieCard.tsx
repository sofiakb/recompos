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

        {macroTotal > 0 ? (
          <ul className="flex flex-col gap-1.5">
            {MACROS.map((macro, index) => (
              <li key={macro.key} className="flex items-center gap-2">
                <span className="w-20 shrink-0 text-xs text-muted-foreground">{macro.label}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-primary/60"
                    style={{ width: `${(macroKcal[index] / macroTotal) * 100}%` }}
                  />
                </span>
                <span className="tnum w-12 shrink-0 text-right text-xs text-muted-foreground">
                  {macros[macro.key]} g
                </span>
              </li>
            ))}
          </ul>
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
