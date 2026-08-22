/** Sessions, sets and the exercise catalog (PRD §6.3). */
import { db, type RecompDb } from '@/db/dexie'
import { minutesBetween } from '@/lib/timer'
import { toLogicalDate, type IsoDate } from '@/lib/date'
import { createId } from '@/lib/utils'
import type {
  Exercise,
  ExerciseSet,
  MovementPattern,
  SessionType,
  SetDifficulty,
  WorkoutSession,
} from '@/types/models'

export async function allExercises(database: RecompDb = db): Promise<Exercise[]> {
  const rows = await database.exercises.toArray()
  return rows.sort((a, b) => a.name.localeCompare(b.name, 'fr'))
}

export async function exercisesByPattern(
  pattern: MovementPattern,
  database: RecompDb = db,
): Promise<Exercise[]> {
  const rows = await database.exercises.where('pattern').equals(pattern).toArray()
  return rows.sort((a, b) => a.name.localeCompare(b.name, 'fr'))
}

export async function addCustomExercise(
  name: string,
  pattern: MovementPattern,
  defaultRepRange: [number, number] = [8, 15],
  database: RecompDb = db,
): Promise<Exercise> {
  const exercise: Exercise = {
    id: createId(),
    name: name.trim(),
    pattern,
    defaultRepRange,
    isCustom: true,
  }
  await database.exercises.add(exercise)
  return exercise
}

export async function startSession(
  type: SessionType,
  date: IsoDate = toLogicalDate(),
  database: RecompDb = db,
): Promise<WorkoutSession> {
  const session: WorkoutSession = {
    id: createId(),
    date,
    startedAt: new Date().toISOString(),
    type,
  }
  await database.sessions.add(session)
  return session
}

/**
 * The session still running, if any.
 *
 * A session left open overnight is the normal failure mode — the phone was put
 * down mid-circuit — so the most recent unfinished one wins rather than the
 * oldest, which would resurrect a session from last week.
 */
export async function activeSession(database: RecompDb = db): Promise<WorkoutSession | null> {
  const rows = await database.sessions.toArray()
  const open = rows
    .filter((session) => !session.endedAt)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
  return open[0] ?? null
}

export async function endSession(
  id: string,
  database: RecompDb = db,
): Promise<WorkoutSession | null> {
  const session = await database.sessions.get(id)
  if (!session) return null
  const endedAt = new Date().toISOString()
  const updated: WorkoutSession = {
    ...session,
    endedAt,
    durationMinutes: minutesBetween(session.startedAt, endedAt),
  }
  await database.sessions.put(updated)
  return updated
}

/** Drops a session that recorded nothing, so an accidental tap leaves no trace. */
export async function discardEmptySession(id: string, database: RecompDb = db): Promise<boolean> {
  const count = await database.sets.where('sessionId').equals(id).count()
  if (count > 0) return false
  await database.sessions.delete(id)
  return true
}

export interface LogSetInput {
  exerciseId: string
  reps: number
  loadOrResistance: string
  difficulty: SetDifficulty
  /** Absent for a micro-set logged outside any session. */
  sessionId?: string
  rpe?: number
  date?: IsoDate
}

export async function logSet(input: LogSetInput, database: RecompDb = db): Promise<ExerciseSet> {
  const set: ExerciseSet = {
    id: createId(),
    sessionId: input.sessionId,
    exerciseId: input.exerciseId,
    reps: Math.max(1, Math.round(input.reps)),
    loadOrResistance: input.loadOrResistance,
    difficulty: input.difficulty,
    rpe: input.rpe,
    date: input.date ?? toLogicalDate(),
    timestamp: new Date().toISOString(),
  }
  await database.sets.add(set)
  return set
}

export async function deleteSet(id: string, database: RecompDb = db): Promise<void> {
  await database.sets.delete(id)
}

/** The most recent set on one movement — what the overload suggestion reads. */
export async function lastSetForExercise(
  exerciseId: string,
  database: RecompDb = db,
): Promise<ExerciseSet | null> {
  const rows = await database.sets.where('exerciseId').equals(exerciseId).toArray()
  if (rows.length === 0) return null
  return rows.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]
}

/** The most recent set on each of the given movements, keyed by exercise id. */
export async function lastSetsByExercise(
  exerciseIds: string[],
  database: RecompDb = db,
): Promise<Map<string, ExerciseSet>> {
  const entries = await Promise.all(
    exerciseIds.map(async (id) => [id, await lastSetForExercise(id, database)] as const),
  )
  const map = new Map<string, ExerciseSet>()
  for (const [id, set] of entries) {
    if (set) map.set(id, set)
  }
  return map
}

export async function setsForSession(
  sessionId: string,
  database: RecompDb = db,
): Promise<ExerciseSet[]> {
  const rows = await database.sets.where('sessionId').equals(sessionId).toArray()
  return rows.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}

export async function setsForDate(
  date: IsoDate = toLogicalDate(),
  database: RecompDb = db,
): Promise<ExerciseSet[]> {
  const rows = await database.sets.where('date').equals(date).toArray()
  return rows.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}

export async function recentSessions(
  limit = 10,
  database: RecompDb = db,
): Promise<WorkoutSession[]> {
  const rows = await database.sessions.toArray()
  return rows
    .filter((session) => session.endedAt)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, limit)
}

/** Every set logged over a window, oldest first — the strength index's input. */
export async function setsSince(
  from: IsoDate,
  to: IsoDate = toLogicalDate(),
  database: RecompDb = db,
): Promise<ExerciseSet[]> {
  const rows = await database.sets.where('date').between(from, to, true, true).toArray()
  return rows.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}
