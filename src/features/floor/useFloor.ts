import { useCallback, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/dexie'
import {
  completeHabits,
  completedHabitIds,
  refreshDailyLog,
  toggleHabit,
} from '@/db/repositories/habitRepository'
import { consistencyScore, dayNumber, type ConsistencyScore } from '@/lib/consistency'
import { lastDays, toLogicalDate } from '@/lib/date'
import { selectHabits, useSettingsStore } from '@/stores/settingsStore'
import { haptic } from '@/lib/utils'
import type { FloorHabitDefinition } from '@/types/models'

export interface FloorState {
  today: string
  dayNumber: number
  floorHabits: FloorHabitDefinition[]
  stackHabits: FloorHabitDefinition[]
  completedIds: Set<string>
  floorCompleted: boolean
  score7: ConsistencyScore
  score30: ConsistencyScore
  toggle: (habitId: string) => Promise<void>
  completeFloor: () => Promise<void>
}

/**
 * Everything the Today screen needs about the floor.
 *
 * Reads go through Dexie live queries so a write from the quick-action sheet
 * refreshes the dashboard without any manual invalidation.
 */
export function useFloor(): FloorState {
  const today = toLogicalDate()
  const habits = useSettingsStore((state) => state.habits)
  const proteinTargetGrams = useSettingsStore((state) => state.settings.proteinTargetGrams)
  const installedAt = useSettingsStore((state) => state.settings.installedAt)
  const installedOn = useMemo(() => toLogicalDate(new Date(installedAt)), [installedAt])

  const floorHabits = useMemo(() => selectHabits(habits, 'floor'), [habits])
  const stackHabits = useMemo(() => selectHabits(habits, 'stack'), [habits])

  const completedIds =
    useLiveQuery(() => completedHabitIds(today), [today], new Set<string>()) ?? new Set<string>()

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
        proteinTargetGrams,
      ),
    [today, floorHabits, proteinTargetGrams],
  )

  const toggle = useCallback(
    async (habitId: string) => {
      const nowComplete = await toggleHabit(habitId, today)
      await sync()
      if (nowComplete) haptic()
    },
    [today, sync],
  )

  const completeFloor = useCallback(async () => {
    await completeHabits(
      floorHabits.map((habit) => habit.id),
      today,
    )
    await sync()
    haptic(40)
  }, [floorHabits, today, sync])

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
    completeFloor,
  }
}
