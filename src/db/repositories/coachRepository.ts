/**
 * The coach thread (spec coach §4.1, §8).
 *
 * Seven days and no more: the coach's memory is the digest, rebuilt from the
 * real logs on every question. This table only holds what was said, so the
 * screen can show it and the next question can see the last few turns.
 */
import { db, type RecompDb } from '@/db/dexie'
import { addDays, toLogicalDate } from '@/lib/date'
import { createId } from '@/lib/utils'
import type { CoachMessage, CoachPersonaId } from '@/types/models'

export const COACH_RETENTION_DAYS = 7

export type NewCoachMessage = Omit<CoachMessage, 'id' | 'timestamp' | 'date'>

export async function addCoachMessage(
  message: NewCoachMessage,
  now: Date = new Date(),
  database: RecompDb = db,
): Promise<CoachMessage> {
  const row: CoachMessage = {
    ...message,
    id: createId(),
    timestamp: now.toISOString(),
    date: toLogicalDate(now),
  }
  await database.coachMessages.add(row)
  return row
}

/** Oldest first: a thread reads down. */
export async function coachThread(
  persona: CoachPersonaId,
  database: RecompDb = db,
): Promise<CoachMessage[]> {
  const rows = await database.coachMessages.where('persona').equals(persona).toArray()
  return rows.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}

/** The last `limit` real turns, oldest first — what the model is shown. */
export async function recentExchanges(
  persona: CoachPersonaId,
  limit = 8,
  database: RecompDb = db,
): Promise<CoachMessage[]> {
  const thread = await coachThread(persona, database)
  return thread.filter((message) => !message.synthetic).slice(-limit)
}

/** Drops every line older than the window. Returns how many went. */
export async function pruneCoachMessages(
  now: Date = new Date(),
  database: RecompDb = db,
): Promise<number> {
  const firstKept = addDays(toLogicalDate(now), -(COACH_RETENTION_DAYS - 1))
  return database.coachMessages.where('date').below(firstKept).delete()
}
