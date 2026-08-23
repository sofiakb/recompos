import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RecompDb, seedDatabase } from '@/db/dexie'
import {
  activeSession,
  addCustomExercise,
  deleteCustomExercise,
  discardEmptySession,
  endSession,
  exercisesByPattern,
  lastSetForExercise,
  lastSetsByExercise,
  logSet,
  recentSessions,
  setsForDate,
  setsForSession,
  setsSince,
  startSession,
} from '@/db/repositories/workoutRepository'

const TODAY = '2026-08-22'

let db: RecompDb

beforeEach(async () => {
  db = new RecompDb(`test-${Math.random().toString(36).slice(2)}`)
  await db.open()
  await seedDatabase(db)
})

afterEach(async () => {
  await db.delete()
})

describe('exercise catalog', () => {
  it('groups the seeded movements by pattern', async () => {
    const push = await exercisesByPattern('push', db)
    expect(push.length).toBeGreaterThan(0)
    expect(push.every((exercise) => exercise.pattern === 'push')).toBe(true)
  })

  it('adds a custom exercise alongside the seeded ones', async () => {
    const custom = await addCustomExercise('Dips sur chaise', 'push', [6, 12], db)
    expect(custom.isCustom).toBe(true)
    expect((await exercisesByPattern('push', db)).map((e) => e.id)).toContain(custom.id)
  })
})

describe('sessions', () => {
  it('reports the running session and clears it once ended', async () => {
    const session = await startSession('20min_circuit', TODAY, db)
    expect((await activeSession(db))?.id).toBe(session.id)

    await endSession(session.id, db)
    expect(await activeSession(db)).toBeNull()
  })

  it('stores a duration when the session ends', async () => {
    const session = await startSession('20min_circuit', TODAY, db)
    const ended = await endSession(session.id, db)
    expect(ended?.endedAt).toBeTruthy()
    expect(ended?.durationMinutes).toBeGreaterThanOrEqual(0)
  })

  it('returns the most recent open session, not the oldest', async () => {
    const stale = await startSession('20min_circuit', '2026-08-01', db)
    await db.sessions.update(stale.id, { startedAt: '2026-08-01T10:00:00.000Z' })
    const current = await startSession('20min_circuit', TODAY, db)
    expect((await activeSession(db))?.id).toBe(current.id)
  })

  it('discards a session that recorded nothing', async () => {
    const session = await startSession('20min_circuit', TODAY, db)
    expect(await discardEmptySession(session.id, db)).toBe(true)
    expect(await db.sessions.get(session.id)).toBeUndefined()
  })

  it('keeps a session that recorded a set', async () => {
    const session = await startSession('20min_circuit', TODAY, db)
    await logSet(
      {
        exerciseId: 'pushup',
        reps: 10,
        loadOrResistance: 'Poids du corps',
        difficulty: 'target',
        sessionId: session.id,
        date: TODAY,
      },
      db,
    )
    expect(await discardEmptySession(session.id, db)).toBe(false)
    expect(await db.sessions.get(session.id)).toBeTruthy()
  })

  it('lists only finished sessions, newest first', async () => {
    const first = await startSession('20min_circuit', '2026-08-20', db)
    await endSession(first.id, db)
    const open = await startSession('micro_sets', TODAY, db)

    const listed = await recentSessions(10, db)
    expect(listed.map((session) => session.id)).toEqual([first.id])
    expect(listed.map((session) => session.id)).not.toContain(open.id)
  })
})

