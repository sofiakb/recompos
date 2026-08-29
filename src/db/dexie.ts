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
  FavoriteMeal,
  HabitCompletion,
  MealEntry,
  MealPhoto,
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
  meals!: Table<MealEntry, string>
  mealPhotos!: Table<MealPhoto, string>
  favorites!: Table<FavoriteMeal, string>

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
    // Meals arrive in their own version so an existing install keeps its data:
    // Dexie only replays the deltas, and version 1 stays declared above.
    this.version(2).stores({
      // `status` is indexed because the retry queue asks for pending rows on
      // every launch and on every return of the network.
      meals: 'id, date, status, timestamp',
      mealPhotos: 'id, mealId, date',
    })
    // Favourites arrive in version 3, again as a delta: nothing above changes,
    // so an install that already holds a year of meals keeps every one of them.
    this.version(3).stores({
      // `key` is unique rather than merely indexed: starring the same meal
      // twice is the same favourite, and the database is where that is settled
      // — not in whichever screen happened to send the second star.
      favorites: 'id, &key, createdAt',
    })
  }
}

export const db = new RecompDb()

/**
 * Fills catalog tables on first run.
 *
 * `alreadySeeded` comes from settings rather than from a row count: a user who
 * deletes every zero-cook item means it, and inferring "never seeded" from an
 * empty table would hand them all seven back on the next launch.
 */
export async function seedDatabase(database: RecompDb = db, alreadySeeded = false): Promise<void> {
  if (alreadySeeded) return
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
