/**
 * 12-week consistency matrix (PRD §6.5).
 *
 * A pure grid builder so the rendering component stays a `map` over cells, and
 * so the awkward parts — week alignment, days before the install, days that have
 * not happened yet — are testable without a DOM.
 */
import { formatIsoDate, parseIsoDate, toLogicalDate, type IsoDate } from '@/lib/date'

export const HEATMAP_WEEKS = 12
export const DAYS_PER_WEEK = 7

/**
 * `preInstall` and `future` are deliberately distinct from `missed`: neither is
 * a day the user could have completed, and colouring them as misses would
 * invent a failure the app never observed.
 */
export type HeatmapState = 'done' | 'missed' | 'preInstall' | 'future'

export interface HeatmapCell {
  date: IsoDate
  state: HeatmapState
}

/** Monday of the week a date falls in. Weeks start Monday in fr-FR. */
export function startOfWeek(date: IsoDate): IsoDate {
  const d = parseIsoDate(date)
  const offset = (d.getDay() + 6) % 7 // Sunday is 0 in JS, and last here
  d.setDate(d.getDate() - offset)
  return formatIsoDate(d)
}

/**
 * Weeks oldest first, each holding 7 cells from Monday to Sunday.
 *
 * @param completedDates date keys where the floor was completed
 */
export function buildHeatmap(
  completedDates: Iterable<IsoDate>,
  installedOn: IsoDate,
  today: IsoDate = toLogicalDate(),
  weeks = HEATMAP_WEEKS,
): HeatmapCell[][] {
  const completed = completedDates instanceof Set ? completedDates : new Set(completedDates)
  const firstMonday = parseIsoDate(startOfWeek(today))
  firstMonday.setDate(firstMonday.getDate() - (weeks - 1) * DAYS_PER_WEEK)

  const grid: HeatmapCell[][] = []
  for (let week = 0; week < weeks; week++) {
    const column: HeatmapCell[] = []
    for (let day = 0; day < DAYS_PER_WEEK; day++) {
      const cursor = new Date(firstMonday.getTime())
      cursor.setDate(cursor.getDate() + week * DAYS_PER_WEEK + day)
      const date = formatIsoDate(cursor)
      column.push({ date, state: stateFor(date, completed, installedOn, today) })
    }
    grid.push(column)
  }
  return grid
}

function stateFor(
  date: IsoDate,
  completed: Set<IsoDate>,
  installedOn: IsoDate,
  today: IsoDate,
): HeatmapState {
  if (date > today) return 'future'
  if (date < installedOn) return 'preInstall'
  return completed.has(date) ? 'done' : 'missed'
}

/** Month labels aligned to the grid columns, one per month change. */
export function monthLabels(grid: HeatmapCell[][], locale = 'fr-FR'): Array<string | null> {
  let previous = ''
  return grid.map((week) => {
    const month = parseIsoDate(week[0].date).toLocaleDateString(locale, { month: 'short' })
    if (month === previous) return null
    previous = month
    return month
  })
}
