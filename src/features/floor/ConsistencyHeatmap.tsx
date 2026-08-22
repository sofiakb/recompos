import { useMemo } from 'react'
import { buildHeatmap, monthLabels, type HeatmapState } from '@/lib/heatmap'
import { formatLongDate, type IsoDate } from '@/lib/date'
import { cn } from '@/lib/utils'
import { t } from '@/i18n/fr'

interface ConsistencyHeatmapProps {
  completedDates: Iterable<IsoDate>
  installedOn: IsoDate
  today: IsoDate
  className?: string
}

const CELL_STYLE: Record<HeatmapState, string> = {
  done: 'bg-primary',
  missed: 'bg-muted',
  // Days the app could not have been used are drawn as absent, not as misses.
  preInstall: 'bg-transparent ring-1 ring-inset ring-border/50',
  future: 'bg-transparent ring-1 ring-inset ring-border/50',
}

/**
 * 12 weeks of the floor, one column per week (PRD §6.5).
 *
 * Plain flex boxes rather than a charting dependency: it is 84 squares, and the
 * shell budget is better spent elsewhere.
 */
export function ConsistencyHeatmap({
  completedDates,
  installedOn,
  today,
  className,
}: ConsistencyHeatmapProps) {
  const grid = useMemo(
    () => buildHeatmap(completedDates, installedOn, today),
    [completedDates, installedOn, today],
  )
  const labels = useMemo(() => monthLabels(grid), [grid])

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {grid.map((week, index) => (
          <div key={week[0].date} className="flex flex-col gap-1">
            <span className="h-3 text-[10px] leading-3 text-muted-foreground">
              {labels[index] ?? ''}
            </span>
            {week.map((cell) => (
              <span
                key={cell.date}
                // A tooltip on 84 cells would be noise; the accessible name
                // carries the same information for anyone who needs it.
                title={
                  cell.state === 'done' || cell.state === 'missed'
                    ? t.heatmap.cell(formatLongDate(cell.date), cell.state === 'done')
                    : undefined
                }
                className={cn('h-3 w-3 rounded-[3px]', CELL_STYLE[cell.state])}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <span>{t.heatmap.legendLess}</span>
        <span className="h-3 w-3 rounded-[3px] bg-muted" aria-hidden />
        <span className="h-3 w-3 rounded-[3px] bg-primary" aria-hidden />
        <span>{t.heatmap.legendMore}</span>
      </div>
    </div>
  )
}
