/**
 * Strength index (PRD §6.5).
 *
 * Volume is `reps × load factor`, summed per week. The load factor is where the
 * honesty lives: a bodyweight set counts 1, and an added load counts as the
 * fraction of bodyweight it adds — a +8 kg pull-up on an 80 kg body is 1.1× the
 * work of a bodyweight one. That keeps a mid-window switch to added load from
 * looking like an eightfold jump, and needs no invented constant: the app
 * already tracks bodyweight.
 *
 * The result is published as an index based at 100 on the first week with any
 * volume, because the absolute figure mixes movements and means nothing on its own.
 */
import { formatIsoDate, parseIsoDate, type IsoDate } from '@/lib/date'
import { startOfWeek } from '@/lib/heatmap'
import type { ExerciseSet } from '@/types/models'

/** Used only when no weigh-in exists yet, so the factor stays defined. */
export const FALLBACK_BODYWEIGHT_KG = 75

/**
 * Reads an added load out of the free-text field.
 *
 * Deliberately narrow: `12 kg`, `2 × 8 kg`, `8kg`. Anything else — « élastique
 * rouge », « poids du corps » — has no number of kilos in it and returns null
 * rather than a guess.
 */
export function parseLoadKg(text: string): number | null {
  if (!text) return null
  const normalised = text.toLowerCase().replace(',', '.')
  const paired = normalised.match(/(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*kg/)
  if (paired) return Number(paired[1]) * Number(paired[2])
  const single = normalised.match(/(\d+(?:\.\d+)?)\s*kg/)
  if (single) return Number(single[1])
  return null
}

export function loadFactor(loadKg: number | null, bodyweightKg: number): number {
  if (!loadKg || loadKg <= 0) return 1
  const reference = bodyweightKg > 0 ? bodyweightKg : FALLBACK_BODYWEIGHT_KG
  return 1 + loadKg / reference
}

export function setVolume(set: ExerciseSet, bodyweightKg: number): number {
  return set.reps * loadFactor(parseLoadKg(set.loadOrResistance), bodyweightKg)
}

export interface WeeklyVolume {
  /** Monday of the week. */
  weekStart: IsoDate
  volume: number
  setCount: number
}

/**
 * Volume per week, oldest first, with empty weeks present at zero.
 *
 * Gaps are kept rather than skipped: a fortnight off is part of the shape, and
 * hiding it would draw a straight line through a break that happened.
 */
export function weeklyVolume(
  sets: ExerciseSet[],
  bodyweightKg: number,
  weeks: number,
  today: IsoDate,
): WeeklyVolume[] {
  const buckets = new Map<IsoDate, WeeklyVolume>()
  const lastMonday = parseIsoDate(startOfWeek(today))

  for (let i = weeks - 1; i >= 0; i--) {
    const cursor = new Date(lastMonday.getTime())
    cursor.setDate(cursor.getDate() - i * 7)
    const weekStart = formatIsoDate(cursor)
    buckets.set(weekStart, { weekStart, volume: 0, setCount: 0 })
  }

  for (const set of sets) {
    const bucket = buckets.get(startOfWeek(set.date))
    if (!bucket) continue
    bucket.volume += setVolume(set, bodyweightKg)
    bucket.setCount += 1
  }

  return [...buckets.values()].map((bucket) => ({
    ...bucket,
    volume: Math.round(bucket.volume),
  }))
}

export interface StrengthPoint {
  weekStart: IsoDate
  /** 100 on the first week that recorded anything. */
  index: number
  volume: number
  setCount: number
}

export function strengthIndex(weekly: WeeklyVolume[]): StrengthPoint[] {
  const base = weekly.find((week) => week.volume > 0)?.volume ?? 0
  if (base === 0) return weekly.map((week) => ({ ...week, index: 0 }))
  return weekly.map((week) => ({ ...week, index: Math.round((week.volume / base) * 100) }))
}

/** The heaviest set on record per movement — a plain personal-best list. */
export function bestSets(sets: ExerciseSet[], bodyweightKg: number): Map<string, ExerciseSet> {
  const best = new Map<string, ExerciseSet>()
  for (const set of sets) {
    const known = best.get(set.exerciseId)
    if (!known || setVolume(set, bodyweightKg) > setVolume(known, bodyweightKg)) {
      best.set(set.exerciseId, set)
    }
  }
  return best
}

/** Rolling mean over `points` values, used to flatten waist noise (PRD §6.5). */
export function movingAverage(values: number[], points = 4): Array<number | null> {
  return values.map((_, index) => {
    if (index + 1 < Math.min(points, values.length)) return null
    const window = values.slice(Math.max(0, index - points + 1), index + 1)
    return Math.round((window.reduce((sum, v) => sum + v, 0) / window.length) * 10) / 10
  })
}
