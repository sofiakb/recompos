/**
 * Progressive overload suggestions (PRD §6.3).
 *
 * The suggestion is always pre-filled and always editable — it exists so the
 * user does not have to remember last week, not to police this week.
 */
import type { Exercise, ExerciseSet, SetDifficulty } from '@/types/models'

/** Reps added on top of the last set, by how that set felt. */
export const REP_STEP: Record<SetDifficulty, number> = {
  easy: 2,
  target: 1,
  // A hard set repeats as-is. Adding load to a set that already failed the
  // rep target is how a plateau turns into an injury.
  hard: 0,
}

export const DEFAULT_LOAD = 'Poids du corps'

export interface OverloadSuggestion {
  exerciseId: string
  reps: number
  loadOrResistance: string
  /** Set when the top of the range was reached and a harder variant takes over. */
  progressedFromExerciseId?: string
}

/**
 * @param exercise the movement the user is about to log
 * @param lastSet the most recent set on that movement, or null on a first time
 * @param resolve looks an exercise up by id, for walking the progression chain
 */
export function suggestNextSet(
  exercise: Exercise,
  lastSet: ExerciseSet | null,
  resolve: (id: string) => Exercise | undefined = () => undefined,
): OverloadSuggestion {
  const [min, max] = exercise.defaultRepRange

  if (!lastSet) {
    return { exerciseId: exercise.id, reps: min, loadOrResistance: DEFAULT_LOAD }
  }

  const load = lastSet.loadOrResistance || DEFAULT_LOAD
  const candidate = lastSet.reps + REP_STEP[lastSet.difficulty]

  // A hard set is repeated verbatim, even at the top of the range.
  if (lastSet.difficulty === 'hard') {
    return { exerciseId: exercise.id, reps: lastSet.reps, loadOrResistance: load }
  }

  if (candidate <= max) {
    return { exerciseId: exercise.id, reps: candidate, loadOrResistance: load }
  }

  const next = nextProgression(exercise, resolve)
  if (!next) {
    // No harder variant on file: hold the top of the range and let the user add
    // load themselves rather than inventing a progression.
    return { exerciseId: exercise.id, reps: max, loadOrResistance: load }
  }

  return {
    exerciseId: next.id,
    reps: next.defaultRepRange[0],
    loadOrResistance: DEFAULT_LOAD,
    progressedFromExerciseId: exercise.id,
  }
}

/** The next harder variant on file, if the chain names one that exists. */
export function nextProgression(
  exercise: Exercise,
  resolve: (id: string) => Exercise | undefined,
): Exercise | undefined {
  for (const id of exercise.progressionChain ?? []) {
    const candidate = resolve(id)
    if (candidate) return candidate
  }
  return undefined
}

/** Whether a set sits at the top of its exercise's rep range. */
export function isAtTopOfRange(exercise: Exercise, reps: number): boolean {
  return reps >= exercise.defaultRepRange[1]
}
