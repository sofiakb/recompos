import { afterEach, describe, expect, it } from 'vitest'
import Dexie from 'dexie'
import { RecompDb } from '@/db/dexie'

const NAME = 'test-coach-withdrawal'

afterEach(async () => {
  await Dexie.delete(NAME)
})

describe('retrait du coach', () => {
  it('ouvre une base laissée en version 4 par le coach, sans rien perdre d’autre', async () => {
    // What a phone looks like after opening the build with the coach.
    const old = new Dexie(NAME)
    old.version(3).stores({
      dailyLogs: 'date',
      favorites: 'id, &key, createdAt',
    })
    old.version(4).stores({ coachMessages: 'id, persona, date, timestamp' })
    await old.open()
    await old.table('dailyLogs').add({ date: '2026-11-01', floorCompleted: true })
    await old.table('coachMessages').add({ id: 'c1', persona: 'nutrition', date: '2026-11-01' })
    old.close()

    const db = new RecompDb(NAME)
    await db.open()
    expect(db.tables.map((table) => table.name)).not.toContain('coachMessages')
    expect(await db.dailyLogs.get('2026-11-01')).toMatchObject({ floorCompleted: true })
    db.close()
  })
})
