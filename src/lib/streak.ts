/**
 * The meal-logging series: consecutive days with something written down.
 *
 * A real series, unbounded — it can read 0 as it can read 180. The elastic
 * percentage (`lib/consistency`) still governs the habit floor, where a missed
 * week must not erase a quarter of work; the journal is the one place where
 * « combien de jours d'affilée » is the question actually being asked.
 */
import { addDays, type IsoDate } from '@/lib/date'

/**
 * @param loggedDates every day holding at least one entry
 * @param day the day being read — the series ends here
 */
export function loggingStreak(loggedDates: ReadonlySet<IsoDate>, day: IsoDate): number {
  // An empty `day` does not break the run, it simply has not extended it yet:
  // counting from it would reset the series every morning before breakfast, and
  // a series that dies overnight is not a series.
  let cursor = loggedDates.has(day) ? day : addDays(day, -1)
  let days = 0
  while (loggedDates.has(cursor)) {
    days += 1
    cursor = addDays(cursor, -1)
  }
  return days
}
