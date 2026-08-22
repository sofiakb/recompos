import { useCallback, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/dexie'
import {
  completeHabit,
  completedHabitIds,
  refreshDailyLog,
  uncompleteHabit,
} from '@/db/repositories/habitRepository'
import { addProteinLog, removeProteinLog } from '@/db/repositories/proteinRepository'
import { useProteinTarget } from '@/features/nutrition/useProteinTarget'
import { consistencyScore, dayNumber, type ConsistencyScore } from '@/lib/consistency'
import { lastDays, toLogicalDate } from '@/lib/date'
import { selectHabits, useSettingsStore } from '@/stores/settingsStore'
import { haptic } from '@/lib/utils'
import type { FloorHabitDefinition, ZeroCookItem } from '@/types/models'

/** What the caller must do next after asking to complete a habit. */
export type ToggleOutcome = 'completed' | 'uncompleted' | 'needs_portion'

export interface FloorState {
  today: string
  dayNumber: number
  floorHabits: FloorHabitDefinition[]
  stackHabits: FloorHabitDefinition[]
  completedIds: Set<string>
  floorCompleted: boolean
  score7: ConsistencyScore
  score30: ConsistencyScore
  toggle: (habit: FloorHabitDefinition) => Promise<ToggleOutcome>
  /** Completes a `protein_portion` habit and logs the portion's grams. */
  completeWithPortion: (habit: FloorHabitDefinition, item: ZeroCookItem) => Promise<void>
  /** Completes every plain floor habit; returns the ones still awaiting a portion. */
  completeFloor: () => Promise<FloorHabitDefinition[]>
}

export function useFloor(): FloorState {
  const today = toLogicalDate()
  const habits = useSettingsStore((state) => state.habits)
  const installedAt = useSettingsStore((state) => state.settings.installedAt)
  const { targetGrams } = useProteinTarget()
  const installedOn = useMemo(() => toLogicalDate(new Date(installedAt)), [installedAt])

  const floorHabits = useMemo(() => selectHabits(habits, 'floor'), [habits])
  const stackHabits = useMemo(() => selectHabits(habits, 'stack'), [habits])

  const completedIdsQuery = useLiveQuery(() => completedHabitIds(today), [today], new Set<string>())
  const completedIds = useMemo(() => completedIdsQuery ?? new Set<string>(), [completedIdsQuery])

  const window30 = useMemo(() => lastDays(30, today), [today])
  const dailyLogs = useLiveQuery(
    () => db.dailyLogs.where('date').between(window30[0], today, true, true).toArray(),
    [window30, today],
    [],
  )

  const completedDates = useMemo(
    () => new Set((dailyLogs ?? []).filter((log) => log.floorCompleted).map((log) => log.date)),
    [dailyLogs],
  )

  const floorCompleted =
    floorHabits.length > 0 && floorHabits.every((habit) => completedIds.has(habit.id))

  const sync = useCallback(
    () =>
      refreshDailyLog(
        today,
        floorHabits.map((habit) => habit.id),
        targetGrams,
      ),
    [today, floorHabits, targetGrams],
  )

  const toggle = useCallback(
    async (habit: FloorHabitDefinition): Promise<ToggleOutcome> => {
      const removed = await uncompleteHabit(habit.id, today)
      if (removed) {
        // Undoing the habit withdraws the grams it added, or the day's total
        // would keep crediting a portion that is no longer claimed.
        if (removed.proteinLogId) await removeProteinLog(removed.proteinLogId, targetGrams)
        await sync()
        return 'uncompleted'
      }

      if (habit.completionMode === 'protein_portion') return 'needs_portion'

      await completeHabit(habit.id, today)
      await sync()
      haptic()
      return 'completed'
    },
    [today, sync, targetGrams],
  )

  const completeWithPortion = useCallback(
    async (habit: FloorHabitDefinition, item: ZeroCookItem) => {
      const log = await addProteinLog(item.proteinPerServingGrams, 'zero_cook', targetGrams, {
        note: item.name,
        date: today,
      })
      await completeHabit(habit.id, today, log.id)
      await sync()
      haptic()
    },
    [today, sync, targetGrams],
  )

  const completeFloor = useCallback(async () => {
    const pending: FloorHabitDefinition[] = []
    for (const habit of floorHabits) {
      if (completedIds.has(habit.id)) continue
      if (habit.completionMode === 'protein_portion') {
        pending.push(habit)
        continue
      }
      await completeHabit(habit.id, today)
    }
    await sync()
    if (pending.length === 0) haptic(40)
    return pending
  }, [floorHabits, completedIds, today, sync])

  return {
    today,
    dayNumber: dayNumber(installedOn, today),
    floorHabits,
    stackHabits,
    completedIds,
    floorCompleted,
    score7: consistencyScore(7, completedDates, installedOn, today),
    score30: consistencyScore(30, completedDates, installedOn, today),
    toggle,
    completeWithPortion,
    completeFloor,
  }
}
