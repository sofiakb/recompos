import { describe, expect, it } from 'vitest'
import { buildDayJournal } from '@/features/nutrition/journal'
import type { MealEntry, ProteinLog } from '@/types/models'

function log(id: string, timestamp: string, grams = 30): ProteinLog {
  return { id, date: '2026-08-27', timestamp, grams, sourceType: 'meal' }
}

function meal(id: string, timestamp: string, proteinLogId?: string): MealEntry {
  return {
    id,
    date: '2026-08-27',
    timestamp,
    slot: 'lunch',
    label: 'Poulet, riz',
    items: [],
    kcal: 600,
    proteinG: 40,
    carbsG: 60,
    fatG: 20,
    confidence: 'medium',
    source: 'ai',
    status: 'done',
    proteinLogId,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

describe('buildDayJournal', () => {
  it('shows a meal once, not twice, when it owns a protein log', () => {
    const owned = log('p1', '2026-08-27T12:30:00.000Z', 40)
    const entries = buildDayJournal([owned], [meal('m1', '2026-08-27T12:30:00.000Z', 'p1')])

    // Both collections contain the same food. Showing both reads as
    // double-counting even though the day's total is correct.
    expect(entries).toHaveLength(1)
    expect(entries[0].kind).toBe('meal')
  })

  it('keeps a standalone protein entry', () => {
    const entries = buildDayJournal([log('p1', '2026-08-27T10:00:00.000Z')], [])

    expect(entries).toHaveLength(1)
    expect(entries[0].kind).toBe('protein')
  })

  it('keeps a meal that carries no protein and so owns no log', () => {
    const entries = buildDayJournal([], [meal('m1', '2026-08-27T12:00:00.000Z')])

    expect(entries).toHaveLength(1)
    expect(entries[0].kind).toBe('meal')
  })

  it('orders the whole day newest first', () => {
    const entries = buildDayJournal(
      [log('p1', '2026-08-27T08:00:00.000Z'), log('p2', '2026-08-27T16:00:00.000Z')],
      [meal('m1', '2026-08-27T12:00:00.000Z')],
    )

    expect(entries.map((entry) => entry.id)).toEqual(['p2', 'm1', 'p1'])
  })

  it('does not drop a log that merely shares its id shape with nothing', () => {
    // A meal with no proteinLogId must not hide unrelated entries.
    const entries = buildDayJournal(
      [log('p1', '2026-08-27T08:00:00.000Z')],
      [meal('m1', '2026-08-27T12:00:00.000Z', undefined)],
    )

    expect(entries).toHaveLength(2)
  })
})
