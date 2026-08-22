import { useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { isWeighInDue, logWeight, recentWeights } from '@/db/repositories/measurementRepository'
import { smoothedWeightKg, WEIGH_IN_INTERVAL_DAYS } from '@/lib/nutrition'
import { haptic } from '@/lib/utils'
import { toLogicalDate } from '@/lib/date'
import type { Measurement } from '@/types/models'

export interface WeightState {
  /** Newest first. */
  entries: Measurement[]
  latest: Measurement | null
  /** Rolling mean over the last few weigh-ins — the number the app trusts. */
  smoothedKg: number | null
  /** Change in the smoothed value versus the previous window, in kg. */
  trendKg: number | null
  isDue: boolean
  hasWeight: boolean
  log: (weightKg: number) => Promise<void>
}

export function useWeight(): WeightState {
  const entries = useLiveQuery(() => recentWeights(24), [], []) ?? []
  const values = entries.map((entry) => entry.weightKg as number)

  const smoothedKg = smoothedWeightKg(values)
  // Compare against the window that ends one weigh-in earlier, so the trend
  // reflects the smoothed line rather than the last raw reading.
  const previousSmoothed = values.length > 1 ? smoothedWeightKg(values.slice(1)) : null
  const trendKg =
    smoothedKg !== null && previousSmoothed !== null
      ? Math.round((smoothedKg - previousSmoothed) * 10) / 10
      : null

  const log = useCallback(async (weightKg: number) => {
    await logWeight(weightKg, toLogicalDate())
    haptic()
  }, [])

  return {
    entries,
    latest: entries[0] ?? null,
    smoothedKg,
    trendKg,
    isDue: isWeighInDue(entries[0]?.date ?? null, WEIGH_IN_INTERVAL_DAYS),
    hasWeight: entries.length > 0,
    log,
  }
}
