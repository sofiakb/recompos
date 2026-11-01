/**
 * The only part of the coach that reads the database.
 *
 * Returns rows, not a digest: the targets come from React hooks (the protein
 * and calorie targets resolve against settings and the last weigh-in), so the
 * caller joins the two and `buildDigest` stays pure.
 */
import { db, type RecompDb } from '@/db/dexie'
import { listFavorites } from '@/db/repositories/favoriteRepository'
import { recentWaists, recentWeights } from '@/db/repositories/measurementRepository'
import { DIGEST_DAYS, type DigestInput } from '@/lib/coach/digest'
import { lastDays } from '@/lib/date'
import type { IsoDate } from '@/types/models'

export type DigestRows = Omit<DigestInput, 'today' | 'now' | 'profile'>

export async function readDigestRows(today: IsoDate, database: RecompDb = db): Promise<DigestRows> {
  const from = lastDays(DIGEST_DAYS, today)[0]

  const [
    meals,
    proteinLogs,
    dailyLogs,
    sessions,
    weightsNewestFirst,
    waists,
    favorites,
    zeroCook,
    takeout,
  ] = await Promise.all([
    database.meals.where('date').between(from, today, true, true).toArray(),
    database.proteinLogs.where('date').between(from, today, true, true).toArray(),
    // `date` is the primary key of dailyLogs: the same range query works on it.
    database.dailyLogs.where('date').between(from, today, true, true).toArray(),
    database.sessions.where('date').between(from, today, true, true).toArray(),
    recentWeights(4, database),
    recentWaists(1, database),
    listFavorites(database),
    database.zeroCookItems.toArray(),
    database.takeoutOptions.toArray(),
  ])

  return {
    meals,
    proteinLogs,
    dailyLogs,
    sessions,
    weightsNewestFirst,
    latestWaist: waists[0] ?? null,
    favorites,
    zeroCook,
    takeout,
  }
}
