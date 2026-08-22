import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart } from '@/components/charts/LineChart'
import { ScreenHeader } from '@/components/shared/ScreenHeader'
import { ConsistencyHeatmap } from '@/features/floor/ConsistencyHeatmap'
import { ConsistencyStrip } from '@/features/floor/ConsistencyStrip'
import { useFloor } from '@/features/floor/useFloor'
import { PhotoVault } from '@/features/trends/PhotoVault'
import { StrengthCard } from '@/features/trends/StrengthCard'
import { WaistCard } from '@/features/trends/WaistCard'
import { WaistSheet } from '@/features/trends/WaistSheet'
import { useWaist } from '@/features/trends/useWaist'
import { WeightCard } from '@/features/weight/WeightCard'
import { WeightSheet } from '@/features/weight/WeightSheet'
import { useWeight } from '@/features/weight/useWeight'
import { useWorkouts } from '@/features/workouts/useWorkouts'
import { useUiStore } from '@/stores/uiStore'
import { parseIsoDate } from '@/lib/date'
import { t } from '@/i18n/fr'

function shortDate(date: string): string {
  return parseIsoDate(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function TrendsScreen() {
  const { score7, score30, completedDates, installedOn, today } = useFloor()
  const { exerciseById } = useWorkouts()
  const weight = useWeight()
  const waist = useWaist()
  const showToast = useUiStore((state) => state.showToast)
  const [weighInOpen, setWeighInOpen] = useState(false)
  const [waistOpen, setWaistOpen] = useState(false)

  // Oldest first for the chart; the hook hands back newest first.
  const weightSeries = [...weight.entries].reverse()

  return (
    <>
      <ScreenHeader title={t.nav.trends} />
      <div className="flex flex-col gap-3 px-4 pb-2">
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

        <StrengthCard exerciseById={exerciseById} />

        <WeightCard weight={weight} onLog={() => setWeighInOpen(true)} />

        {weightSeries.length > 1 ? (
          <Card>
            <CardHeader>
              <CardTitle>{t.weight.history}</CardTitle>
              <CardDescription>{t.weight.smoothedHint}</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                ariaLabel={t.weight.title}
                points={weightSeries.map((entry) => ({
                  label: shortDate(entry.date),
                  value: entry.weightKg ?? null,
                }))}
                formatValue={(value) => `${Math.round(value)}`}
              />
            </CardContent>
          </Card>
        ) : null}

        <WaistCard waist={waist} onLog={() => setWaistOpen(true)} />

        <PhotoVault />
      </div>

      <WeightSheet
        open={weighInOpen}
        initialKg={weight.latest?.weightKg ?? null}
        onClose={() => setWeighInOpen(false)}
        onSubmit={async (kg) => {
          await weight.log(kg)
          setWeighInOpen(false)
          showToast(t.weight.saved(kg))
        }}
      />
      <WaistSheet
        open={waistOpen}
        initialCm={waist.latest?.waistCm ?? null}
        onClose={() => setWaistOpen(false)}
        onSubmit={async (cm) => {
          await waist.log(cm)
          setWaistOpen(false)
          showToast(t.waist.saved(cm))
        }}
      />
    </>
  )
}
