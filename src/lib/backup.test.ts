import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RecompDb, seedDatabase } from '@/db/dexie'
import {
  applyImport,
  buildExport,
  bytesToDataUrl,
  dataUrlToBytes,
  exportFileName,
  parseBundle,
  parsePhotoBundle,
  validateBundle,
} from '@/lib/backup'
import { SCHEMA_VERSION, type AppSettings, type FloorHabitDefinition } from '@/types/models'

const SETTINGS: AppSettings = {
  schemaVersion: SCHEMA_VERSION,
  installedAt: '2026-08-01T09:00:00.000Z',
  proteinTargetMode: 'auto',
  locale: 'fr',
  restTimerDefaultSeconds: 60,
  hapticsEnabled: true,
  soundEnabled: true,
}

const HABITS: FloorHabitDefinition[] = [
  {
    id: 'h1',
    title: '5 pompes',
    targetRepsOrAction: '5 pompes',
    category: 'workout',
    kind: 'floor',
    completionMode: 'toggle',
    order: 0,
    createdAt: '2026-08-01T09:00:00.000Z',
    updatedAt: '2026-08-01T09:00:00.000Z',
  },
]

let db: RecompDb

async function fillDatabase() {
  await seedDatabase(db)
  await db.habitCompletions.add({
    id: 'c1',
    habitId: 'h1',
    date: '2026-08-22',
    completedAt: '2026-08-22T08:00:00.000Z',
  })
  await db.dailyLogs.add({
    date: '2026-08-22',
    floorCompleted: true,
    totalProteinGrams: 63,
    proteinTargetGrams: 140,
  })
  await db.proteinLogs.add({
    id: 'p1',
    date: '2026-08-22',
    timestamp: '2026-08-22T12:00:00.000Z',
    grams: 63,
    sourceType: 'zero_cook',
  })
  await db.sets.add({
    id: 's1',
    exerciseId: 'pushup',
    reps: 12,
    loadOrResistance: 'Poids du corps',
    difficulty: 'target',
    date: '2026-08-22',
    timestamp: '2026-08-22T18:00:00.000Z',
  })
  await db.measurements.add({
    id: 'm1',
    date: '2026-08-22',
    weightKg: 79,
    waistCm: 88,
    createdAt: '2026-08-22T08:00:00.000Z',
  })
}

beforeEach(async () => {
  db = new RecompDb(`test-${Math.random().toString(36).slice(2)}`)
  await db.open()
})

afterEach(async () => {
  await db.delete()
})

describe('buildExport', () => {
  it('captures every table plus the settings and habits', async () => {
    await fillDatabase()
    const { bundle, photoBundle } = await buildExport(SETTINGS, HABITS, db)

    expect(bundle.schemaVersion).toBe(SCHEMA_VERSION)
    expect(bundle.settings).toEqual(SETTINGS)
    expect(bundle.habits).toEqual(HABITS)
    expect(bundle.completions).toHaveLength(1)
    expect(bundle.proteinLogs).toHaveLength(1)
    expect(bundle.sets).toHaveLength(1)
    expect(bundle.measurements[0].waistCm).toBe(88)
    expect(bundle.zeroCookItems.length).toBeGreaterThan(0)
    expect(photoBundle).toBeNull()
  })

  it('inlines small photos and keeps them round-trippable', async () => {
    const bytes = new Uint8Array([1, 2, 3, 4]).buffer
    await db.photos.add({
      id: 'ph1',
      date: '2026-08-01',
      bytes,
      mimeType: 'image/webp',
      angle: 'front',
      widthPx: 1200,
      heightPx: 1600,
      byteSize: 4,
      createdAt: '2026-08-01T09:00:00.000Z',
    })

    const { bundle, photoBundle } = await buildExport(SETTINGS, HABITS, db)
    expect(photoBundle).toBeNull()
    expect(bundle.photos).toHaveLength(1)
    expect(bundle.photos?.[0].dataUrl.startsWith('data:image/webp')).toBe(true)
  })

  it('moves photos to their own file once they get big', async () => {
    await db.photos.add({
      id: 'ph1',
      date: '2026-08-01',
      bytes: new Uint8Array(16).buffer,
      mimeType: 'image/webp',
      angle: 'front',
      widthPx: 1200,
      heightPx: 1600,
      // The stored size drives the decision, so a large photo can be simulated
      // without allocating six megabytes in a test.
      byteSize: 6 * 1024 * 1024,
      createdAt: '2026-08-01T09:00:00.000Z',
    })

    const { bundle, photoBundle } = await buildExport(SETTINGS, HABITS, db)
    expect(bundle.photos).toBeUndefined()
    expect(photoBundle?.photos).toHaveLength(1)
  })
})

