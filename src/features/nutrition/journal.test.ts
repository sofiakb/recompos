import { describe, expect, it } from 'vitest'
import { buildSlotJournal } from '@/features/nutrition/journal'
import type { MealEntry, MealSlot, ProteinLog } from '@/types/models'

function log(id: string, timestamp: string, grams = 30): ProteinLog {
  return { id, date: '2026-08-27', timestamp, grams, sourceType: 'meal' }
}

function meal(
  id: string,
  timestamp: string,
  options: {
    slot?: MealSlot
    proteinLogId?: string
    kcal?: number
    status?: MealEntry['status']
  } = {},
): MealEntry {
  return {
    id,
    date: '2026-08-27',
    timestamp,
    slot: options.slot ?? 'lunch',
    label: 'Poulet, riz',
    items: [],
    kcal: options.kcal ?? 600,
    proteinG: 40,
    carbsG: 60,
    fatG: 20,
    confidence: 'medium',
    source: 'ai',
    status: options.status ?? 'done',
    proteinLogId: options.proteinLogId,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

/** Local time, so the hour the grouping reads is the hour written here. */
function at(hour: number): string {
  return new Date(2026, 7, 27, hour, 0, 0).toISOString()
}

function bySlot(groups: ReturnType<typeof buildSlotJournal>, slot: MealSlot) {
  return groups.find((group) => group.slot === slot)
}

describe('buildSlotJournal', () => {
  it('always returns the four meals, in the order a day meets them', () => {
    const groups = buildSlotJournal([], [])

    expect(groups.map((group) => group.slot)).toEqual(['breakfast', 'lunch', 'dinner', 'snack'])
    // An empty dinner is information: « 0 / 560 kcal » is the point of a budget.
    expect(groups.every((group) => group.entries.length === 0)).toBe(true)
  })

  it('shows a meal once, not twice, when it owns a protein log', () => {
    const groups = buildSlotJournal(
      [log('p1', at(12), 40)],
      [meal('m1', at(12), { proteinLogId: 'p1' })],
    )
    const lunch = bySlot(groups, 'lunch')

    expect(lunch?.entries).toHaveLength(1)
    expect(lunch?.entries[0].kind).toBe('meal')
    // The grams still count — they just count once.
    expect(lunch?.proteinG).toBe(40)
  })

  it('counts a meal-owned log in the meal slot, not at the hour it was written', () => {
    // A dinner photographed at midnight is still dinner.
    const groups = buildSlotJournal(
      [log('p1', at(0), 40)],
      [meal('m1', at(0), { slot: 'dinner', proteinLogId: 'p1' })],
    )

    expect(bySlot(groups, 'dinner')?.proteinG).toBe(40)
    expect(bySlot(groups, 'breakfast')?.proteinG).toBe(0)
  })

  it('drops a standalone dose into the slot its hour falls in', () => {
    const groups = buildSlotJournal([log('p1', at(8), 25), log('p2', at(20), 35)], [])

    expect(bySlot(groups, 'breakfast')?.entries.map((entry) => entry.id)).toEqual(['p1'])
    expect(bySlot(groups, 'dinner')?.entries.map((entry) => entry.id)).toEqual(['p2'])
  })

  it('adds up to the day, so the band above the journal agrees with it', () => {
    const logs = [log('p1', at(8), 25), log('p2', at(12), 40)]
    const groups = buildSlotJournal(logs, [meal('m1', at(12), { proteinLogId: 'p2' })])
    const total = groups.reduce((sum, group) => sum + group.proteinG, 0)

    expect(total).toBe(65)
  })

  it('leaves a meal still being analysed out of the slot total', () => {
    const groups = buildSlotJournal([], [meal('m1', at(12), { status: 'analysing', kcal: 600 })])
    const lunch = bySlot(groups, 'lunch')

    // The row shows « Analyse en cours… »; its numbers are not numbers yet.
    expect(lunch?.kcal).toBe(0)
    expect(lunch?.entries).toHaveLength(1)
  })

  it('orders each slot oldest first', () => {
    const groups = buildSlotJournal([log('p1', at(13)), log('p2', at(11))], [meal('m1', at(12))])

    expect(bySlot(groups, 'lunch')?.entries.map((entry) => entry.id)).toEqual(['p2', 'm1', 'p1'])
  })
})
