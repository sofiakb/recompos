import { useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScreenHeader } from '@/components/shared/ScreenHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConsistencyHeatmap } from '@/features/floor/ConsistencyHeatmap'
import { ConsistencyStrip } from '@/features/floor/ConsistencyStrip'
import { useFloor } from '@/features/floor/useFloor'
import { WeightCard } from '@/features/weight/WeightCard'
import { WeightSheet } from '@/features/weight/WeightSheet'
import { useWeight } from '@/features/weight/useWeight'
import { formatLongDate } from '@/lib/date'
import { t } from '@/i18n/fr'

export function TrendsScreen() {
  const { score7, score30, completedDates, installedOn, today } = useFloor()
  const weight = useWeight()
  const [weighInOpen, setWeighInOpen] = useState(false)

  return (
    <>
      <ScreenHeader title={t.nav.trends} />
      <div className="flex flex-col gap-3 px-4">
        <ConsistencyStrip score7={score7} score30={score30} />

        <Card>
          <CardHeader>
            <CardTitle>{t.heatmap.title}</CardTitle>
            <CardDescription>{t.heatmap.hint}</CardDescription>
          </CardHeader>
          <CardContent>
            <ConsistencyHeatmap
              completedDates={completedDates}
              installedOn={installedOn}
              today={today}
            />
          </CardContent>
        </Card>

        <WeightCard weight={weight} onLog={() => setWeighInOpen(true)} />

        {weight.entries.length > 1 ? (
          <Card>
            <CardHeader>
              <CardTitle>{t.weight.history}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col">
                {weight.entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between gap-3 border-b border-border/60 py-2 text-sm last:border-0"
                  >
                    <span className="text-muted-foreground">{formatLongDate(entry.date)}</span>
                    <span className="tnum font-medium">{entry.weightKg} kg</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <EmptyState Icon={TrendingUp} title={t.empty.trends} hint={t.empty.trendsHint} />

      <WeightSheet
        open={weighInOpen}
        initialKg={weight.latest?.weightKg ?? null}
        onClose={() => setWeighInOpen(false)}
        onSubmit={async (kg) => {
          await weight.log(kg)
          setWeighInOpen(false)
        }}
      />
    </>
  )
}