describe('validateBundle', () => {
  it('accepts a bundle this build produced', async () => {
    await fillDatabase()
    const { bundle } = await buildExport(SETTINGS, HABITS, db)
    const result = validateBundle(JSON.parse(JSON.stringify(bundle)))
    expect(result.ok).toBe(true)
  })

  it('refuses anything that is not a bundle', () => {
    expect(validateBundle(null)).toEqual({ ok: false, reason: 'not_a_bundle' })
    expect(validateBundle({ hello: 'world' })).toEqual({ ok: false, reason: 'not_a_bundle' })
    expect(validateBundle({ schemaVersion: 2, settings: {} })).toEqual({
      ok: false,
      reason: 'not_a_bundle',
    })
  })

  it('refuses a file written by a newer version', () => {
    expect(
      validateBundle({
        schemaVersion: SCHEMA_VERSION + 1,
        settings: SETTINGS,
        habits: [],
        completions: [],
        dailyLogs: [],
        proteinLogs: [],
        sessions: [],
        sets: [],
        measurements: [],
      }),
    ).toEqual({ ok: false, reason: 'future_version' })
  })

  it('migrates an older bundle on the way in', () => {
    const result = validateBundle({
      schemaVersion: 1,
      settings: { ...SETTINGS, schemaVersion: 1, proteinTargetGrams: 160 },
      habits: [],
      completions: [],
      dailyLogs: [],
      proteinLogs: [],
      sessions: [],
      sets: [],
      measurements: [],
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.bundle.schemaVersion).toBe(SCHEMA_VERSION)
    expect(result.bundle.settings.proteinTargetMode).toBe('manual')
    expect(result.bundle.settings.manualProteinTargetGrams).toBe(160)
  })

  it('reports unparseable text rather than throwing', () => {
    expect(parseBundle('{ not json')).toEqual({ ok: false, reason: 'not_json' })
  })
})

describe('applyImport', () => {
  it('round-trips a full database through export and import', async () => {
    await fillDatabase()
    const { bundle } = await buildExport(SETTINGS, HABITS, db)
    const serialized = JSON.stringify(bundle)

    const target = new RecompDb(`test-${Math.random().toString(36).slice(2)}`)
    await target.open()
    try {
      const parsed = parseBundle(serialized)
      expect(parsed.ok).toBe(true)
      if (!parsed.ok) return

      const summary = await applyImport(parsed.bundle, target)
      expect(summary.completions).toBe(1)
      expect(summary.sets).toBe(1)
      expect(await target.proteinLogs.get('p1')).toMatchObject({ grams: 63 })
      expect(await target.dailyLogs.get('2026-08-22')).toMatchObject({ floorCompleted: true })
      expect((await target.measurements.get('m1'))?.weightKg).toBe(79)
    } finally {
      await target.delete()
    }
  })

  it('replaces rather than merges, so an import is the file and nothing else', async () => {
    await fillDatabase()
    const { bundle } = await buildExport(SETTINGS, HABITS, db)

    await db.proteinLogs.add({
      id: 'stale',
      date: '2026-08-23',
      timestamp: '2026-08-23T12:00:00.000Z',
      grams: 30,
      sourceType: 'meal',
    })
    await applyImport(bundle, db)

    expect(await db.proteinLogs.get('stale')).toBeUndefined()
    expect(await db.proteinLogs.count()).toBe(1)
  })

  it('restores photos from a companion file', async () => {
    const dataUrl = bytesToDataUrl(new Uint8Array([9, 9, 9]).buffer, 'image/webp')
    const { bundle } = await buildExport(SETTINGS, HABITS, db)

    const photoFile = JSON.stringify({
      schemaVersion: SCHEMA_VERSION,
      exportedAt: bundle.exportedAt,
      photos: [
        {
          id: 'ph1',
          date: '2026-08-01',
          mimeType: 'image/webp',
          angle: 'front',
          widthPx: 1200,
          heightPx: 1600,
          byteSize: 3,
          createdAt: '2026-08-01T09:00:00.000Z',
          dataUrl,
        },
      ],
    })

    const photos = parsePhotoBundle(photoFile)
    expect(photos).toHaveLength(1)
    const summary = await applyImport(bundle, db, photos ?? [])
    expect(summary.photos).toBe(1)
    expect((await db.photos.get('ph1'))?.bytes.byteLength).toBe(3)
  })
})

describe('dataUrlToBytes', () => {
  it('restores the bytes and the mime type', () => {
    const original = new Uint8Array([1, 2, 3]).buffer
    const restored = dataUrlToBytes(bytesToDataUrl(original, 'image/webp'))
    expect(restored.mimeType).toBe('image/webp')
    expect([...new Uint8Array(restored.bytes)]).toEqual([1, 2, 3])
  })

  it('survives a payload larger than the chunking limit', () => {
    const big = new Uint8Array(70_000).map((_, index) => index % 256).buffer
    const restored = dataUrlToBytes(bytesToDataUrl(big, 'image/webp'))
    expect(restored.bytes.byteLength).toBe(70_000)
  })
})

describe('exportFileName', () => {
  it('names the files by day', () => {
    expect(exportFileName('2026-08-22T18:00:00.000Z')).toBe('recompos-2026-08-22.json')
    expect(exportFileName('2026-08-22T18:00:00.000Z', 'photos')).toBe(
      'recompos-photos-2026-08-22.json',
    )
  })
})
