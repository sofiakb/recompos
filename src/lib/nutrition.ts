import type { MealSlot } from '@/types/models'

/**
 * Protein target derivation (PRD §6.3).
 *
 * The target follows body weight rather than being a number the user has to
 * invent: 1.8 g/kg sits mid-range for a recomposition, high enough to protect
 * muscle in a deficit without being unreachable on a bad day.
 */
export const PROTEIN_GRAMS_PER_KG = 1.8

export const MIN_PROTEIN_TARGET_GRAMS = 80
export const MAX_PROTEIN_TARGET_GRAMS = 250

/** Ceiling on a single log or portion — above this it is a typo, not a meal. */
export const MAX_PROTEIN_LOG_GRAMS = 300

/**
 * Resting metabolic rate, Mifflin-St Jeor.
 *
 *   homme  : 10·kg + 6,25·cm − 5·âge + 5
 *   femme  : 10·kg + 6,25·cm − 5·âge − 161
 *
 * Height and age are what a weight-only coefficient cannot guess, and the gap is
 * not academic: guessing cost roughly 300 kcal/day on an 78 kg body — the size
 * of the entire deficit. So the formula is used whenever the profile is filled
 * in, and the crude coefficient below is only a fallback that says it is one.
 */
export function basalMetabolicRateKcal(profile: BodyProfile): number {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.ageYears
  return Math.round(base + (profile.sex === 'female' ? -161 : 5))
}

export interface BodyProfile {
  weightKg: number
  heightCm: number
  ageYears: number
  sex: BiologicalSex
}

export type BiologicalSex = 'male' | 'female'

/**
 * Fallback *resting* rate, in kcal per kg, used until height and age exist.
 *
 * A rate rather than a finished maintenance figure, so the activity factor
 * applies either way. A fallback that ignored activity made the activity
 * control move without changing anything — a switch that does nothing is worse
 * than a missing one.
 *
 * 22 kcal/kg is the usual rule of thumb, and lands within a few kcal of what
 * Mifflin-St Jeor gives an average adult at the same weight. It stays an
 * estimate, and the screen keeps saying so.
 */
export const FALLBACK_BMR_KCAL_PER_KG = 22

/**
 * Multipliers on the resting rate. Standard values, named for what a day looks
 * like rather than for a gym schedule the app has no way to verify.
 */
export const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.3,
  moderate: 1.45,
} as const

export type ActivityLevel = keyof typeof ACTIVITY_FACTORS

/** A desk job with the app's micro-workouts — what this app is built around. */
export const DEFAULT_ACTIVITY_LEVEL: ActivityLevel = 'light'

export function clampHeightCm(cm: number): number {
  if (!Number.isFinite(cm)) return 0
  return Math.min(250, Math.max(120, Math.round(cm)))
}

export function clampAgeYears(years: number): number {
  if (!Number.isFinite(years)) return 0
  return Math.min(100, Math.max(14, Math.round(years)))
}

/**
 * How far under maintenance the target sits, in percent.
 *
 * 10 % rather than the 20–25 % a weight-loss app would pick: the goal here is
 * recomposition (PRD §3.3), and a large deficit is the reliable way to stop
 * building muscle while losing fat. It is also the deficit that survives a bad
 * week, which is the whole premise of the app.
 */
export const DEFAULT_DEFICIT_PERCENT = 10

/** Offered in Settings. 0 is maintenance — a legitimate choice, not an absence. */
export const DEFICIT_CHOICES = [0, 10, 15, 20] as const

export type DeficitPercent = (typeof DEFICIT_CHOICES)[number]

export function clampDeficitPercent(percent: number): number {
  if (!Number.isFinite(percent)) return DEFAULT_DEFICIT_PERCENT
  return Math.min(30, Math.max(0, Math.round(percent)))
}

export interface MaintenanceInput {
  weightKg: number
  activityLevel?: ActivityLevel
  /** Absent until the user fills them in; the estimate says so when they are. */
  heightCm?: number
  ageYears?: number
  sex?: BiologicalSex
}