describe('sets', () => {
  it('logs a micro-set with no session attached', async () => {
    const set = await logSet(
      {
        exerciseId: 'pushup',
        reps: 12,
        loadOrResistance: 'Poids du corps',
        difficulty: 'easy',
        date: TODAY,
      },
      db,
    )
    expect(set.sessionId).toBeUndefined()
    expect(await setsForDate(TODAY, db)).toHaveLength(1)
  })

  it('rounds and floors the reps at one', async () => {
    const set = await logSet(
      {
        exerciseId: 'pushup',
        reps: 0,
        loadOrResistance: '',
        difficulty: 'hard',
        date: TODAY,
      },
      db,
    )
    expect(set.reps).toBe(1)
  })

  it('returns the newest set for an exercise', async () => {
    await db.sets.bulkAdd([
      {
        id: 'old',
        exerciseId: 'pushup',
        reps: 8,
        loadOrResistance: '',
        difficulty: 'target',
        date: '2026-08-20',
        timestamp: '2026-08-20T10:00:00.000Z',
      },
      {
        id: 'new',
        exerciseId: 'pushup',
        reps: 12,
        loadOrResistance: '',
        difficulty: 'easy',
        date: TODAY,
        timestamp: '2026-08-22T10:00:00.000Z',
      },
    ])
    expect((await lastSetForExercise('pushup', db))?.id).toBe('new')
    expect(await lastSetForExercise('goblet-squat', db)).toBeNull()
  })

  it('maps the last set of several movements at once', async () => {
    await logSet(
      { exerciseId: 'pushup', reps: 10, loadOrResistance: '', difficulty: 'target', date: TODAY },
      db,
    )
    const map = await lastSetsByExercise(['pushup', 'goblet-squat'], db)
    expect(map.get('pushup')?.reps).toBe(10)
    expect(map.has('goblet-squat')).toBe(false)
  })

  it('keeps a session’s sets in the order they were logged', async () => {
    const session = await startSession('20min_circuit', TODAY, db)
    await logSet(
      {
        exerciseId: 'pushup',
        reps: 10,
        loadOrResistance: '',
        difficulty: 'target',
        sessionId: session.id,
        date: TODAY,
      },
      db,
    )
    await logSet(
      {
        exerciseId: 'band-row',
        reps: 12,
        loadOrResistance: '',
        difficulty: 'easy',
        sessionId: session.id,
        date: TODAY,
      },
      db,
    )
    const sets = await setsForSession(session.id, db)
    expect(sets.map((set) => set.exerciseId)).toEqual(['pushup', 'band-row'])
  })

  it('windows sets by date for the strength index', async () => {
    await db.sets.bulkAdd([
      {
        id: 'a',
        exerciseId: 'pushup',
        reps: 8,
        loadOrResistance: '',
        difficulty: 'target',
        date: '2026-05-01',
        timestamp: '2026-05-01T10:00:00.000Z',
      },
      {
        id: 'b',
        exerciseId: 'pushup',
        reps: 10,
        loadOrResistance: '',
        difficulty: 'target',
        date: '2026-08-01',
        timestamp: '2026-08-01T10:00:00.000Z',
      },
    ])
    expect((await setsSince('2026-07-01', TODAY, db)).map((set) => set.id)).toEqual(['b'])
  })
})

describe('deleteCustomExercise', () => {
  it('removes a custom movement nothing points at', async () => {
    const custom = await addCustomExercise('Dips', 'push', [6, 12], db)
    expect(await deleteCustomExercise(custom.id, db)).toBe('deleted')
    expect(await db.exercises.get(custom.id)).toBeUndefined()
  })

  it('refuses to delete a seeded movement', async () => {
    expect(await deleteCustomExercise('pushup', db)).toBe('not_custom')
    expect(await db.exercises.get('pushup')).toBeTruthy()
  })

  it('refuses to orphan sets that already reference it', async () => {
    const custom = await addCustomExercise('Dips', 'push', [6, 12], db)
    await logSet(
      {
        exerciseId: custom.id,
        reps: 8,
        loadOrResistance: '',
        difficulty: 'target',
        date: TODAY,
      },
      db,
    )
    expect(await deleteCustomExercise(custom.id, db)).toBe('in_use')
    expect(await db.exercises.get(custom.id)).toBeTruthy()
  })

  it('reports an unknown id as not custom rather than throwing', async () => {
    expect(await deleteCustomExercise('nope', db)).toBe('not_custom')
  })
})
