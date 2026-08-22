import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart } from '@/components/charts/LineChart'
import { Segmented } from '@/components/ui/segmented'
import { STRENGTH_WINDOWS, useStrength, type StrengthWindow } from '@/features/trends/useStrength'
import { parseIsoDate } from '@/lib/date'
import { t } from '@/i18n/fr'
import type { Exercise } from '@/types/models'

interface StrengthCardProps {
  exerciseById: (id: string) => Exercise | undefined
}

const WINDOW_OPTIONS = STRENGTH_WINDOWS.map((weeks) => ({
  value: String(weeks) as `${StrengthWindow}`,
  label: t.strength.weeks(weeks),
}))

function shortDate(date: string): string {
  return parseIsoDate(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function StrengthCard({ exerciseById }: StrengthCardProps) {
  const [weeks, setWeeks] = useState<StrengthWindow>(12)
  const strength = useStrength(weeks)

  const lastWeek = strength.points[strength.points.length - 1]
  // One week of sets is a number, not a line: say so rather than leaving a blank
  // where a chart is expected.
  const chartable = strength.points.filter((point) => point.volume > 0).length > 1

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.strength.title}</CardTitle>
        <CardDescription>{t.strength.hint}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Segmented
          label={t.strength.title}
          value={String(weeks) as `${StrengthWindow}`}
          options={WINDOW_OPTIONS}
          onChange={(value) => setWeeks(Number(value) as StrengthWindow)}
        />

        {strength.hasData ? (
          <>
            <div className="flex items-baseline justify-between">
              <span className="tnum text-3xl font-semibold">{lastWeek?.index ?? 0}</span>
              <span className="text-sm text-muted-foreground">
                {t.strength.setsThisWeek(lastWeek?.setCount ?? 0)}
              </span>
            </div>
            {chartable ? (
              <LineChart
                ariaLabel={t.strength.title}
                points={strength.points.map((point) => ({
                  label: shortDate(point.weekStart),
                  // Weeks with no sets are a gap in the line, not a drop to zero:
                  // the index measures the weeks that happened.
                  value: point.volume > 0 ? point.index : null,
                }))}
              />
            ) : (
              <p className="text-sm text-muted-foreground">{t.strength.needMoreWeeks}</p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{t.strength.empty}</p>
        )}

        <div>
          <h3 className="mb-1 text-sm font-semibold">{t.strength.bestSets}</h3>
          {strength.best.size === 0 ? (
            <p className="text-sm text-muted-foreground">{t.strength.noBest}</p>
          ) : (
            <ul className="flex flex-col">
              {[...strength.best.values()]
                .sort((a, b) => b.reps - a.reps)
                .map((set) => (
                  <li
                    key={set.id}
                    className="flex items-center justify-between gap-3 border-b border-border/60 py-1.5 text-sm last:border-0"
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {exerciseById(set.exerciseId)?.name ?? set.exerciseId}
                    </span>
                    <span className="tnum text-muted-foreground">
                      {t.workouts.setSummary(set.reps, set.loadOrResistance)}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
