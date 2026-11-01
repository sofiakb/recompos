import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RecompDb } from '@/db/dexie'
import { readDigestRows } from '@/lib/coach/digestQuery'
import { week } from '@/lib/coach/fixtures'

let db: RecompDb
let dbCount = 0

beforeEach(async () => {
  db = new RecompDb(`test-digest-${++dbCount}`)
  await db.open()
})

afterEach(async () => {
  await db.delete()
})

describe('readDigestRows', () => {
  it('ne lit que la fenêtre des 7 jours', async () => {
    const [meal] = week([{ kcal: 2000 }]).meals
    await db.meals.bulkAdd([
      { ...meal, id: 'out', date: '2026-10-25' },
      { ...meal, id: 'in', date: '2026-10-26' },
      { ...meal, id: 'today', date: '2026-11-01' },
    ])
    const rows = await readDigestRows('2026-11-01', db)
    expect(rows.meals.map((m) => m.id).sort()).toEqual(['in', 'today'])
  })

  it('rend le dernier tour de taille, ou null', async () => {
    expect((await readDigestRows('2026-11-01', db)).latestWaist).toBeNull()
    await db.measurements.add({
      id: 'w',
      date: '2026-10-30',
      waistCm: 80,
      createdAt: '2026-10-30T07:00:00.000Z',
    })
    expect((await readDigestRows('2026-11-01', db)).latestWaist?.waistCm).toBe(80)
  })
})
