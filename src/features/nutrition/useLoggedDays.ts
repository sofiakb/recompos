/**
 * How many of the last seven days actually got a meal written down.
 *
 * The Nutrition tab used to show the floor's consistency, which is a fine
 * number — it is just about habits, on a screen made of kcal. A percentage
 * next to a logged lunch answered a question nobody was asking here.
 *
 * Still a rolling window and still never a streak (PRD §3): a missed day lowers
 * the count and the day after raises it again, nothing resets.
 */
import { useCallback, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/dexie'
import { consistencyScore, type ConsistencyScore } from '@/lib/consistency'
import { lastDays, toLogicalDate, type IsoDate } from '@/lib/date'
import { DAYS_PER_WEEK, HEATMAP_WEEKS } from '@/lib/heatmap'
import { useSettingsStore } from '@/stores/settingsStore'

export interface LoggedDaysState {
  /** Days inside the loaded window that hold at least one entry. */
  loggedDates: Set<IsoDate>
  /**
   * The window ending on `day`, or `null` where the history cannot answer:
   * before the install, or older than the range read from Dexie, where a
   * missing row means « not loaded », not « not logged ».
   */
  scoreOn: (day: IsoDate) => ConsistencyScore | null
}

export function useLoggedDays(): LoggedDaysState {
  const today = toLogicalDate()
  const installedAt = useSettingsStore((state) => state.settings.installedAt)
  const installedOn = useMemo(() => toLogicalDate(new Date(installedAt)), [installedAt])

  // The same range the heatmap reads, so walking back through the week is
  // answered from rows already in memory rather than a query per day.
  const window = useMemo(() => lastDays(HEATMAP_WEEKS * DAYS_PER_WEEK, today), [today])
  const from = window[0]

  const meals = useLiveQuery(
    () => db.meals.where('date').between(from, today, true, true).toArray(),
    [from, today],
    [],
  )
  const logs = useLiveQuery(
    () => db.proteinLogs.where('date').between(from, today, true, true).toArray(),
    [from, today],
    [],
  )

  // A photo still being analysed counts: the meal was written down, and whether
  // the model has answered yet is the app's problem, not the day's.
  const loggedDates = useMemo(() => {
    const dates = new Set<IsoDate>()
    for (const meal of meals ?? []) if (meal.status !== 'failed') dates.add(meal.date)
    for (const log of logs ?? []) dates.add(log.date)
    return dates
  }, [meals, logs])

  const scoreOn = useCallback(
    (day: IsoDate): ConsistencyScore | null => {
      if (day > today || day < installedOn || day < from) return null
      return consistencyScore(DAYS_PER_WEEK, loggedDates, installedOn, day)
    },
    [from, installedOn, loggedDates, today],
  )

  return { loggedDates, scoreOn }
}
