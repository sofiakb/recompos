/**
 * IndexedDB layer (PRD §7).
 *
 * Everything that grows without bound or is queried by date range lives here.
 * Small, synchronously-read state (settings, habit definitions, UI prefs) lives
 * in the Zustand stores instead.
 */
import Dexie, { type Table } from 'dexie'
import { DEFAULT_EXERCISES, DEFAULT_TAKEOUT, DEFAULT_ZERO_COOK } from '@/db/seed'
import type {
  DailyLog,
  Exercise,
  ExerciseSet,
  HabitCompletion,
  Measurement,
  ProgressPhoto,
  ProteinLog,
  TakeoutOption,
  WorkoutSession,
  ZeroCookItem,
} from '@/types/models'

export class RecompDb extends Dexie {
  dailyLogs!: Table<DailyLog, string>
  habitCompletions!: Table<HabitCompletion, string>
  proteinLogs!: Table<ProteinLog, string>
  sessions!: Table<WorkoutSession, string>
  sets!: Table<ExerciseSet, string>
  exercises!: Table<Exercise, string>
  measurements!: Table<Measurement, string>
  photos!: Table<ProgressPhoto, string>
  takeoutOptions!: Table<TakeoutOption, string>
  zeroCookItems!: Table<ZeroCookItem, string>

  constructor(name = 'recompos') {
    super(name)
    this.version(1).stores({
      dailyLogs: 'date',
      // [habitId+date] is unique per day: it makes a toggle an upsert, not a scan.
      habitCompletions: 'id, date, habitId, [habitId+date]',
      proteinLogs: 'id, date, timestamp',
      sessions: 'id, date, type',
      sets: 'id, date, exerciseId, sessionId, [exerciseId+timestamp]',
      exercises: 'id, pattern',
      measurements: 'id, date',
      photos: 'id, date, angle',
      takeoutOptions: 'id, cuisine',
      zeroCookItems: 'id',
    })
  }
}

export const db = new RecompDb()

/**
 * Fills catalog tables on first run. Idempotent: existing rows are left alone so
 * a user's edits to the takeout sheet survive an app update.
 */
export async function seedDatabase(database: RecompDb = db): Promise<void> {
  await database.transaction(
    'rw',
    database.exercises,
    database.takeoutOptions,
    database.zeroCookItems,
    async () => {
      if ((await database.exercises.count()) === 0) {
        await database.exercises.bulkAdd(DEFAULT_EXERCISES)
      }
      if ((await database.takeoutOptions.count()) === 0) {
        await database.takeoutOptions.bulkAdd(DEFAULT_TAKEOUT)
      }
      if ((await database.zeroCookItems.count()) === 0) {
        await database.zeroCookItems.bulkAdd(DEFAULT_ZERO_COOK)
      }
    },
  )
}
