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
 * Starting point for the daily calorie target, in kcal per kg of body weight.
 *
 * 30 kcal/kg sits just under maintenance for someone sedentary who trains a
 * little — a slight deficit rather than a diet. It is deliberately a *starting
 * point*: no formula that only knows body weight can know height, age or how
 * much the day actually moves. The real target is the one adjusted after three
 * weeks of watching the weight trend, and the UI says so.
 */
export const CALORIES_PER_KG = 30

export const MIN_CALORIE_TARGET_KCAL = 1200
export const MAX_CALORIE_TARGET_KCAL = 5000

/** Ceiling on a single meal — above this the model or the typing went wrong. */
export const MAX_MEAL_KCAL = 4000

/** Days a meal photo is kept before its bytes are dropped. */
export const DEFAULT_MEAL_PHOTO_RETENTION_DAYS = 30

/**
 * Rounds to the nearest 50 kcal, for the same reason the protein target rounds
 * to 5 g: the input is a smoothed weight and the coefficient is an estimate, so
 * a figure ending in 7 would be false precision.
 */
export function computeCalorieTargetKcal(weightKg: number): number {
  const rounded = Math.round((weightKg * CALORIES_PER_KG) / 50) * 50
  return clampCalorieTargetKcal(rounded)
}

export function clampCalorieTargetKcal(kcal: number): number {
  if (!Number.isFinite(kcal)) return MIN_CALORIE_TARGET_KCAL
  return Math.min(MAX_CALORIE_TARGET_KCAL, Math.max(MIN_CALORIE_TARGET_KCAL, Math.round(kcal)))
}

/** Target when no weigh-in exists yet, flagged as provisional in the UI. */
export const PROVISIONAL_CALORIE_TARGET_KCAL = 2200

export const MIN_WEIGHT_KG = 35
export const MAX_WEIGHT_KG = 250

// Body measurements live beside the weight because the protein target derives
// from them; the waist is here for the same reason the weight is — one place
// for the numbers the user types about their body.
export const MIN_WAIST_CM = 40
export const MAX_WAIST_CM = 200

/** Number of weigh-ins averaged to smooth out day-to-day water noise. */
export const WEIGHT_SMOOTHING_POINTS = 4

/** Days after the last weigh-in before the dashboard suggests a new one. */
export const WEIGH_IN_INTERVAL_DAYS = 7

/**
 * Rounds to the nearest 5 g: the input is a smoothed weight, so pretending to
 * single-gram precision would be false accuracy.
 */
export function computeProteinTargetGrams(weightKg: number): number {
  const raw = weightKg * PROTEIN_GRAMS_PER_KG
  const rounded = Math.round(raw / 5) * 5
  return Math.min(MAX_PROTEIN_TARGET_GRAMS, Math.max(MIN_PROTEIN_TARGET_GRAMS, rounded))
}

/**
 * Mean of the most recent weigh-ins, newest first.
 *
 * A single weigh-in swings by a kilo on water alone, which would drag the
 * protein target around for no physiological reason.
 */
export function smoothedWeightKg(
  weightsNewestFirst: number[],
  points = WEIGHT_SMOOTHING_POINTS,
): number | null {
  const sample = weightsNewestFirst.slice(0, points)
  if (sample.length === 0) return null
  const sum = sample.reduce((total, kg) => total + kg, 0)
  return Math.round((sum / sample.length) * 10) / 10
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
