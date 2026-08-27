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
  /**
   * Encoded image bytes, 1200 px on the long edge. Never leaves the device.
   *
   * An ArrayBuffer rather than a Blob: structured clone handles it identically
   * in every IndexedDB implementation, while Blob support has been uneven
   * (Safari has shipped bugs, and fake-indexeddb drops it outright).
   */
  bytes: ArrayBuffer
  /** Usually `image/webp`; `image/jpeg` where WebP encoding is unavailable. */
  mimeType: string
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

/**
 * A meal captured from a photo (PRD §6.6).
 *
 * The photo is analysed by a vision model and comes back as a list of foods with
 * their macros. Everything is editable afterwards — the model is a first draft,
 * not an authority — which is why the per-item breakdown is stored rather than
 * only the totals.
 */
export interface MealItem {
  name: string
  /** Free text as the model saw it: « 150 g », « 1 bol », « 2 tranches ». */
  quantity: string
  kcal: number
  proteinG: number
  carbsG: number
  fatG: number
}

/**
 * `pending` covers both « just captured » and « the network was gone » — the
 * queue retries either way, so one state is enough.
 */
export type MealAnalysisStatus = 'pending' | 'analysing' | 'done' | 'failed'

export type MealSource = 'ai' | 'manual' | 'corrected'

export type MealConfidence = 'low' | 'medium' | 'high'

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface MealEntry {
  id: string
  date: IsoDate
  timestamp: IsoDateTime
  slot: MealSlot
  /** Short human label, e.g. « Poulet, riz, brocolis ». */
  label: string
  items: MealItem[]
  kcal: number
  proteinG: number
  carbsG: number
  fatG: number
  /** The model's own hedge. Shown, never hidden — a guess that says so is usable. */
  confidence: MealConfidence
  source: MealSource
  status: MealAnalysisStatus
  /** Provider id that produced the analysis, for when two disagree over time. */
  analysedBy?: string
  /** Human-readable failure, kept so a retry can explain what went wrong before. */
  error?: string
  /** Thumbnail row in `mealPhotos`. Absent once retention has cleared it. */
  photoId?: string
  /**
   * The `ProteinLog` this meal owns.
   *
   * Protein already has a counter, a ring and a floor habit hanging off it. A
   * meal therefore writes into that same ledger instead of running a parallel
   * total, and owns exactly one row so an edit is an update, never a duplicate.
   */
  proteinLogId?: string
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}

/**
 * Meal photo bytes, kept apart from the entry.
 *
 * A meal row is read on every dashboard paint; its photo is read when the user
 * opens it. Splitting them keeps the hot query small, and lets retention delete
 * the bytes while the numbers stay.
 */
export interface MealPhoto {
  id: string
  mealId: string
  date: IsoDate
  bytes: ArrayBuffer
  mimeType: string
  byteSize: number
  createdAt: IsoDateTime
}

/** Providers speaking the OpenAI chat-completions dialect. */
export type VisionProviderId = 'groq' | 'openrouter' | 'custom'

export interface VisionProviderSettings {
  apiKey: string
  /** Overrides the provider default; required for `custom`. */
  model?: string
  /** Only read for `custom`. */
  baseUrl?: string
  enabled: boolean
}

export type CalorieTargetMode = 'auto' | 'manual'

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
  /**
   * Set once the catalogs have been filled.
   *
   * Seeding used to be skipped whenever a catalog was non-empty, which meant
   * emptying one on purpose brought every default back on the next launch.
   */
  catalogsSeededAt?: IsoDateTime
  /** Seconds. 60 and 90 are offered as presets; any value in range is allowed. */
  restTimerDefaultSeconds: number
  hapticsEnabled: boolean
  soundEnabled: boolean
  /**
   * Vision providers, tried in the order listed by `VISION_PROVIDER_ORDER`.
   *
   * Keys are typed by the user into Settings and never ship in the bundle: this
   * is a single-user app served from static hosting, so a build-time key would
   * be readable by anyone who opens the page.
   */
  visionProviders?: Partial<Record<VisionProviderId, VisionProviderSettings>>
  /** `auto` derives the daily calorie target from smoothed body weight. */
  calorieTargetMode: CalorieTargetMode
  /** Only meaningful in `manual` mode. */
  manualCalorieTargetKcal?: number
  /** Days a meal photo is kept before its bytes are dropped. 0 keeps none. */
  mealPhotoRetentionDays: number
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
  photos?: Array<Omit<ProgressPhoto, 'bytes'> & { dataUrl: string }>
  meals?: MealEntry[]
}

/** Bumped whenever the shape above changes. Guards Dexie and import. */
export const SCHEMA_VERSION = 3
