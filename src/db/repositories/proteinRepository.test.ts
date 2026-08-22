import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RecompDb } from '@/db/dexie'
import {
  addProteinLog,
  refreshProteinTotal,
  removeProteinLog,
  totalProteinForDate,
} from '@/db/repositories/proteinRepository'

const TODAY = '2026-08-22'
const TARGET = 145

let db: RecompDb

beforeEach(async () => {
  db = new RecompDb(`test-${Math.random().toString(36).slice(2)}`)
  await db.open()
})

afterEach(async () => {
  await db.delete()
})

describe('addProteinLog', () => {
  it('accumulates grams across logs of the day', async () => {
    await addProteinLog(26, 'zero_cook', TARGET, { date: TODAY }, db)
    await addProteinLog(30, 'meal', TARGET, { date: TODAY }, db)

    expect(await totalProteinForDate(TODAY, db)).toBe(56)
    expect((await db.dailyLogs.get(TODAY))?.totalProteinGrams).toBe(56)
  })

  it('keeps each day separate', async () => {
    await addProteinLog(26, 'zero_cook', TARGET, { date: TODAY }, db)
    await addProteinLog(40, 'meal', TARGET, { date: '2026-08-21' }, db)

    expect(await totalProteinForDate(TODAY, db)).toBe(26)
  })

  it('freezes the day target on first write', async () => {
    await addProteinLog(20, 'meal', 145, { date: TODAY }, db)
    await addProteinLog(20, 'meal', 200, { date: TODAY }, db)

    expect((await db.dailyLogs.get(TODAY))?.proteinTargetGrams).toBe(145)
  })

  it('rounds and never records negative grams', async () => {
    await addProteinLog(20.4, 'meal', TARGET, { date: TODAY }, db)
    await addProteinLog(-50, 'meal', TARGET, { date: TODAY }, db)

    expect(await totalProteinForDate(TODAY, db)).toBe(20)
  })
})

describe('removeProteinLog', () => {
  it('withdraws the grams from the day total', async () => {
    const log = await addProteinLog(26, 'zero_cook', TARGET, { date: TODAY }, db)
    await addProteinLog(30, 'meal', TARGET, { date: TODAY }, db)

    await removeProteinLog(log.id, TARGET, db)

    expect(await totalProteinForDate(TODAY, db)).toBe(30)
    expect((await db.dailyLogs.get(TODAY))?.totalProteinGrams).toBe(30)
  })

  it('is a no-op on an unknown id', async () => {
    await addProteinLog(26, 'zero_cook', TARGET, { date: TODAY }, db)
    await removeProteinLog('nope', TARGET, db)
    expect(await totalProteinForDate(TODAY, db)).toBe(26)
  })
})

describe('refreshProteinTotal', () => {
  it('recomputes from the logs rather than trusting the stored aggregate', async () => {
    await addProteinLog(26, 'zero_cook', TARGET, { date: TODAY }, db)
    // Simulate a stale or corrupted aggregate.
    await db.dailyLogs.update(TODAY, { totalProteinGrams: 999 })

    expect(await refreshProteinTotal(TODAY, TARGET, db)).toBe(26)
  })

  it('preserves the floor flag it did not compute', async () => {
    await db.dailyLogs.put({
      date: TODAY,
      floorCompleted: true,
      totalProteinGrams: 0,
      proteinTargetGrams: TARGET,
    })

    await addProteinLog(26, 'zero_cook', TARGET, { date: TODAY }, db)

    expect((await db.dailyLogs.get(TODAY))?.floorCompleted).toBe(true)
  })
})
