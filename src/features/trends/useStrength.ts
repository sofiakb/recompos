import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { setsSince } from '@/db/repositories/workoutRepository'
import { useWeight } from '@/features/weight/useWeight'
import { formatIsoDate, parseIsoDate, toLogicalDate } from '@/lib/date'
import { startOfWeek } from '@/lib/heatmap'
import {
  bestSets,
  strengthIndex,
  weeklyVolume,
  FALLBACK_BODYWEIGHT_KG,
  type StrengthPoint,
} from '@/lib/strength'
import type { ExerciseSet } from '@/types/models'

/** 3 months, 6 months, a year — the window the PRD asks for. */
export const STRENGTH_WINDOWS = [12, 26, 52] as const
export type StrengthWindow = (typeof STRENGTH_WINDOWS)[number]

export interface StrengthState {
  points: StrengthPoint[]
  best: Map<string, ExerciseSet>
  totalSets: number
  hasData: boolean
}

export function useStrength(weeks: StrengthWindow): StrengthState {
  const today = toLogicalDate()
  const from = useMemo(() => {
    const monday = parseIsoDate(startOfWeek(today))
    monday.setDate(monday.getDate() - (weeks - 1) * 7)
    return formatIsoDate(monday)
  }, [today, weeks])

  const setsQuery = useLiveQuery(() => setsSince(from, today), [from, today], [])
  const sets = useMemo(() => setsQuery ?? [], [setsQuery])
  // Bodyweight scales the added-load factor; without a weigh-in it falls back to
  // a reference figure rather than refusing to draw anything.
  const { smoothedKg } = useWeight()
  const bodyweight = smoothedKg ?? FALLBACK_BODYWEIGHT_KG

  const points = useMemo(
    () => strengthIndex(weeklyVolume(sets, bodyweight, weeks, today)),
    [sets, bodyweight, weeks, today],
  )
  const best = useMemo(() => bestSets(sets, bodyweight), [sets, bodyweight])

  return {
    points,
    best,
    totalSets: sets.length,
    hasData: points.some((point) => point.volume > 0),
  }
}
