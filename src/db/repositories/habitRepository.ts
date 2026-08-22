/** Habit completions and the derived daily log. No component touches Dexie directly. */
import { db, type RecompDb } from '@/db/dexie'
import { createId } from '@/lib/utils'
import { lastDays, toLogicalDate, type IsoDate } from '@/lib/date'
import type { DailyLog, HabitCompletion } from '@/types/models'

export async function completionsForDate(
  date: IsoDate,
  database: RecompDb = db,
): Promise<HabitCompletion[]> {
  return database.habitCompletions.where('date').equals(date).toArray()
}

export async function completedHabitIds(
  date: IsoDate,
  database: RecompDb = db,
): Promise<Set<string>> {
  const rows = await completionsForDate(date, database)
  return new Set(rows.map((row) => row.habitId))
}

/** Toggles one habit for one day and returns its new state. */
export async function toggleHabit(
  habitId: string,
  date: IsoDate,
  database: RecompDb = db,
): Promise<boolean> {
  const existing = await database.habitCompletions.where({ habitId, date }).first()
  if (existing) {
    await database.habitCompletions.delete(existing.id)
    return false
  }
  await database.habitCompletions.add({
    id: createId(),
    habitId,
    date,
    completedAt: new Date().toISOString(),
  })
  return true
}

/** Marks every given habit complete for the day, skipping the ones already done. */
export async function completeHabits(
  habitIds: string[],
  date: IsoDate,
  database: RecompDb = db,
): Promise<void> {
  const done = await completedHabitIds(date, database)
  const now = new Date().toISOString()
  const missing = habitIds
    .filter((id) => !done.has(id))
    .map((habitId) => ({ id: createId(), habitId, date, completedAt: now }))
  if (missing.length > 0) {
    await database.habitCompletions.bulkAdd(missing)
  }
}

/**
 * Recomputes the day's floor flag from the current completions.
 *
 * `floorCompleted` is derived rather than stored at toggle time so that
 * unchecking a habit — or adding a new floor habit mid-day — cannot leave the
 * daily log claiming a day that is no longer complete.
 */
export async function refreshDailyLog(
  date: IsoDate,
  floorHabitIds: string[],
  proteinTargetGrams: number,
  database: RecompDb = db,
): Promise<DailyLog> {
  const done = await completedHabitIds(date, database)
  const floorCompleted = floorHabitIds.length > 0 && floorHabitIds.every((id) => done.has(id))
  const existing = await database.dailyLogs.get(date)
  const log: DailyLog = {
    date,
    floorCompleted,
    totalProteinGrams: existing?.totalProteinGrams ?? 0,
    // The target is frozen on first write so changing it later cannot rewrite history.
    proteinTargetGrams: existing?.proteinTargetGrams ?? proteinTargetGrams,
    notes: existing?.notes,
  }
  await database.dailyLogs.put(log)
  return log
}

/** Date keys where the floor was completed, over the last `windowDays` days. */
export async function completedFloorDates(
  windowDays: number,
  today: IsoDate = toLogicalDate(),
  database: RecompDb = db,
): Promise<Set<IsoDate>> {
  const window = lastDays(windowDays, today)
  const logs = await database.dailyLogs
    .where('date')
    .between(window[0], window[window.length - 1], true, true)
    .toArray()
  return new Set(logs.filter((log) => log.floorCompleted).map((log) => log.date))
}
