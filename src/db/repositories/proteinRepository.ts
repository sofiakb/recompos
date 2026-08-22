/** Protein logs and the day's denormalised total. */
import { db, type RecompDb } from '@/db/dexie'
import { toLogicalDate, type IsoDate } from '@/lib/date'
import { createId, nowIso } from '@/lib/utils'
import type { ProteinLog, ProteinSource } from '@/types/models'

export async function logsForDate(date: IsoDate, database: RecompDb = db): Promise<ProteinLog[]> {
  const rows = await database.proteinLogs.where('date').equals(date).toArray()
  return rows.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}

export async function totalProteinForDate(date: IsoDate, database: RecompDb = db): Promise<number> {
  const rows = await logsForDate(date, database)
  return rows.reduce((total, row) => total + row.grams, 0)
}

/**
 * Rewrites the day's aggregate from its logs.
 *
 * Recomputed rather than incremented so that an undo, an edit or a partially
 * failed write can never leave the dashboard showing a total the logs do not
 * support.
 */
export async function refreshProteinTotal(
  date: IsoDate,
  fallbackTargetGrams: number,
  database: RecompDb = db,
): Promise<number> {
  const total = await totalProteinForDate(date, database)
  const existing = await database.dailyLogs.get(date)
  await database.dailyLogs.put({
    date,
    floorCompleted: existing?.floorCompleted ?? false,
    totalProteinGrams: total,
    // Frozen on first write: raising the target later must not rewrite history.
    proteinTargetGrams: existing?.proteinTargetGrams ?? fallbackTargetGrams,
    notes: existing?.notes,
  })
  return total
}

export async function addProteinLog(
  grams: number,
  sourceType: ProteinSource,
  targetGrams: number,
  options: { note?: string; date?: IsoDate } = {},
  database: RecompDb = db,
): Promise<ProteinLog> {
  const date = options.date ?? toLogicalDate()
  const log: ProteinLog = {
    id: createId(),
    date,
    timestamp: nowIso(),
    grams: Math.max(0, Math.round(grams)),
    sourceType,
    note: options.note,
  }
  await database.proteinLogs.add(log)
  await refreshProteinTotal(date, targetGrams, database)
  return log
}

/** Re-labels a log's source. Grams are untouched, so no total to recompute. */
export async function updateProteinLogSource(
  id: string,
  sourceType: ProteinSource,
  database: RecompDb = db,
): Promise<void> {
  await database.proteinLogs.update(id, { sourceType })
}

export async function removeProteinLog(
  id: string,
  targetGrams: number,
  database: RecompDb = db,
): Promise<void> {
  const log = await database.proteinLogs.get(id)
  if (!log) return
  await database.proteinLogs.delete(id)
  await refreshProteinTotal(log.date, targetGrams, database)
}
