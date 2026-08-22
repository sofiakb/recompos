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
