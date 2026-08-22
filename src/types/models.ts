/**
 * Data model for RecompOS (PRD §8).
 *
 * Every entity carries its own id and timestamps so that the manual JSON
 * export/import round-trips without guesswork, and so a habit definition can be
 * archived instead of deleted (deleting one would punch a hole in history).
 */
import type { IsoDate } from '@/lib/date'

export type { IsoDate }
export type IsoDateTime = string // ISO 8601

export type HabitCategory = 'workout' | 'nutrition' | 'mobility'
export type HabitKind = 'floor' | 'stack'

/**
 * How a habit is validated.
 *
 * `protein_portion` asks which zero-cook portion was eaten and logs its grams,
 * so the floor actually feeds the daily protein target instead of just being
 * ticked off.
 */
export type HabitCompletionMode = 'toggle' | 'protein_portion'

export interface FloorHabitDefinition {
  id: string
  title: string
  /** Existing daily cue the habit is stacked onto, e.g. « Pendant que le café coule ». */
  triggerAnchor?: string
  targetRepsOrAction: string
  category: HabitCategory
  kind: HabitKind
  completionMode: HabitCompletionMode
  order: number
  /** Archived habits stop appearing today but stay in past completions. */
  archivedAt?: IsoDateTime
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}

export interface HabitCompletion {
  id: string
  habitId: string
  date: IsoDate
  completedAt: IsoDateTime
  /** Set for `protein_portion` habits: the protein log this completion created. */
  proteinLogId?: string
}

export type MovementPattern = 'push' | 'pull' | 'legs' | 'core' | 'other'

export interface Exercise {
  id: string
  name: string
  pattern: MovementPattern
  defaultRepRange: [number, number]
  /** Ids of harder variants, easiest first. Drives the overload suggestion. */
  progressionChain?: string[]
  isCustom: boolean
}

export type SetDifficulty = 'easy' | 'target' | 'hard'

export interface ExerciseSet {
  id: string
  /** Absent for a standalone micro-set logged outside a session. */
  sessionId?: string
  exerciseId: string
  reps: number
  loadOrResistance: string
  difficulty: SetDifficulty
  /** Stored for analysis, never asked for on screen. */
  rpe?: number
  date: IsoDate
  timestamp: IsoDateTime
}

export type SessionType = '20min_circuit' | 'micro_sets' | 'custom'

export interface WorkoutSession {
  id: string
  date: IsoDate
  startedAt: IsoDateTime
  endedAt?: IsoDateTime
  durationMinutes?: number
  type: SessionType
  notes?: string
}

export type ProteinSource = 'shake' | 'zero_cook' | 'takeout' | 'meal'

export interface ProteinLog {
  id: string
  date: IsoDate
  timestamp: IsoDateTime
  grams: number
  sourceType: ProteinSource
  note?: string
}

export interface DailyLog {
  date: IsoDate
  /** Derived: every active floor habit was checked that day. */
  floorCompleted: boolean
  /** Denormalised aggregate, rewritten on every protein write. */
  totalProteinGrams: number
  /** Frozen at the time of the day so past days are not rewritten by a new target. */
  proteinTargetGrams: number
  notes?: string
}

export interface Measurement {
  id: string
  date: IsoDate
  waistCm?: number
  weightKg?: number
  createdAt: IsoDateTime
}

export type PhotoAngle = 'front' | 'side' | 'back'

export interface ProgressPhoto {
  id: string
  date: IsoDate
  /** WebP, 1200 px on the long edge. Never leaves the device. */
  blob: Blob
  angle: PhotoAngle
  widthPx: number
  heightPx: number
  byteSize: number
  createdAt: IsoDateTime
}

export interface TakeoutOption {
  id: string
  cuisine: string
  pick: string
  avoid: string
  estimatedProteinGrams?: number
  isCustom: boolean
}

export interface ZeroCookItem {
  id: string
  name: string
  proteinPerServingGrams: number
  servingLabel: string
  inStock: boolean
  isCustom: boolean
}

export type ProteinTargetMode = 'auto' | 'manual'

export interface AppSettings {
  schemaVersion: number
  /** Anchors both the consistency denominator and the « Jour N » milestone. */
  installedAt: IsoDateTime
  /**
   * `auto` derives the daily protein target from smoothed body weight; `manual`
   * freezes whatever the user typed, and a later weigh-in never overwrites it.
   */
  proteinTargetMode: ProteinTargetMode
  /** Only meaningful in `manual` mode. */
  manualProteinTargetGrams?: number
  locale: 'fr'
  onboardingCompletedAt?: IsoDateTime
  restTimerDefaultSeconds: 60 | 90
  hapticsEnabled: boolean
  soundEnabled: boolean
}

export interface ExportBundle {
  schemaVersion: number
  exportedAt: IsoDateTime
  settings: AppSettings
  habits: FloorHabitDefinition[]
  completions: HabitCompletion[]
  dailyLogs: DailyLog[]
  proteinLogs: ProteinLog[]
  sessions: WorkoutSession[]
  sets: ExerciseSet[]
  measurements: Measurement[]
  takeoutOptions: TakeoutOption[]
  zeroCookItems: ZeroCookItem[]
  photos?: Array<Omit<ProgressPhoto, 'blob'> & { dataUrl: string }>
}

/** Bumped whenever the shape above changes. Guards Dexie and import. */
export const SCHEMA_VERSION = 2
