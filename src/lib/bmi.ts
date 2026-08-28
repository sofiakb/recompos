/**
 * Body mass index, as a reading of the weight rather than a measure of its own.
 *
 * It lives under the smoothed weight on Progression and nowhere else: an index
 * derived from one number does not deserve its own section, and computing it
 * from the morning's raw weigh-in would make it jump for reasons that have
 * nothing to do with the body.
 */

/** Ends of the rail the cursor slides along. Below 15 and above 35 it pins. */
export const BMI_SCALE_MIN = 15
export const BMI_SCALE_MAX = 35

/**
 * Rounded to one decimal here rather than at the call site.
 *
 * One decimal is the only precision the app ever displays, and a raw 24.96 shown
 * as « 25,0 » next to the band « corpulence normale » would contradict itself on
 * screen. Rounding once, at the source, keeps the number, the band and the
 * cursor position telling the same story.
 */
export function bmi(weightKg: number, heightCm: number): number {
  const metres = heightCm / 100
  return Math.round((weightKg / (metres * metres)) * 10) / 10
}

export type BmiBand = 'underweight' | 'normal' | 'overweight' | 'obese'

export function bmiBand(value: number): BmiBand {
  if (value < 18.5) return 'underweight'
  if (value < 25) return 'normal'
  if (value < 30) return 'overweight'
  return 'obese'
}

/** Position of the cursor on the rail, as a percentage, clamped to its ends. */
export function bmiPercent(value: number): number {
  const span = BMI_SCALE_MAX - BMI_SCALE_MIN
  return Math.min(100, Math.max(0, ((value - BMI_SCALE_MIN) / span) * 100))
}
