import { useState } from 'react'
import { ChevronDown, Flame } from 'lucide-react'
import { Ring } from '@/components/charts/Ring'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { formatCount } from '@/lib/format'
import { t } from '@/i18n/fr'

export interface DayFigures {
  kcal: number
  proteinG: number
  carbsG: number
  fatG: number
}

interface DayTotalsProps {
  dateLabel: string
  /** Rolling 7-day consistency, or null on a day that is not today. */
  consistencyPercent: number | null
  totals: DayFigures
  /** A macro target of 0 means « no denominator », not « a target of zero ». */
  targets: DayFigures
  /** The two sentences behind the numbers, shown once the detail is open. */
  explain: { kcal: string; protein: string }
}

const MACROS = ['proteinG', 'carbsG', 'fatG'] as const
type MacroKey = (typeof MACROS)[number]

/** Only protein carries the accent: the app has an opinion about one macro. */
function accentFor(macro: MacroKey): 'primary' | 'muted' {
  return macro === 'proteinG' ? 'primary' : 'muted'
}

function ratio(current: number, target: number): number {
  return target === 0 ? 0 : current / target
}

function Figure({
  value,
  label,
  accent,
}: Readonly<{ value: string; label: string; accent?: boolean }>) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <p className={cn('tnum text-[22px] font-semibold leading-none', accent && 'text-primary')}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

/**
 * The day in figures: what is left, what went in, and the macros behind it.
 *
 * Calories take the big ring and protein moves to a side figure — but protein
 * keeps the accent colour, because it is still the number this app is about.
 * The macros open into three rings rather than living there permanently: the
 * split is read once a day, the remaining calories are read every time the tab
 * is opened.
 */
export function DayTotals({
  dateLabel,
  consistencyPercent,
  totals,
  targets,
  explain,
}: Readonly<DayTotalsProps>) {
  const [expanded, setExpanded] = useState(false)

  const over = totals.kcal > targets.kcal
  // Over target is information, not a failure: the ring stops filling and the
  // centre says which side of the line the day is on.
  const centre = over ? totals.kcal - targets.kcal : targets.kcal - totals.kcal

  // Sticky rather than a pane in a fixed-height column: the app scrolls as one
  // page everywhere else, and the figures holding still while the journal moves
  // is the whole point of the band.
  return (
    <div className="sticky top-0 z-10 border-b border-border bg-card px-5 pb-1 pt-[calc(0.875rem+env(safe-area-inset-top))]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          {dateLabel}
        </p>
        {consistencyPercent !== null ? (
          <span
            className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[13px] font-semibold"
            title={t.today.consistencySummary(consistencyPercent)}
          >
            <Flame size={14} className="text-primary" aria-hidden />
            {t.nutrition.consistencyPill(consistencyPercent)}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 pb-0.5 pt-1.5">
        <Figure value={formatCount(totals.kcal)} label={t.nutrition.consumed} />
        <Ring
          size={150}
          stroke={11}
          ratio={ratio(totals.kcal, targets.kcal)}
          ariaLabel={t.nutrition.kcalRing(totals.kcal, targets.kcal)}
        >
          <p className="tnum text-[34px] font-semibold leading-none tracking-[-0.02em]">
            {formatCount(centre)}
          </p>
          <p className="mt-0.5 text-[13px] font-medium text-muted-foreground">
            {t.nutrition.kcalUnit}
          </p>
          <p className="text-xs text-muted-foreground">
            {over ? t.nutrition.overCaption : t.nutrition.remainingCaption}
          </p>
        </Ring>
        <Figure value={`${totals.proteinG}`} label={t.nutrition.proteinTitle} accent />
      </div>

      {expanded ? (
        <div className="mt-2.5 rounded-lg border border-border bg-background p-4">
          <div className="grid grid-cols-3 gap-2">
            {MACROS.map((macro) => (
              <div key={macro} className="flex flex-col items-center gap-1.5">
                <Ring
                  size={74}
                  stroke={7}
                  ratio={ratio(totals[macro], targets[macro])}
                  accent={accentFor(macro)}
                  ariaLabel={`${t.nutrition.macroLabel[macro]} ${t.nutrition.macroOf(totals[macro], targets[macro])}`}
                >
                  <p className="tnum text-[17px] font-semibold leading-none">{totals[macro]}</p>
                  {targets[macro] > 0 ? (
                    <p className="tnum text-[11px] text-muted-foreground">/ {targets[macro]} g</p>
                  ) : null}
                </Ring>
                <p className="text-xs text-muted-foreground">{t.nutrition.macroLabel[macro]}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3">
            <p className="text-[13px] text-muted-foreground">{explain.kcal}</p>
            <p className="text-[13px] text-muted-foreground">{explain.protein}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 pt-2">
          {MACROS.map((macro) => (
            <div key={macro} className="flex flex-col gap-1">
              <Progress
                className="h-1"
                accent={accentFor(macro)}
                value={totals[macro]}
                max={targets[macro] || 1}
                label={`${t.nutrition.macroLabel[macro]} ${t.nutrition.macroOf(totals[macro], targets[macro])}`}
              />
              <p className="text-center text-xs text-muted-foreground">
                {t.nutrition.macroLabel[macro]}
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        className="flex min-h-9 w-full items-center justify-center gap-1 text-xs text-muted-foreground"
      >
        {expanded ? t.nutrition.macrosHide : t.nutrition.macrosDetail}
        <ChevronDown
          size={16}
          aria-hidden
          className={cn('transition-transform duration-200', expanded && 'rotate-180')}
        />
      </button>
    </div>
  )
}
