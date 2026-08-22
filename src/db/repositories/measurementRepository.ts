/** Body weight and waist entries. One row per logical day, latest write wins. */
import { db, type RecompDb } from '@/db/dexie'
import { clampWeightKg } from '@/lib/nutrition'
import { daysBetween, toLogicalDate, type IsoDate } from '@/lib/date'
import { createId } from '@/lib/utils'
import type { Measurement } from '@/types/models'

export async function logWeight(
  weightKg: number,
  date: IsoDate = toLogicalDate(),
  database: RecompDb = db,
): Promise<Measurement> {
  const existing = await database.measurements.where('date').equals(date).first()
  const measurement: Measurement = {
    id: existing?.id ?? createId(),
    date,
    weightKg: clampWeightKg(weightKg),
    waistCm: existing?.waistCm,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  }
  await database.measurements.put(measurement)
  return measurement
}

/** Weigh-ins newest first — the order `smoothedWeightKg` expects. */
export async function recentWeights(limit = 12, database: RecompDb = db): Promise<Measurement[]> {
  const rows = await database.measurements.orderBy('date').reverse().toArray()
  return rows.filter((row) => typeof row.weightKg === 'number').slice(0, limit)
}

export async function lastWeighInDate(database: RecompDb = db): Promise<IsoDate | null> {
  const [latest] = await recentWeights(1, database)
  return latest?.date ?? null
}

/**
 * Whether the dashboard should suggest a weigh-in.
 *
 * A suggestion, never a reminder: the card appears when it is due and says
 * nothing at all when it is not.
 */
export function isWeighInDue(
  lastDate: IsoDate | null,
  intervalDays: number,
  today: IsoDate = toLogicalDate(),
): boolean {
  if (!lastDate) return true
  return daysBetween(lastDate, today) >= intervalDays
}
