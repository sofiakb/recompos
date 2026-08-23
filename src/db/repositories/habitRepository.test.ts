import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RecompDb, seedDatabase } from '@/db/dexie'
import {
  completeHabits,
  completedFloorDates,
  completedHabitIds,
  completionDatesForHabit,
  habitHistory,
  refreshDailyLog,
  toggleHabit,
} from '@/db/repositories/habitRepository'

const TODAY = '2026-08-22'
const FLOOR = ['habit-pushups', 'habit-shake']

let db: RecompDb

beforeEach(async () => {
  db = new RecompDb(`test-${Math.random().toString(36).slice(2)}`)
  await db.open()
})

afterEach(async () => {
  await db.delete()
})

describe('toggleHabit', () => {
  it('checks then unchecks a habit for a day', async () => {
    expect(await toggleHabit(FLOOR[0], TODAY, db)).toBe(true)
    expect(await completedHabitIds(TODAY, db)).toEqual(new Set([FLOOR[0]]))

    expect(await toggleHabit(FLOOR[0], TODAY, db)).toBe(false)
    expect(await completedHabitIds(TODAY, db)).toEqual(new Set())
  })

  it('scopes completions to their own day', async () => {
    await toggleHabit(FLOOR[0], TODAY, db)
    expect(await completedHabitIds('2026-08-21', db)).toEqual(new Set())
  })
})

describe('completeHabits', () => {
  it('is idempotent on an already-checked habit', async () => {
    await toggleHabit(FLOOR[0], TODAY, db)
    await completeHabits(FLOOR, TODAY, db)
    await completeHabits(FLOOR, TODAY, db)

    expect(await db.habitCompletions.where('date').equals(TODAY).count()).toBe(2)
  })
})

describe('refreshDailyLog', () => {
  it('marks the floor complete only when every habit is done', async () => {
    await toggleHabit(FLOOR[0], TODAY, db)
    expect((await refreshDailyLog(TODAY, FLOOR, 150, db)).floorCompleted).toBe(false)

    await toggleHabit(FLOOR[1], TODAY, db)
    expect((await refreshDailyLog(TODAY, FLOOR, 150, db)).floorCompleted).toBe(true)
  })

  it('un-completes the day when a habit is unchecked again', async () => {
    await completeHabits(FLOOR, TODAY, db)
    await refreshDailyLog(TODAY, FLOOR, 150, db)

    await toggleHabit(FLOOR[0], TODAY, db)
    expect((await refreshDailyLog(TODAY, FLOOR, 150, db)).floorCompleted).toBe(false)
  })

  it('freezes the protein target of a day already written', async () => {
    await refreshDailyLog(TODAY, FLOOR, 150, db)
    // Raising the target later must not rewrite what past days were aiming at.
    const log = await refreshDailyLog(TODAY, FLOOR, 200, db)
    expect(log.proteinTargetGrams).toBe(150)
  })

  it('does not credit a day when there is no floor habit at all', async () => {
    expect((await refreshDailyLog(TODAY, [], 150, db)).floorCompleted).toBe(false)
  })
})

describe('completedFloorDates', () => {
  it('returns only completed days inside the window', async () => {
    await db.dailyLogs.bulkPut([
      { date: '2026-08-22', floorCompleted: true, totalProteinGrams: 0, proteinTargetGrams: 150 },
      { date: '2026-08-21', floorCompleted: false, totalProteinGrams: 0, proteinTargetGrams: 150 },
      { date: '2026-07-01', floorCompleted: true, totalProteinGrams: 0, proteinTargetGrams: 150 },
    ])

    expect(await completedFloorDates(7, TODAY, db)).toEqual(new Set(['2026-08-22']))
  })
})

describe('seedDatabase', () => {
  it('fills the catalogs once and leaves user edits alone', async () => {
    await seedDatabase(db)
    const exerciseCount = await db.exercises.count()
    expect(exerciseCount).toBeGreaterThan(0)

    await db.takeoutOptions.update('burger', { pick: 'Modifié par l’utilisateur' })
    await seedDatabase(db)

    expect(await db.exercises.count()).toBe(exerciseCount)
    expect((await db.takeoutOptions.get('burger'))?.pick).toBe('Modifié par l’utilisateur')
  })

  it('leaves a deliberately emptied catalog empty once seeding is recorded', async () => {
    await seedDatabase(db)
    await db.zeroCookItems.clear()

    // What the app does on every launch after the first one.
    await seedDatabase(db, true)

    expect(await db.zeroCookItems.count()).toBe(0)
  })

  it('still seeds a fresh install when nothing has been recorded', async () => {
    await seedDatabase(db, false)
    expect(await db.zeroCookItems.count()).toBeGreaterThan(0)
  })
})

describe('habitHistory', () => {
  it('counts every completion but only windows the dates', async () => {
    await db.habitCompletions.bulkAdd([
      { id: '1', habitId: FLOOR[0], date: '2026-08-20', completedAt: '2026-08-20T08:00:00.000Z' },
      { id: '2', habitId: FLOOR[0], date: '2026-08-21', completedAt: '2026-08-21T08:00:00.000Z' },
      { id: '3', habitId: FLOOR[0], date: '2026-01-04', completedAt: '2026-01-04T08:00:00.000Z' },
      { id: '4', habitId: FLOOR[1], date: '2026-08-21', completedAt: '2026-08-21T08:00:00.000Z' },
    ])

    const history = await habitHistory(FLOOR[0], 30, TODAY, db)
    expect(history.total).toBe(3)
    expect(history.dates).toEqual(new Set(['2026-08-20', '2026-08-21']))
    expect(history.firstDate).toBe('2026-01-04')
    expect(history.lastDate).toBe('2026-08-21')
  })

  it('reports a habit that was never validated', async () => {
    const history = await habitHistory(FLOOR[0], 30, TODAY, db)
    expect(history).toEqual({ total: 0, dates: new Set(), firstDate: null, lastDate: null })
  })

  it('never mixes one habit\u2019s completions into another\u2019s', async () => {
    await db.habitCompletions.add({
      id: '1',
      habitId: FLOOR[1],
      date: '2026-08-21',
      completedAt: '2026-08-21T08:00:00.000Z',
    })
    expect(await completionDatesForHabit(FLOOR[0], 30, TODAY, db)).toEqual(new Set())
    expect(await completionDatesForHabit(FLOOR[1], 30, TODAY, db)).toEqual(new Set(['2026-08-21']))
  })
})
