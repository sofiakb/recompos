import { useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  addProteinLog,
  logsForDate,
  removeProteinLog,
  updateProteinLogSource,
} from '@/db/repositories/proteinRepository'
import { useProteinTarget } from '@/features/nutrition/useProteinTarget'
import { toLogicalDate, type IsoDate } from '@/lib/date'
import { haptic } from '@/lib/haptics'
import type { ProteinLog, ProteinSource } from '@/types/models'

export interface ProteinState {
  /** The day being shown, which is not always today. */
  date: IsoDate
  logs: ProteinLog[]
  totalGrams: number
  targetGrams: number
  remainingGrams: number
  percent: number
  add: (grams: number, sourceType: ProteinSource, note?: string) => Promise<ProteinLog>
  remove: (id: string) => Promise<void>
  setSource: (id: string, sourceType: ProteinSource) => Promise<void>
}

/**
 * The protein ledger for one day.
 *
 * The day is a parameter rather than always today: Nutrition lets you walk back
 * through the week, and a log written while looking at Tuesday belongs to
 * Tuesday.
 */
export function useProtein(date: IsoDate = toLogicalDate()): ProteinState {
  const { targetGrams } = useProteinTarget()
  const logs = useLiveQuery(() => logsForDate(date), [date], []) ?? []
  const totalGrams = logs.reduce((total, log) => total + log.grams, 0)

  const add = useCallback(
    async (grams: number, sourceType: ProteinSource, note?: string) => {
      const log = await addProteinLog(grams, sourceType, targetGrams, { note, date })
      haptic()
      return log
    },
    [targetGrams, date],
  )

  const remove = useCallback(
    async (id: string) => {
      await removeProteinLog(id, targetGrams)
    },
    [targetGrams],
  )

  const setSource = useCallback(
    (id: string, sourceType: ProteinSource) => updateProteinLogSource(id, sourceType),
    [],
  )

  return {
    date,
    logs,
    totalGrams,
    targetGrams,
    remainingGrams: Math.max(0, targetGrams - totalGrams),
    percent: targetGrams === 0 ? 0 : Math.round((totalGrams / targetGrams) * 100),
    add,
    remove,
    setSource,
  }
}
