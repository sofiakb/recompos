import { describe, expect, it } from 'vitest'
import { canPostpone, nextFloorHabit, pendingHabits } from '@/features/today/queue'
import type { FloorHabitDefinition } from '@/types/models'

function habit(id: string, order: number): FloorHabitDefinition {
  return {
    id,
    title: `Habitude ${id}`,
    targetRepsOrAction: 'action',
    category: 'workout',
    kind: 'floor',
    completionMode: 'toggle',
    order,
    createdAt: '2026-08-27T08:00:00.000Z',
    updatedAt: '2026-08-27T08:00:00.000Z',
  }
}

const HABITS = [habit('a', 0), habit('b', 1), habit('c', 2)]
const none = new Set<string>()

describe('nextFloorHabit', () => {
  it('offers the first habit still to do', () => {
    expect(nextFloorHabit(HABITS, none, none)?.id).toBe('a')
  })

  it('skips what is already done', () => {
    expect(nextFloorHabit(HABITS, new Set(['a']), none)?.id).toBe('b')
  })

  it('skips what was postponed', () => {
    expect(nextFloorHabit(HABITS, none, new Set(['a']))?.id).toBe('b')
  })

  it('wraps rather than emptying when everything is postponed', () => {
    // An empty hero card reads as "floor done". On a day where nothing was
    // done that would be a lie, so the queue comes back round instead.
    expect(nextFloorHabit(HABITS, none, new Set(['a', 'b', 'c']))?.id).toBe('a')
  })

  it('is null only when the floor is actually complete', () => {
    expect(nextFloorHabit(HABITS, new Set(['a', 'b', 'c']), none)).toBeNull()
  })

  it('does not resurrect a completed habit that was also postponed', () => {
    expect(nextFloorHabit(HABITS, new Set(['a', 'b']), new Set(['c']))?.id).toBe('c')
  })
})

describe('pendingHabits', () => {
  it('keeps the configured order', () => {
    expect(pendingHabits(HABITS, new Set(['b'])).map((h) => h.id)).toEqual(['a', 'c'])
  })
})

describe('canPostpone', () => {
  it('is false on the last habit, which has nowhere to go', () => {
    expect(canPostpone(HABITS, new Set(['a', 'b']))).toBe(false)
  })

  it('is false on an empty floor', () => {
    expect(canPostpone(HABITS, new Set(['a', 'b', 'c']))).toBe(false)
  })

  it('is true while more than one is left', () => {
    expect(canPostpone(HABITS, new Set(['a']))).toBe(true)
  })
})
