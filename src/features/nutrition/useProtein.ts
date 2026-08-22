import { useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  addProteinLog,
  logsForDate,
  removeProteinLog,
  updateProteinLogSource,
} from '@/db/repositories/proteinRepository'
import { useProteinTarget } from '@/features/nutrition/useProteinTarget'
import { toLogicalDate } from '@/lib/date'
import { haptic } from '@/lib/utils'
import type { ProteinLog, ProteinSource } from '@/types/models'

export interface ProteinState {
  today: string
  logs: ProteinLog[]
  totalGrams: number
  targetGrams: number
  remainingGrams: number
  percent: number
  add: (grams: number, sourceType: ProteinSource, note?: string) => Promise<ProteinLog>
  remove: (id: string) => Promise<void>
  setSource: (id: string, sourceType: ProteinSource) => Promise<void>
}

export function useProtein(): ProteinState {
  const today = toLogicalDate()
  const { targetGrams } = useProteinTarget()
  const logs = useLiveQuery(() => logsForDate(today), [today], []) ?? []
  const totalGrams = logs.reduce((total, log) => total + log.grams, 0)

  const add = useCallback(
    async (grams: number, sourceType: ProteinSource, note?: string) => {
      const log = await addProteinLog(grams, sourceType, targetGrams, { note, date: today })
      haptic()
      return log
    },
    [targetGrams, today],
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
    today,
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
