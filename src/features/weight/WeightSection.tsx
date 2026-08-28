import { useState } from 'react'
import { Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LineChart, type SecondaryAxis } from '@/components/charts/LineChart'
import { TrendSection } from '@/features/trends/TrendSection'
import { BmiCard } from '@/features/weight/BmiCard'
import { WeightSheet } from '@/features/weight/WeightSheet'
import { useWeight } from '@/features/weight/useWeight'
import { useSettingsStore } from '@/stores/settingsStore'
import { useUiStore } from '@/stores/uiStore'
import { bmi } from '@/lib/bmi'
import { formatShortDate } from '@/lib/date'
import { formatDecimal, formatSignedDelta } from '@/lib/format'
import { t } from '@/i18n/fr'

/**
 * One sentence under the section, never two.
 *
 * The BMI legend explains the same chart the smoothing note explains, so when
 * the second axis is drawn it takes the slot rather than stacking below it.
 */
function hintFor(hasWeight: boolean, showsBmi: boolean): string {
  if (!hasWeight) return t.weight.emptyHint
  if (showsBmi) return t.trends.weightBmiHint
  return t.weight.smoothedHint
}

/**
 * The weight section of Progression: the smoothed figure, its BMI, the curve.
 *
 * Lifted out of the screen when the BMI arrived. Progression is a list of
 * sections, and the one that carries a chart, a card, a sheet and its own
 * open/closed state has outgrown being inlined among five others.
 */
export function WeightSection() {
  const weight = useWeight()
  const heightCm = useSettingsStore((state) => state.settings.heightCm) ?? null
  const showToast = useUiStore((state) => state.showToast)
  const [weighInOpen, setWeighInOpen] = useState(false)

  // Oldest first for the chart; the hook hands back newest first.
  const series = [...weight.entries].reverse()

  // One curve, two graduations: at a constant height the BMI is the weight over
  // a constant, so a second polyline would lie exactly on the first.
  const bmiAxis: SecondaryAxis | undefined =
    heightCm === null
      ? undefined
      : { label: t.trends.bmi, convert: (kg: number) => bmi(kg, heightCm) }
  const showsBmiChart = series.length > 1 && bmiAxis !== undefined
  // No delta rather than « +0,0 kg »: a trend that has not moved is not news.
  const delta =
    weight.trendKg !== null && weight.trendKg !== 0 ? formatSignedDelta(weight.trendKg, 'kg') : null

  return (
    <>
      <TrendSection
        title={t.weight.title}
        hint={hintFor(weight.hasWeight, showsBmiChart)}
        aside={delta}
      >
        {weight.hasWeight && weight.smoothedKg !== null ? (
          <>
            <p className="tnum text-3xl font-semibold">
              {formatDecimal(weight.smoothedKg)}
              <span className="ml-1 text-sm font-normal text-muted-foreground">kg</span>
            </p>
            <BmiCard smoothedKg={weight.smoothedKg} heightCm={heightCm} />
          </>
        ) : null}
        {series.length > 1 ? (
          <LineChart
            ariaLabel={showsBmiChart ? t.trends.weightBmiChart : t.weight.title}
            unit="kg"
            secondaryAxis={bmiAxis}
            points={series.map((entry) => ({
              label: formatShortDate(entry.date),
              value: entry.weightKg ?? null,
            }))}
          />
        ) : null}
        <Button
          variant={weight.hasWeight ? 'outline' : 'primary'}
          block
          onClick={() => setWeighInOpen(true)}
        >
          <Scale size={18} aria-hidden />
          {t.weight.logCta}
        </Button>
      </TrendSection>

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
    </>
  )
}