export interface MaintenanceEstimate {
  kcal: number
  /** False while height or age are missing and the crude coefficient is in use. */
  fromProfile: boolean
}

/**
 * Maintenance before any deficit, rounded to the nearest 50.
 *
 * Rounded for the same reason the protein target rounds to 5 g: every input is
 * an estimate, so a figure ending in 7 would be false precision.
 */
function rawMaintenance(input: MaintenanceInput): MaintenanceEstimate {
  const factor = ACTIVITY_FACTORS[input.activityLevel ?? DEFAULT_ACTIVITY_LEVEL]
  const complete = Boolean(input.heightCm && input.ageYears && input.sex)

  const kcal = complete
    ? basalMetabolicRateKcal({
        weightKg: input.weightKg,
        heightCm: input.heightCm as number,
        ageYears: input.ageYears as number,
        sex: input.sex as BiologicalSex,
      }) * factor
    : input.weightKg * FALLBACK_BMR_KCAL_PER_KG * factor

  return { kcal, fromProfile: complete }
}

export function estimateMaintenance(input: MaintenanceInput): MaintenanceEstimate {
  const raw = rawMaintenance(input)
  return { kcal: round50(raw.kcal), fromProfile: raw.fromProfile }
}

function round50(value: number): number {
  return Math.round(value / 50) * 50
}

export const MIN_CALORIE_TARGET_KCAL = 1200
export const MAX_CALORIE_TARGET_KCAL = 5000

/** Ceiling on a single meal — above this the model or the typing went wrong. */
export const MAX_MEAL_KCAL = 4000

/** Days a meal photo is kept before its bytes are dropped. */
export const DEFAULT_MEAL_PHOTO_RETENTION_DAYS = 30

/**
 * Maintenance minus the deficit, rounded to the nearest 50 kcal.
 *
 * Rounded for the same reason the protein target rounds to 5 g: the input is a
 * weight is one reading and the coefficient is an estimate, so a figure ending in 7
 * would be false precision.
 */
export function computeCalorieTargetKcal(
  input: MaintenanceInput,
  deficitPercent: number = DEFAULT_DEFICIT_PERCENT,
): number {
  const deficit = clampDeficitPercent(deficitPercent)
  // Rounded once, at the end: taking the deficit off an already-rounded
  // maintenance rounds twice and drifts by up to 25 kcal for no reason.
  const { kcal } = rawMaintenance(input)
  return clampCalorieTargetKcal(round50(kcal * (1 - deficit / 100)))
}

export function clampCalorieTargetKcal(kcal: number): number {
  if (!Number.isFinite(kcal)) return MIN_CALORIE_TARGET_KCAL
  return Math.min(MAX_CALORIE_TARGET_KCAL, Math.max(MIN_CALORIE_TARGET_KCAL, Math.round(kcal)))
}

/** Target when no weigh-in exists yet, flagged as provisional in the UI. */
export const PROVISIONAL_CALORIE_TARGET_KCAL = 2200

/** The four meals in the order a day meets them. */
export const MEAL_SLOT_ORDER = [
  'breakfast',
  'lunch',
  'dinner',
  'snack',
] as const satisfies readonly MealSlot[]

/** Rough clock slots; the user can change one in a tap. */
export function slotForHour(hour: number): MealSlot {
  if (hour < 11) return 'breakfast'
  if (hour < 15) return 'lunch'
  if (hour < 18) return 'snack'
  return 'dinner'
}

/**
 * How the day's calories split across the four meals.
 *
 * A fixed split rather than a setting: the numbers exist to answer « can I still
 * have that », not to be tuned. They are deliberately lopsided towards lunch,
 * which is the meal this app's user actually sits down for.
 */
export const MEAL_SLOT_SHARE: Record<MealSlot, number> = {
  breakfast: 0.25,
  lunch: 0.4,
  dinner: 0.3,
  snack: 0.05,
}

