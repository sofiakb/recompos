/** Habit CRUD and ordering on the real store (PRD §6.1, jalon 4). */
import { beforeEach, describe, expect, it } from 'vitest'
import { selectArchivedHabits, selectHabits, useSettingsStore } from '@/stores/settingsStore'

const titles = (kind: 'floor' | 'stack') =>
  selectHabits(useSettingsStore.getState().habits, kind).map((habit) => habit.title)

describe('habit actions', () => {
  beforeEach(() => {
    // Reset to a known shape rather than relying on the seed staying still.
    const now = '2026-08-22T10:00:00.000Z'
    useSettingsStore.setState({
      habits: [
        {
          id: 'f1',
          title: 'Pompes',
          targetRepsOrAction: '5 pompes',
          category: 'workout',
          kind: 'floor',
          completionMode: 'toggle',
          order: 0,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'f2',
          title: 'Portion',
          targetRepsOrAction: 'au choix',
          category: 'nutrition',
          kind: 'floor',
          completionMode: 'protein_portion',
          order: 1,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 's1',
          title: 'Squats',
          targetRepsOrAction: '10 squats',
          category: 'workout',
          kind: 'stack',
          completionMode: 'toggle',
          order: 2,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 's2',
          title: 'Gainage',
          targetRepsOrAction: '2 min',
          category: 'mobility',
          kind: 'stack',
          completionMode: 'toggle',
          order: 3,
          createdAt: now,
          updatedAt: now,
        },
      ],
    })
  })

  it('appends a new habit after the last one', () => {
    useSettingsStore.getState().addHabit({
      title: 'Étirements',
      targetRepsOrAction: '3 min',
      category: 'mobility',
      kind: 'stack',
      completionMode: 'toggle',
    })
    expect(titles('stack')).toEqual(['Squats', 'Gainage', 'Étirements'])
  })

  it('renames a habit without touching its position', () => {
    useSettingsStore.getState().updateHabit('f1', { title: '10 pompes' })
    expect(titles('floor')).toEqual(['10 pompes', 'Portion'])
  })

  it('swaps two habits of the same kind', () => {
    useSettingsStore.getState().moveHabit('f2', -1)
    expect(titles('floor')).toEqual(['Portion', 'Pompes'])
  })

  it('never moves a habit past the edges of its group', () => {
    useSettingsStore.getState().moveHabit('f1', -1)
    expect(titles('floor')).toEqual(['Pompes', 'Portion'])
    useSettingsStore.getState().moveHabit('s2', 1)
    expect(titles('stack')).toEqual(['Squats', 'Gainage'])
  })

  it('reorders within a kind without disturbing the other list', () => {
    // f2 and s1 are numerically adjacent, so a naive order swap would cross lists.
    useSettingsStore.getState().moveHabit('f2', 1)
    expect(titles('floor')).toEqual(['Pompes', 'Portion'])
    expect(titles('stack')).toEqual(['Squats', 'Gainage'])
  })

  it('archives instead of deleting, keeping the habit recoverable', () => {
    useSettingsStore.getState().archiveHabit('s1')
    expect(titles('stack')).toEqual(['Gainage'])
    expect(selectArchivedHabits(useSettingsStore.getState().habits).map((h) => h.id)).toEqual([
      's1',
    ])
    expect(useSettingsStore.getState().habits).toHaveLength(4)
  })

  it('restores an archived habit at the end of its group', () => {
    useSettingsStore.getState().archiveHabit('s1')
    useSettingsStore.getState().restoreHabit('s1')
    expect(titles('stack')).toEqual(['Gainage', 'Squats'])
    expect(selectArchivedHabits(useSettingsStore.getState().habits)).toHaveLength(0)
  })

  it('ignores a move on an unknown habit', () => {
    expect(() => useSettingsStore.getState().moveHabit('nope', 1)).not.toThrow()
    expect(titles('floor')).toEqual(['Pompes', 'Portion'])
  })
})
