import { useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { isWeighInDue, logWeight, recentWeights } from '@/db/repositories/measurementRepository'
import { currentWeightKg, WEIGH_IN_INTERVAL_DAYS } from '@/lib/nutrition'
import { haptic } from '@/lib/haptics'
import { toLogicalDate } from '@/lib/date'
import type { Measurement } from '@/types/models'

export interface WeightState {
  /** Newest first. */
  entries: Measurement[]
  latest: Measurement | null
  /** The last weigh-in — the number the app trusts. */
  currentKg: number | null
  /** Change versus the weigh-in before it, in kg. */
  trendKg: number | null
  isDue: boolean
  hasWeight: boolean
  log: (weightKg: number) => Promise<void>
}

export function useWeight(): WeightState {
  const entries = useLiveQuery(() => recentWeights(24), [], []) ?? []
  const values = entries.map((entry) => entry.weightKg as number)

  const currentKg = currentWeightKg(values)
  const previousKg = currentWeightKg(values.slice(1))
  const trendKg =
    currentKg !== null && previousKg !== null
      ? Math.round((currentKg - previousKg) * 10) / 10
      : null

  const log = useCallback(async (weightKg: number) => {
    await logWeight(weightKg, toLogicalDate())
    haptic()
  }, [])

  return {
    entries,
    latest: entries[0] ?? null,
    currentKg,
    trendKg,
    isDue: isWeighInDue(entries[0]?.date ?? null, WEIGH_IN_INTERVAL_DAYS),
    hasWeight: entries.length > 0,
    log,
  }
}
