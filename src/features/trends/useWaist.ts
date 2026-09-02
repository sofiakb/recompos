import { useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { logWaist, recentWaists } from '@/db/repositories/measurementRepository'
import { movingAverage } from '@/lib/strength'
import { toLogicalDate } from '@/lib/date'
import { haptic } from '@/lib/haptics'
import type { Measurement } from '@/types/models'

export interface WaistState {
  /** Newest first. */
  entries: Measurement[]
  latest: Measurement | null
  /** Oldest first, for charting. */
  seriesCm: number[]
  seriesDates: string[]
  /** Rolling mean over the same series, aligned index for index. */
  smoothedCm: Array<number | null>
  /** Change from the first measurement to the latest, in cm. */
  totalChangeCm: number | null
  log: (waistCm: number) => Promise<void>
}

export function useWaist(): WaistState {
  const entries = useLiveQuery(() => recentWaists(52), [], []) ?? []
  const oldestFirst = [...entries].reverse()
  const seriesCm = oldestFirst.map((entry) => entry.waistCm as number)

  const log = useCallback(async (waistCm: number) => {
    await logWaist(waistCm, toLogicalDate())
    haptic()
  }, [])

  return {
    entries,
    latest: entries[0] ?? null,
    seriesCm,
    seriesDates: oldestFirst.map((entry) => entry.date),
    smoothedCm: movingAverage(seriesCm),
    totalChangeCm:
      seriesCm.length > 1
        ? Math.round((seriesCm[seriesCm.length - 1] - seriesCm[0]) * 10) / 10
        : null,
    log,
  }
}