/**
 * A meal's share of the day, to the nearest 10 kcal.
 *
 * Rounded for the same reason everything else here is: the day's target is
 * itself an estimate, and a per-meal figure ending in 7 would claim a precision
 * that four multiplications cannot possibly have.
 */
export function mealTargetKcal(dayTargetKcal: number, slot: MealSlot): number {
  return Math.round((dayTargetKcal * MEAL_SLOT_SHARE[slot]) / 10) * 10
}

export const KCAL_PER_GRAM = { protein: 4, carbs: 4, fat: 9 } as const

/**
 * Of the calories left once protein is served, this share goes to carbohydrate.
 *
 * Protein comes first because it is the only macro the app has an opinion about
 * (PRD §6.3); the rest is split on the usual 55/45, which is a convention rather
 * than a claim.
 */
export const CARB_SHARE_OF_REMAINDER = 0.55

export interface MacroTargetsG {
  proteinG: number
  /** 0 when protein alone already covers the target — the UI then shows no denominator. */
  carbsG: number
  fatG: number
}

/**
 * Carbohydrate and fat targets, derived rather than typed.
 *
 * Only the protein target is a real target. These two are what is left of the
 * calorie budget once protein is paid for, which is why a protein target that
 * eats the whole budget returns zeros: a negative remainder split 55/45 would
 * print a confident negative gram count.
 */
export function macroTargetsG(targetKcal: number, proteinTargetG: number): MacroTargetsG {
  const remainder = Math.max(0, targetKcal - proteinTargetG * KCAL_PER_GRAM.protein)
  const round5 = (grams: number) => Math.round(grams / 5) * 5
  return {
    proteinG: proteinTargetG,
    carbsG: round5((remainder * CARB_SHARE_OF_REMAINDER) / KCAL_PER_GRAM.carbs),
    fatG: round5((remainder * (1 - CARB_SHARE_OF_REMAINDER)) / KCAL_PER_GRAM.fat),
  }
}

export const MIN_WEIGHT_KG = 35
export const MAX_WEIGHT_KG = 250

// Body measurements live beside the weight because the protein target derives
// from them; the waist is here for the same reason the weight is — one place
// for the numbers the user types about their body.
export const MIN_WAIST_CM = 40
export const MAX_WAIST_CM = 200

/** Days after the last weigh-in before the dashboard suggests a new one. */
export const WEIGH_IN_INTERVAL_DAYS = 7

/**
 * Rounds to the nearest 5 g: the coefficient is an estimate, so pretending to
 * single-gram precision would be false accuracy.
 */
export function computeProteinTargetGrams(weightKg: number): number {
  const raw = weightKg * PROTEIN_GRAMS_PER_KG
  const rounded = Math.round(raw / 5) * 5
  return Math.min(MAX_PROTEIN_TARGET_GRAMS, Math.max(MIN_PROTEIN_TARGET_GRAMS, rounded))
}

/**
 * The last weigh-in, newest first.
 *
 * The app used to average the last four weigh-ins to damp water noise, but a
 * mean the user cannot find on any scale reads as a wrong number: it lags every
 * real change by days and never matches what they just saw. The figure shown,
 * and the one the targets derive from, is the one they typed.
 */
export function currentWeightKg(weightsNewestFirst: number[]): number | null {
  const latest = weightsNewestFirst[0]
  if (latest === undefined) return null
  return Math.round(latest * 10) / 10
}

export function clampWeightKg(kg: number): number {
  return Math.min(MAX_WEIGHT_KG, Math.max(MIN_WEIGHT_KG, Math.round(kg * 10) / 10))
}

export function clampWaistCm(cm: number): number {
  return Math.min(MAX_WAIST_CM, Math.max(MIN_WAIST_CM, Math.round(cm * 10) / 10))
}

export function clampProteinTargetGrams(grams: number): number {
  return Math.min(MAX_PROTEIN_TARGET_GRAMS, Math.max(MIN_PROTEIN_TARGET_GRAMS, Math.round(grams)))
}
