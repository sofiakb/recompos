import type { MealEntry, ProteinLog } from '@/types/models'

export type JournalEntry =
  | { kind: 'protein'; id: string; timestamp: string; log: ProteinLog }
  | { kind: 'meal'; id: string; timestamp: string; meal: MealEntry }

/**
 * The day as one chronological list, protein entries and meals together.
 *
 * The trap it exists to avoid: a meal that carries protein owns a `ProteinLog`
 * of its own (`MealEntry.proteinLogId`), so merging both collections naively
 * shows the same food twice — once as a meal, once as its own protein row —
 * and reads as double-counting even though the total is right. That log is the
 * meal, so the meal is what gets shown.
 */
export function buildDayJournal(logs: ProteinLog[], meals: MealEntry[]): JournalEntry[] {
  const ownedByMeal = new Set(
    meals.map((meal) => meal.proteinLogId).filter((id): id is string => Boolean(id)),
  )

  const entries: JournalEntry[] = [
    ...logs
      .filter((log) => !ownedByMeal.has(log.id))
      .map((log) => ({ kind: 'protein' as const, id: log.id, timestamp: log.timestamp, log })),
    ...meals.map((meal) => ({
      kind: 'meal' as const,
      id: meal.id,
      timestamp: meal.timestamp,
      meal,
    })),
  ]

  // Newest first: the thing just logged should not be at the bottom of a scroll.
  return entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}
