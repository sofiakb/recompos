/**
 * The meal-logging series, as it stands on the day being read.
 *
 * Reads the date indexes rather than the rows: `uniqueKeys()` hands back the
 * distinct days straight from IndexedDB, so a series of 180 days costs one key
 * list per table instead of a year of meals and their items. Nothing is windowed
 * — a series has no ceiling, and cutting the history at twelve weeks would cap
 * the number at the one place it is supposed to keep climbing.
 */
import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/dexie'
import { loggingStreak } from '@/lib/streak'
import type { IsoDate } from '@/lib/date'

export function useLoggingStreak(day: IsoDate): number {
  const mealDays = useLiveQuery(() => db.meals.orderBy('date').uniqueKeys(), [], [])
  const proteinDays = useLiveQuery(() => db.proteinLogs.orderBy('date').uniqueKeys(), [], [])

  const loggedDates = useMemo(
    () => new Set([...(mealDays ?? []), ...(proteinDays ?? [])] as IsoDate[]),
    [mealDays, proteinDays],
  )

  return useMemo(() => loggingStreak(loggedDates, day), [loggedDates, day])
}
