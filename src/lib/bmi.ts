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

/** The band the app calls « corpulence normale », and the two weights that bound it. */
export const BMI_NORMAL_MIN = 18.5
export const BMI_NORMAL_MAX = 25

/** The weight at which someone of this height reads a given index. */
export function weightForBmi(index: number, heightCm: number): number {
  const metres = heightCm / 100
  return Math.round(index * metres * metres * 10) / 10
}

export interface HealthyWeight {
  /** Below this, the index reads underweight. */
  minKg: number
  /** At this weight and above, the index reads overweight. */
  maxKg: number
  /**
   * The bound worth showing: the ceiling, unless the body is under the floor.
   *
   * A single figure, not the pair, because the chart draws one dashed line and
   * the card carries one sentence. Someone inside the band keeps reading the
   * ceiling — it is the bound they can cross — rather than watching the line
   * jump from one side to the other as the weight drifts across the middle.
   */
  boundKg: number
  /** The index that bound sits on, for labelling the line it is drawn as. */
  boundIndex: number
  /** Signed distance from the weight to that bound, in kg. Null once inside. */
  toGoKg: number | null
}

/**
 * The healthy range for a height, and where a given weight stands against it.
 *
 * The app has no target weight and says so (PRD §3.3) — this is not one. It is
 * the reading the index already implies: « corpulence normale » is a band, and
 * a band drawn on the scale the weight is measured in is easier to act on than
 * a number on an index nobody weighs themselves in.
 */
export function healthyWeight(weightKg: number, heightCm: number): HealthyWeight {
  const minKg = weightForBmi(BMI_NORMAL_MIN, heightCm)
  const maxKg = weightForBmi(BMI_NORMAL_MAX, heightCm)
  const under = bmi(weightKg, heightCm) < BMI_NORMAL_MIN
  const boundKg = under ? minKg : maxKg
  const boundIndex = under ? BMI_NORMAL_MIN : BMI_NORMAL_MAX
  const outside = under ? weightKg < minKg : weightKg >= maxKg

  return {
    minKg,
    maxKg,
    boundKg,
    boundIndex,
    toGoKg: outside ? Math.round((boundKg - weightKg) * 10) / 10 : null,
  }
}

/** Position of the cursor on the rail, as a percentage, clamped to its ends. */
export function bmiPercent(value: number): number {
  const span = BMI_SCALE_MAX - BMI_SCALE_MIN
  return Math.min(100, Math.max(0, ((value - BMI_SCALE_MIN) / span) * 100))
}
