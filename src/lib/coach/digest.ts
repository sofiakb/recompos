/**
 * The coach's memory (spec coach §4.3).
 *
 * Not a memory the model keeps: a summary the app rebuilds from the real logs on
 * every question. That makes it deterministic, testable, visible to the user
 * (« Voir ce que le coach voit »), and impossible to drift from what actually
 * happened.
 *
 * It carries values and targets, never their difference. « 2 800 for a 2 000
 * target » is a fact; « +800 over » is already a verdict, and the verdict
 * belongs to the prompt's framing, not to the data.
 */
import { lastDays } from '@/lib/date'
import type { ActivityLevel, BiologicalSex } from '@/lib/nutrition'
import type { CoachDigest, DigestDay } from '@/lib/coach/types'
import type {
  DailyLog,
  FavoriteMeal,
  IsoDate,
  MealEntry,
  Measurement,
  ProteinLog,
  SessionType,
  TakeoutOption,
  WorkoutSession,
  ZeroCookItem,
} from '@/types/models'

export const DIGEST_DAYS = 7
export const MAX_MEALS_PER_DAY = 6
export const MAX_LABEL = 40
const MAX_LIST = 8
const MAX_TAKEOUT = 6
const WEIGHT_POINTS = 4

export interface DigestProfile {
  proteinTargetG: number
  calorieTargetKcal: number
  activityLevel: ActivityLevel
  ageYears: number | null
  biologicalSex: BiologicalSex | null
  heightCm: number | null
}

export interface DigestInput {
  today: IsoDate
  now: Date
  profile: DigestProfile
  meals: MealEntry[]
  proteinLogs: ProteinLog[]
  dailyLogs: DailyLog[]
  sessions: WorkoutSession[]
  weightsNewestFirst: Measurement[]
  latestWaist: Measurement | null
  favorites: FavoriteMeal[]
  zeroCook: ZeroCookItem[]
  takeout: TakeoutOption[]
}

const SESSION_LABEL: Record<SessionType, string> = {
  '20min_circuit': 'circuit 20 min',
  micro_sets: 'micro-séries',
  custom: 'séance libre',
}

function clip(text: string, max: number): string {
  const trimmed = text.trim()
  return trimmed.length <= max ? trimmed : `${trimmed.slice(0, max - 1)}…`
}

function hourOf(now: Date): string {
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

function dayOf(date: IsoDate, input: DigestInput): DigestDay {
  const meals = input.meals
    .filter((meal) => meal.date === date && meal.status === 'done')
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  const proteinLogs = input.proteinLogs.filter((log) => log.date === date)
  const daily = input.dailyLogs.find((log) => log.date === date)
  const sessions = input.sessions.filter((session) => session.date === date)

  const extras: Pick<DigestDay, 'plancherFait' | 'seances'> = {
    ...(daily?.floorCompleted ? { plancherFait: true } : {}),
    ...(sessions.length > 0
      ? { seances: sessions.map((session) => SESSION_LABEL[session.type]) }
      : {}),
  }

  if (meals.length === 0 && proteinLogs.length === 0) {
    return { date, saisi: false, ...extras }
  }

  return {
    date,
    saisi: true,
    kcal: Math.round(meals.reduce((sum, meal) => sum + meal.kcal, 0)),
    // The ledger, not the meals: a meal writes its protein into the ledger too,
    // so adding both would count every plate twice.
    proteinesG: Math.round(proteinLogs.reduce((sum, log) => sum + log.grams, 0)),
    repas: meals.slice(0, MAX_MEALS_PER_DAY).map((meal) => ({
      creneau: meal.slot,
      libelle: clip(meal.label, MAX_LABEL),
      kcal: Math.round(meal.kcal),
      proteinesG: Math.round(meal.proteinG),
    })),
    ...extras,
  }
}

function weightTrend(weightsNewestFirst: Measurement[]): CoachDigest['poids'] {
  const points = weightsNewestFirst.flatMap((m) =>
    typeof m.weightKg === 'number' ? [{ date: m.date, kg: m.weightKg }] : [],
  )
  const recent = points.slice(0, WEIGHT_POINTS)
  if (recent.length === 0) return null
  return {
    // Oldest first, so the list reads like the curve on the Progression tab.
    tendance: recent.map((point) => point.kg).reverse(),
    derniere: recent[0].date,
  }
}

export function buildDigest(input: DigestInput): CoachDigest {
  return {
    aujourdhui: input.today,
    heure: hourOf(input.now),
    profil: {
      cibleProteinesG: input.profile.proteinTargetG,
      cibleKcal: input.profile.calorieTargetKcal,
      activite: input.profile.activityLevel,
      age: input.profile.ageYears,
      sexe: input.profile.biologicalSex,
      tailleCm: input.profile.heightCm,
    },
    jours: lastDays(DIGEST_DAYS, input.today).map((date) => dayOf(date, input)),
    poids: weightTrend(input.weightsNewestFirst),
    tourDeTailleCm: input.latestWaist?.waistCm ?? null,
    favoris: input.favorites.slice(0, MAX_LIST).map((favorite) => clip(favorite.label, MAX_LABEL)),
    // Only what is actually in the cupboard: suggesting a shake the user ran
    // out of is a suggestion they cannot follow.
    zeroCuisson: input.zeroCook
      .filter((item) => item.inStock)
      .slice(0, MAX_LIST)
      .map((item) => item.name),
    livraison: input.takeout
      .slice(0, MAX_TAKEOUT)
      .map((option) => clip(`${option.cuisine} : ${option.pick}`, MAX_LABEL)),
  }
}
