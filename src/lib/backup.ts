/**
 * Manual export and import (PRD §6.5).
 *
 * There is no account and no server, so this file is the only thing standing
 * between the user and a cleared browser storage. It is therefore written to be
 * boring: whole-table reads, an explicit shape check on the way back in, and a
 * replace that runs in one Dexie transaction so a half-applied import cannot
 * exist.
 */
import type { RecompDb } from '@/db/dexie'
import { migrateSettings } from '@/stores/settingsStore'
import {
  SCHEMA_VERSION,
  type AppSettings,
  type ExportBundle,
  type FloorHabitDefinition,
  type ProgressPhoto,
} from '@/types/models'

/** Above this, photos travel in their own file rather than bloating the main one. */
export const PHOTO_INLINE_LIMIT_BYTES = 5 * 1024 * 1024

export type SerializedPhoto = Omit<ProgressPhoto, 'bytes'> & { dataUrl: string }

export interface PhotoBundle {
  schemaVersion: number
  exportedAt: string
  photos: SerializedPhoto[]
}

export interface ExportResult {
  bundle: ExportBundle
  /** Non-null only when the photos were too big to inline. */
  photoBundle: PhotoBundle | null
}

/**
 * Base64 by hand rather than through `FileReader`.
 *
 * Synchronous, works off the raw bytes, and does not care which Blob
 * implementation the bytes came from.
 */
export function bytesToDataUrl(bytes: ArrayBuffer, mimeType: string): string {
  const view = new Uint8Array(bytes)
  // Chunked, because String.fromCharCode(...view) blows the argument limit on
  // anything bigger than a thumbnail.
  const CHUNK = 0x8000
  let binary = ''
  for (let i = 0; i < view.length; i += CHUNK) {
    binary += String.fromCharCode(...view.subarray(i, i + CHUNK))
  }
  return `data:${mimeType || 'application/octet-stream'};base64,${btoa(binary)}`
}

export function dataUrlToBytes(dataUrl: string): { bytes: ArrayBuffer; mimeType: string } {
  const [header, payload] = dataUrl.split(',')
  const mimeType = header.match(/data:([^;]+)/)?.[1] ?? 'application/octet-stream'
  const binary = atob(payload)
  const view = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i)
  return { bytes: view.buffer, mimeType }
}

export async function buildExport(
  settings: AppSettings,
  habits: FloorHabitDefinition[],
  database: RecompDb,
  now: string = new Date().toISOString(),
): Promise<ExportResult> {
  const [
    completions,
    dailyLogs,
    proteinLogs,
    sessions,
    sets,
    measurements,
    takeoutOptions,
    zeroCookItems,
    photoRows,
  ] = await Promise.all([
    database.habitCompletions.toArray(),
    database.dailyLogs.toArray(),
    database.proteinLogs.toArray(),
    database.sessions.toArray(),
    database.sets.toArray(),
    database.measurements.toArray(),
    database.takeoutOptions.toArray(),
    database.zeroCookItems.toArray(),
    database.photos.toArray(),
  ])

  const photos: SerializedPhoto[] = photoRows.map(({ bytes, ...rest }) => ({
    ...rest,
    dataUrl: bytesToDataUrl(bytes, rest.mimeType),
  }))
  const photoBytes = photoRows.reduce((total, photo) => total + photo.byteSize, 0)
  const inlinePhotos = photoBytes <= PHOTO_INLINE_LIMIT_BYTES

  const bundle: ExportBundle = {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: now,
    settings,
    habits,
    completions,
    dailyLogs,
    proteinLogs,
    sessions,
    sets,
    measurements,
    takeoutOptions,
    zeroCookItems,
    ...(inlinePhotos && photos.length > 0 ? { photos } : {}),
  }

  return {
    bundle,
    photoBundle:
      !inlinePhotos && photos.length > 0
        ? { schemaVersion: SCHEMA_VERSION, exportedAt: now, photos }
        : null,
  }
}

export type ValidationResult =
  | { ok: true; bundle: ExportBundle }
  | { ok: false; reason: 'not_json' | 'not_a_bundle' | 'future_version' }

const REQUIRED_ARRAYS = [
  'habits',
  'completions',
  'dailyLogs',
  'proteinLogs',
  'sessions',
  'sets',
  'measurements',
] as const

/**
 * Checks a parsed file before anything is written.
 *
 * An import replaces everything, so a malformed file must be refused loudly
 * rather than partially accepted — losing real data to a typo'd file would be
 * the worst bug this app could have.
 */
