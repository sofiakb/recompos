import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RecompDb } from '@/db/dexie'
import {
  addCoachMessage,
  coachThread,
  pruneCoachMessages,
  recentExchanges,
} from '@/db/repositories/coachRepository'

let db: RecompDb
let dbCount = 0

beforeEach(async () => {
  db = new RecompDb(`test-coach-${++dbCount}`)
  await db.open()
})

afterEach(async () => {
  await db.delete()
})

/** Noon, so the 04h00 rollover never moves the logical day under the test. */
const at = (iso: string) => new Date(`${iso}T12:00:00`)

describe('coachRepository', () => {
  it('rend le fil du plus ancien au plus récent', async () => {
    await addCoachMessage({ persona: 'nutrition', role: 'user', text: 'b' }, at('2026-11-02'), db)
    await addCoachMessage({ persona: 'nutrition', role: 'user', text: 'a' }, at('2026-11-01'), db)
    expect((await coachThread('nutrition', db)).map((m) => m.text)).toEqual(['a', 'b'])
  })

  it('date un message sur la journée logique', async () => {
    const late = new Date('2026-11-02T02:30:00')
    const message = await addCoachMessage(
      { persona: 'nutrition', role: 'user', text: 'nuit' },
      late,
      db,
    )
    expect(message.date).toBe('2026-11-01')
  })

  it("purge au-delà de 7 jours, aujourd'hui compris dans les 7", async () => {
    await addCoachMessage(
      { persona: 'nutrition', role: 'user', text: 'vieux' },
      at('2026-10-25'),
      db,
    )
    await addCoachMessage(
      { persona: 'nutrition', role: 'user', text: 'limite' },
      at('2026-10-26'),
      db,
    )
    const removed = await pruneCoachMessages(at('2026-11-01'), db)
    expect(removed).toBe(1)
    expect((await coachThread('nutrition', db)).map((m) => m.text)).toEqual(['limite'])
  })

  it("écarte les réponses synthétiques de l'historique envoyé au modèle", async () => {
    await addCoachMessage({ persona: 'nutrition', role: 'user', text: 'q1' }, at('2026-11-01'), db)
    await addCoachMessage(
      { persona: 'nutrition', role: 'coach', text: 'fixe', synthetic: true },
      at('2026-11-01'),
      db,
    )
    const history = await recentExchanges('nutrition', 8, db)
    expect(history.map((m) => m.text)).toEqual(['q1'])
  })

  it('ne garde que les N derniers messages', async () => {
    for (let i = 0; i < 12; i++) {
      await addCoachMessage(
        { persona: 'nutrition', role: 'user', text: String(i) },
        new Date(at('2026-11-01').getTime() + i * 1000),
        db,
      )
    }
    const history = await recentExchanges('nutrition', 8, db)
    expect(history.map((m) => m.text)).toEqual(['4', '5', '6', '7', '8', '9', '10', '11'])
  })
})
