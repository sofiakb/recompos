import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RecompDb, seedDatabase } from '@/db/dexie'
import {
  completeHabits,
  completedFloorDates,
  completedHabitIds,
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
})
