import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LineChart } from '@/components/charts/LineChart'
import { ScreenHeader } from '@/components/shared/ScreenHeader'
import { ConsistencyHeatmap } from '@/features/floor/ConsistencyHeatmap'
import { useFloor } from '@/features/floor/useFloor'
import { StrengthCard } from '@/features/trends/StrengthCard'
import { TrendSection } from '@/features/trends/TrendSection'
import { WaistSheet } from '@/features/trends/WaistSheet'
import { useWaist } from '@/features/trends/useWaist'
import { WeightSection } from '@/features/weight/WeightSection'
import { useWorkouts } from '@/features/workouts/useWorkouts'
import { useUiStore } from '@/stores/uiStore'
import { formatCalendarDate, formatLongDate, formatShortDate } from '@/lib/date'
import { formatDecimal, formatSignedDelta } from '@/lib/format'
import { t } from '@/i18n/fr'

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
  const waist = useWaist()
  const showToast = useUiStore((state) => state.showToast)
  const [waistOpen, setWaistOpen] = useState(false)

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

        <WeightSection />

        <StrengthCard exerciseById={exerciseById} />

        <TrendSection
          title={t.waist.title}
          hint={t.waist.hint}
          aside={waist.totalChangeCm !== null ? formatSignedDelta(waist.totalChangeCm, 'cm') : null}
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
                    label: formatShortDate(waist.seriesDates[index]),
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
