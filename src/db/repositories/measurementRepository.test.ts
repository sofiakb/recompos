import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RecompDb } from '@/db/dexie'
import {
  isWeighInDue,
  logWaist,
  logWeight,
  recentWaists,
  recentWeights,
} from '@/db/repositories/measurementRepository'
import { MIN_WAIST_CM } from '@/lib/nutrition'

const TODAY = '2026-08-22'

let db: RecompDb

beforeEach(async () => {
  db = new RecompDb(`test-${Math.random().toString(36).slice(2)}`)
  await db.open()
})

afterEach(async () => {
  await db.delete()
})

describe('logWeight', () => {
  it('keeps one row per day, overwriting a same-day correction', async () => {
    await logWeight(80, TODAY, db)
    await logWeight(80.6, TODAY, db)

    const rows = await recentWeights(10, db)
    expect(rows).toHaveLength(1)
    expect(rows[0].weightKg).toBe(80.6)
  })

  it('preserves a waist measurement already stored that day', async () => {
    await db.measurements.put({
      id: 'm1',
      date: TODAY,
      waistCm: 88,
      createdAt: '2026-08-22T08:00:00.000Z',
    })

    await logWeight(80, TODAY, db)

    const row = await db.measurements.get('m1')
    expect(row?.waistCm).toBe(88)
    expect(row?.weightKg).toBe(80)
  })

  it('clamps an implausible entry', async () => {
    await logWeight(900, TODAY, db)
    expect((await recentWeights(1, db))[0].weightKg).toBe(250)
  })
})

describe('recentWeights', () => {
  it('returns weigh-ins newest first', async () => {
    await logWeight(80, '2026-08-08', db)
    await logWeight(81, '2026-08-15', db)
    await logWeight(82, TODAY, db)

    expect((await recentWeights(10, db)).map((row) => row.weightKg)).toEqual([82, 81, 80])
  })

  it('ignores rows that only carry a waist measurement', async () => {
    await db.measurements.put({
      id: 'waist-only',
      date: '2026-08-10',
      waistCm: 88,
      createdAt: '2026-08-10T08:00:00.000Z',
    })
    await logWeight(80, TODAY, db)

    expect(await recentWeights(10, db)).toHaveLength(1)
  })
})

describe('isWeighInDue', () => {
  it('is due when nothing was ever logged', () => {
    expect(isWeighInDue(null, 7, TODAY)).toBe(true)
  })

  it('is not due the same day', () => {
    expect(isWeighInDue(TODAY, 7, TODAY)).toBe(false)
  })

  it('is not due before the interval elapses', () => {
    expect(isWeighInDue('2026-08-17', 7, TODAY)).toBe(false)
  })

  it('is due once the interval is reached', () => {
    expect(isWeighInDue('2026-08-15', 7, TODAY)).toBe(true)
  })
})

describe('logWaist', () => {
  it('shares the day’s row with the weight instead of adding a second one', async () => {
    await logWeight(79, '2026-08-22', db)
    await logWaist(88, '2026-08-22', db)

    const rows = await db.measurements.toArray()
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ weightKg: 79, waistCm: 88 })
  })

  it('does not wipe a waist already recorded that day when the weight is logged', async () => {
    await logWaist(88, '2026-08-22', db)
    await logWeight(79, '2026-08-22', db)
    expect((await db.measurements.toArray())[0]).toMatchObject({ weightKg: 79, waistCm: 88 })
  })

  it('clamps an implausible waist rather than storing it', async () => {
    const measurement = await logWaist(5, '2026-08-22', db)
    expect(measurement.waistCm).toBe(MIN_WAIST_CM)
  })

  it('lists only the days a waist was recorded, newest first', async () => {
    await logWeight(79, '2026-08-20', db)
    await logWaist(88, '2026-08-21', db)
    await logWaist(87, '2026-08-22', db)

    expect((await recentWaists(10, db)).map((row) => row.date)).toEqual([
      '2026-08-22',
      '2026-08-21',
    ])
  })
})
