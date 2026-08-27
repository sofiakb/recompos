import type { FloorHabitDefinition } from '@/types/models'

/** Floor habits still to do, in their configured order. */
export function pendingHabits(
  habits: FloorHabitDefinition[],
  completedIds: Set<string>,
): FloorHabitDefinition[] {
  return habits.filter((habit) => !completedIds.has(habit.id))
}

/**
 * The one habit the hero card shows.
 *
 * Postponing is a view preference, never a write. When every pending habit has
 * been postponed the queue wraps rather than emptying: an empty hero card would
 * read as "floor done" on a day where nothing was done.
 */
export function nextFloorHabit(
  habits: FloorHabitDefinition[],
  completedIds: Set<string>,
  postponedIds: Set<string>,
): FloorHabitDefinition | null {
  const pending = pendingHabits(habits, completedIds)
  return pending.find((habit) => !postponedIds.has(habit.id)) ?? pending[0] ?? null
}

/** Whether postponing would move anywhere. One habit left has nowhere to go. */
export function canPostpone(habits: FloorHabitDefinition[], completedIds: Set<string>): boolean {
  return pendingHabits(habits, completedIds).length > 1
}
