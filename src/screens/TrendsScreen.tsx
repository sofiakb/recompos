import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Ruler, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LineChart, type SecondaryAxis } from '@/components/charts/LineChart'
import { ScreenHeader } from '@/components/shared/ScreenHeader'
import { ConsistencyHeatmap } from '@/features/floor/ConsistencyHeatmap'
import { useFloor } from '@/features/floor/useFloor'
import { StrengthCard } from '@/features/trends/StrengthCard'
import { TrendSection } from '@/features/trends/TrendSection'
import { WaistSheet } from '@/features/trends/WaistSheet'
import { useWaist } from '@/features/trends/useWaist'
import { BmiCard } from '@/features/weight/BmiCard'
import { WeightSheet } from '@/features/weight/WeightSheet'
import { useWeight } from '@/features/weight/useWeight'
import { useWorkouts } from '@/features/workouts/useWorkouts'
import { useSettingsStore } from '@/stores/settingsStore'
import { useUiStore } from '@/stores/uiStore'
import { bmi } from '@/lib/bmi'
import { formatCalendarDate, formatLongDate, parseIsoDate } from '@/lib/date'
import { formatDecimal } from '@/lib/format'
import { t } from '@/i18n/fr'

function shortDate(date: string): string {
  return parseIsoDate(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function signed(value: number, unit: string): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${formatDecimal(Math.abs(value))} ${unit}`
}

/**
 * One sentence under the weight section, never two.
 *
 * The BMI legend explains the same chart the smoothing note explains, so when
 * the second axis is drawn it takes the slot rather than stacking below it.
 */
function weightHint(hasWeight: boolean, showsBmi: boolean): string {
  if (!hasWeight) return t.weight.emptyHint
  if (showsBmi) return t.trends.weightBmiHint
  return t.weight.smoothedHint
}

/**
 * The long view, one measure per section: consistency, weight, strength, waist,
 * past sessions, photos.
 *
 * Everything that is a trend lives here and only here — Today and Séances link
 * in rather than showing their own copy (décision n°18).
 */
export function TrendsScreen() {
  const { score7, score30, completedDates, installedOn, today } = useFloor()
  const { exerciseById, history } = useWorkouts()
  const weight = useWeight()
  const waist = useWaist()
  const heightCm = useSettingsStore((state) => state.settings.heightCm) ?? null
  const showToast = useUiStore((state) => state.showToast)
  const [weighInOpen, setWeighInOpen] = useState(false)
  const [waistOpen, setWaistOpen] = useState(false)

  // Oldest first for the chart; the hook hands back newest first. The waist
  // hook already exposes its own oldest-first series and rolling mean.
  const weightSeries = [...weight.entries].reverse()

  // One curve, two graduations: at a constant height the BMI is the weight over
  // a constant, so a second polyline would lie exactly on the first.
  const bmiAxis: SecondaryAxis | undefined =
    heightCm === null
      ? undefined
      : { label: t.trends.bmi, convert: (kg: number) => bmi(kg, heightCm) }
  const showsBmiChart = weightSeries.length > 1 && bmiAxis !== undefined

  return (
    <>
      <ScreenHeader
        eyebrow={t.trends.since(formatCalendarDate(installedOn))}
        title={t.nav.trends}
      />

      <div className="flex flex-col gap-8 px-5 pt-2">
        <TrendSection
          title={t.today.consistencyTitle}
          hint={t.consistency.explain}
          aside={t.consistency.over30(score30.percent)}
        >
          <p className="flex items-baseline gap-2">
            <span className="tnum text-[44px] font-semibold leading-none">{score7.percent} %</span>
            <span className="text-[13px] text-muted-foreground">
              {t.consistency.summary(t.consistency.band[score7.band])}
            </span>
          </p>
          <ConsistencyHeatmap
            completedDates={completedDates}
            installedOn={installedOn}
            today={today}
          />
        </TrendSection>

        <TrendSection
          title={t.weight.title}
          hint={weightHint(weight.hasWeight, showsBmiChart)}
          aside={
            weight.trendKg !== null && weight.trendKg !== 0 ? signed(weight.trendKg, 'kg') : null
          }
        >
          {weight.hasWeight ? (
            <>
              {weight.smoothedKg !== null ? (
                <>
                  <p className="tnum text-3xl font-semibold">
                    {formatDecimal(weight.smoothedKg)}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">kg</span>
                  </p>
                  <BmiCard smoothedKg={weight.smoothedKg} heightCm={heightCm} />
                </>
              ) : null}
              {weightSeries.length > 1 ? (
                <LineChart
                  ariaLabel={showsBmiChart ? t.trends.weightBmiChart : t.weight.title}
                  unit="kg"
                  secondaryAxis={bmiAxis}
                  points={weightSeries.map((entry) => ({
                    label: shortDate(entry.date),
                    value: entry.weightKg ?? null,
                  }))}
                />
              ) : null}
            </>
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

        <StrengthCard exerciseById={exerciseById} />

        <TrendSection
          title={t.waist.title}
          hint={t.waist.hint}
          aside={waist.totalChangeCm !== null ? signed(waist.totalChangeCm, 'cm') : null}
        >
          {waist.latest?.waistCm !== undefined && waist.latest !== null ? (
            <>
              <p className="tnum text-3xl font-semibold">
                {formatDecimal(waist.latest.waistCm)}
                <span className="ml-1 text-sm font-normal text-muted-foreground">cm</span>
              </p>
              {waist.seriesCm.length > 1 ? (
                <LineChart
                  ariaLabel={t.waist.title}
                  points={waist.seriesCm.map((value, index) => ({
                    label: shortDate(waist.seriesDates[index]),
                    value,
                  }))}
                  overlay={waist.smoothedCm}
                />
              ) : null}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{t.waist.empty}</p>
          )}
          <Button variant="outline" block onClick={() => setWaistOpen(true)}>
            <Ruler size={18} aria-hidden />
            {t.waist.logCta}
          </Button>
        </TrendSection>

        <TrendSection title={t.trends.pastSessions}>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.workouts.noHistory}</p>
          ) : (
            <ul className="flex flex-col">
              {history.slice(0, 3).map((session) => (
                <li
                  key={session.id}
                  className="flex items-center gap-3 border-b border-border py-2 text-sm last:border-0"
                >
                  <span className="min-w-0 flex-1 truncate text-muted-foreground">
                    {formatLongDate(session.date)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t.workouts.sessionType[session.type]}
                  </span>
                  <span className="tnum font-medium">{session.durationMinutes ?? 0} min</span>
                </li>
              ))}
            </ul>
          )}
        </TrendSection>

        <Link
          to="/trends/photos"
          className="flex min-h-touch items-center gap-3 border-b border-border py-2 transition-colors hover:bg-accent"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[15px]">{t.photos.title}</span>
            <span className="block text-xs text-muted-foreground">{t.trends.photoVaultHint}</span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-muted-foreground" aria-hidden />
        </Link>
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
