import { useCallback, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/dexie'
import {
  activeSession,
  allExercises,
  deleteSet,
  discardEmptySession,
  endSession,
  logSet,
  recentSessions,
  setsForDate,
  setsForSession,
  startSession,
  type LogSetInput,
} from '@/db/repositories/workoutRepository'
import { suggestNextSet, type OverloadSuggestion } from '@/lib/overload'
import { toLogicalDate } from '@/lib/date'
import { haptic } from '@/lib/haptics'
import type { Exercise, ExerciseSet, SessionType, WorkoutSession } from '@/types/models'

export interface SessionOutcome {
  durationMinutes: number
  setCount: number
}

export interface WorkoutsState {
  today: string
  exercises: Exercise[]
  exerciseById: (id: string) => Exercise | undefined
  session: WorkoutSession | null
  sessionSets: ExerciseSet[]
  todaySets: ExerciseSet[]
  history: WorkoutSession[]
  /** Overload suggestion for a movement, from its most recent set. */
  suggestionFor: (exerciseId: string) => OverloadSuggestion | null
  lastSetFor: (exerciseId: string) => ExerciseSet | null
  start: (type: SessionType) => Promise<void>
  /** Ends the running session; returns null when it recorded nothing and was dropped. */
  end: () => Promise<SessionOutcome | null>
  log: (input: LogSetInput) => Promise<ExerciseSet>
  remove: (id: string) => Promise<void>
}

export function useWorkouts(): WorkoutsState {
  const today = toLogicalDate()

  const exercisesQuery = useLiveQuery(() => allExercises(), [], [])
  const exercises = useMemo(() => exercisesQuery ?? [], [exercisesQuery])
  const session = useLiveQuery(() => activeSession(), [], null) ?? null
  const history = useLiveQuery(() => recentSessions(10), [], []) ?? []
  const todaySets = useLiveQuery(() => setsForDate(today), [today], []) ?? []

  const sessionId = session?.id ?? null
  const sessionSets =
    useLiveQuery(
      () => (sessionId ? setsForSession(sessionId) : Promise.resolve([])),
      [sessionId],
      [],
    ) ?? []

  // The suggestion needs the newest set per movement across all of history, not
  // just today's — the whole point is remembering last week.
  const allSets = useLiveQuery(() => db.sets.toArray(), [], [])

  const byId = useMemo(
    () => new Map(exercises.map((exercise) => [exercise.id, exercise])),
    [exercises],
  )

  const lastSets = useMemo(() => {
    const map = new Map<string, ExerciseSet>()
    for (const set of allSets ?? []) {
      const known = map.get(set.exerciseId)
      if (!known || set.timestamp > known.timestamp) map.set(set.exerciseId, set)
    }
    return map
  }, [allSets])

  const exerciseById = useCallback((id: string) => byId.get(id), [byId])
  const lastSetFor = useCallback((id: string) => lastSets.get(id) ?? null, [lastSets])

  const suggestionFor = useCallback(
    (exerciseId: string) => {
      const exercise = byId.get(exerciseId)
      if (!exercise) return null
      return suggestNextSet(exercise, lastSets.get(exerciseId) ?? null, (id) => byId.get(id))
    },
    [byId, lastSets],
  )

  const start = useCallback(async (type: SessionType) => {
    await startSession(type, toLogicalDate())
    haptic()
  }, [])

  const end = useCallback(async (): Promise<SessionOutcome | null> => {
    if (!session) return null
    const setCount = (await setsForSession(session.id)).length
    if (setCount === 0) {
      await discardEmptySession(session.id)
      return null
    }
    const ended = await endSession(session.id)
    haptic(40)
    return { durationMinutes: ended?.durationMinutes ?? 0, setCount }
  }, [session])

  const log = useCallback(
    async (input: LogSetInput) => {
      const set = await logSet({ ...input, sessionId: input.sessionId ?? session?.id, date: today })
      haptic()
      return set
    },
    [session, today],
  )

  const remove = useCallback((id: string) => deleteSet(id), [])

  return {
    today,
    exercises,
    exerciseById,
    session,
    sessionSets,
    todaySets,
    history,
    suggestionFor,
    lastSetFor,
    start,
    end,
    log,
    remove,
  }
}