export function validateBundle(raw: unknown): ValidationResult {
  if (typeof raw !== 'object' || raw === null) return { ok: false, reason: 'not_a_bundle' }
  const candidate = raw as Partial<ExportBundle>

  if (typeof candidate.schemaVersion !== 'number') return { ok: false, reason: 'not_a_bundle' }
  if (typeof candidate.settings !== 'object' || candidate.settings === null) {
    return { ok: false, reason: 'not_a_bundle' }
  }
  if (REQUIRED_ARRAYS.some((key) => !Array.isArray(candidate[key]))) {
    return { ok: false, reason: 'not_a_bundle' }
  }
  // A newer schema may carry fields this build would silently drop on the next write.
  if (candidate.schemaVersion > SCHEMA_VERSION) return { ok: false, reason: 'future_version' }

  const migrated = migrateSettings(
    { settings: candidate.settings, habits: candidate.habits as FloorHabitDefinition[] },
    candidate.schemaVersion,
  )

  return {
    ok: true,
    bundle: {
      ...(candidate as ExportBundle),
      schemaVersion: SCHEMA_VERSION,
      settings: {
        ...migrated.settings,
        // A bundle written before the flag existed still proves the catalogs
        // were established; without this, the next launch would seed the
        // defaults back on top of an import that deliberately dropped them.
        catalogsSeededAt: migrated.settings.catalogsSeededAt ?? candidate.exportedAt,
      },
      habits: migrated.habits,
      takeoutOptions: candidate.takeoutOptions ?? [],
      zeroCookItems: candidate.zeroCookItems ?? [],
    },
  }
}

export function parseBundle(text: string): ValidationResult {
  try {
    return validateBundle(JSON.parse(text))
  } catch {
    return { ok: false, reason: 'not_json' }
  }
}

export interface ImportSummary {
  completions: number
  dailyLogs: number
  proteinLogs: number
  sessions: number
  sets: number
  measurements: number
  photos: number
}

/**
 * Replaces the database contents with a validated bundle.
 *
 * One transaction over every table: an import that fails halfway leaves the
 * previous data intact rather than a hybrid of two histories.
 */
export async function applyImport(
  bundle: ExportBundle,
  database: RecompDb,
  extraPhotos: SerializedPhoto[] = [],
): Promise<ImportSummary> {
  const serialized = [...(bundle.photos ?? []), ...extraPhotos]
  const photos: ProgressPhoto[] = serialized.map(({ dataUrl, ...rest }) => ({
    ...rest,
    bytes: dataUrlToBytes(dataUrl).bytes,
  }))

  const tables = [
    database.habitCompletions,
    database.dailyLogs,
    database.proteinLogs,
    database.sessions,
    database.sets,
    database.measurements,
    database.photos,
    database.takeoutOptions,
    database.zeroCookItems,
  ]

  await database.transaction('rw', tables, async () => {
    await Promise.all([
      database.habitCompletions.clear(),
      database.dailyLogs.clear(),
      database.proteinLogs.clear(),
      database.sessions.clear(),
      database.sets.clear(),
      database.measurements.clear(),
      database.photos.clear(),
      database.takeoutOptions.clear(),
      database.zeroCookItems.clear(),
    ])
    await Promise.all([
      database.habitCompletions.bulkAdd(bundle.completions),
      database.dailyLogs.bulkAdd(bundle.dailyLogs),
      database.proteinLogs.bulkAdd(bundle.proteinLogs),
      database.sessions.bulkAdd(bundle.sessions),
      database.sets.bulkAdd(bundle.sets),
      database.measurements.bulkAdd(bundle.measurements),
      database.photos.bulkAdd(photos),
      database.takeoutOptions.bulkAdd(bundle.takeoutOptions),
      database.zeroCookItems.bulkAdd(bundle.zeroCookItems),
    ])
  })

  return {
    completions: bundle.completions.length,
    dailyLogs: bundle.dailyLogs.length,
    proteinLogs: bundle.proteinLogs.length,
    sessions: bundle.sessions.length,
    sets: bundle.sets.length,
    measurements: bundle.measurements.length,
    photos: photos.length,
  }
}

/** A photo-only companion file, when one was produced. */
export function parsePhotoBundle(text: string): SerializedPhoto[] | null {
  try {
    const raw = JSON.parse(text) as Partial<PhotoBundle>
    return Array.isArray(raw.photos) ? raw.photos : null
  } catch {
    return null
  }
}

export function exportFileName(date: string, kind: 'data' | 'photos' = 'data'): string {
  const day = date.slice(0, 10)
  return kind === 'data' ? `recompos-${day}.json` : `recompos-photos-${day}.json`
}
