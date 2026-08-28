import { MEAL_SLOT_ORDER, slotForHour } from '@/lib/nutrition'
import type { MealEntry, MealSlot, ProteinLog } from '@/types/models'

export type JournalEntry =
  | { kind: 'protein'; id: string; timestamp: string; log: ProteinLog }
  | { kind: 'meal'; id: string; timestamp: string; meal: MealEntry }

export interface SlotGroup {
  slot: MealSlot
  /** Oldest first: a meal is read back in the order it was eaten. */
  entries: JournalEntry[]
  /** Only meals that finished analysing — one still pending has no numbers yet. */
  kcal: number
  /** Read off the protein ledger, never off the meals. See below. */
  proteinG: number
}

function emptyGroup(slot: MealSlot): SlotGroup {
  return { slot, entries: [], kcal: 0, proteinG: 0 }
}

/**
 * The day grouped by meal, four groups whether or not anything landed in them.
 *
 * The trap it exists to avoid: a meal that carries protein owns a `ProteinLog`
 * of its own (`MealEntry.proteinLogId`), so merging both collections naively
 * shows the same food twice — once as a meal, once as its own protein row — and
 * reads as double-counting even though the total is right. That log *is* the
 * meal, so the meal is what gets shown.
 *
 * Its grams still count, though, and they count in the meal's slot rather than
 * at whatever hour the log was written. Protein therefore always comes from the
 * ledger: sum the four groups and you get the day's total exactly, which is what
 * the band above the journal shows.
 *
 * Empty groups are kept: a dinner that has not happened yet is information —
 * « 0 / 560 kcal » is the whole point of a per-meal budget.
 */
export function buildSlotJournal(logs: ProteinLog[], meals: MealEntry[]): SlotGroup[] {
  const slotOfOwnedLog = new Map<string, MealSlot>()
  for (const meal of meals) {
    if (meal.proteinLogId) slotOfOwnedLog.set(meal.proteinLogId, meal.slot)
  }

  const groups: Record<MealSlot, SlotGroup> = {
    breakfast: emptyGroup('breakfast'),
    lunch: emptyGroup('lunch'),
    dinner: emptyGroup('dinner'),
    snack: emptyGroup('snack'),
  }

  for (const meal of meals) {
    const group = groups[meal.slot]
    group.entries.push({ kind: 'meal', id: meal.id, timestamp: meal.timestamp, meal })
    if (meal.status === 'done') group.kcal += meal.kcal
  }

  for (const log of logs) {
    const ownedBy = slotOfOwnedLog.get(log.id)
    const group = groups[ownedBy ?? slotForHour(new Date(log.timestamp).getHours())]
    group.proteinG += log.grams
    if (ownedBy === undefined) {
      group.entries.push({ kind: 'protein', id: log.id, timestamp: log.timestamp, log })
    }
  }

  for (const group of Object.values(groups)) {
    group.entries.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  }

  return MEAL_SLOT_ORDER.map((slot) => groups[slot])
}
