import { describe, expect, it } from 'vitest'
import {
  ACTIVITY_FACTORS,
  basalMetabolicRateKcal,
  clampAgeYears,
  clampCalorieTargetKcal,
  clampDeficitPercent,
  clampHeightCm,
  computeCalorieTargetKcal,
  DEFAULT_DEFICIT_PERCENT,
  DEFICIT_CHOICES,
  estimateMaintenance,
  FALLBACK_MAINTENANCE_KCAL_PER_KG,
  MAX_CALORIE_TARGET_KCAL,
  MIN_CALORIE_TARGET_KCAL,
} from '@/lib/nutrition'

const PROFILE = { weightKg: 78.3, heightCm: 178, ageYears: 35, sex: 'male' as const }
const FULL = { ...PROFILE, sex: PROFILE.sex, activityLevel: 'light' as const }

describe('basalMetabolicRateKcal', () => {
  it('matches Mifflin-St Jeor for a man', () => {
    // 10×78.3 + 6.25×178 − 5×35 + 5
    expect(basalMetabolicRateKcal(PROFILE)).toBe(1726)
  })

  it('applies the female constant', () => {
    expect(basalMetabolicRateKcal({ ...PROFILE, sex: 'female' })).toBe(1560)
    expect(
      basalMetabolicRateKcal(PROFILE) - basalMetabolicRateKcal({ ...PROFILE, sex: 'female' }),
    ).toBe(166)
  })

  it('falls with age and rises with height', () => {
    expect(basalMetabolicRateKcal({ ...PROFILE, ageYears: 55 })).toBeLessThan(
      basalMetabolicRateKcal(PROFILE),
    )
    expect(basalMetabolicRateKcal({ ...PROFILE, heightCm: 190 })).toBeGreaterThan(
      basalMetabolicRateKcal(PROFILE),
    )
  })
})

describe('estimateMaintenance', () => {
  it('uses the formula once the profile is complete', () => {
    const estimate = estimateMaintenance({
      weightKg: 78.3,
      heightCm: 178,
      ageYears: 35,
      sex: 'male',
      activityLevel: 'light',
    })
    expect(estimate.fromProfile).toBe(true)
    expect(estimate.kcal).toBe(2250)
  })

  it('tracks the activity factor', () => {
    const at = (activityLevel: keyof typeof ACTIVITY_FACTORS) =>
      estimateMaintenance({ ...FULL, activityLevel }).kcal
    expect(at('sedentary')).toBe(2050)
    expect(at('light')).toBe(2250)
    expect(at('moderate')).toBe(2500)
  })

  it('falls back to the weight-only coefficient, and says so', () => {
    const estimate = estimateMaintenance({ weightKg: 78.3 })
    expect(estimate.fromProfile).toBe(false)
    expect(estimate.kcal).toBe(Math.round((78.3 * FALLBACK_MAINTENANCE_KCAL_PER_KG) / 50) * 50)
  })

  it('needs every field before it trusts the formula', () => {
    expect(estimateMaintenance({ weightKg: 78.3, heightCm: 178 }).fromProfile).toBe(false)
    expect(estimateMaintenance({ weightKg: 78.3, ageYears: 35, sex: 'male' }).fromProfile).toBe(
      false,
    )
  })

  it('keeps the fallback conservative — too high would cancel the deficit', () => {
    // The weight-only figure must not exceed what the formula gives a tall,
    // young body at the same weight, or the estimate quietly erases the cut.
    const crude = estimateMaintenance({ weightKg: 78.3 }).kcal
    const generous = estimateMaintenance({ ...FULL, heightCm: 190, ageYears: 25 }).kcal
    expect(crude).toBeLessThan(generous)
  })
})

describe('computeCalorieTargetKcal', () => {
  it('sits under maintenance — the point of the whole feature', () => {
    const maintenance = estimateMaintenance(FULL).kcal
    expect(computeCalorieTargetKcal(FULL)).toBeLessThan(maintenance)
    expect(computeCalorieTargetKcal(FULL)).toBe(2000)
  })

  it('defaults to a slight deficit rather than a diet', () => {
    expect(DEFAULT_DEFICIT_PERCENT).toBe(10)
    // A recomposition stops working long before an aggressive cut.
    expect(DEFAULT_DEFICIT_PERCENT).toBeLessThanOrEqual(15)
  })

  it('moves with the chosen deficit', () => {
    expect(computeCalorieTargetKcal(FULL, 0)).toBe(2250)
    expect(computeCalorieTargetKcal(FULL, 10)).toBe(2000)
    expect(computeCalorieTargetKcal(FULL, 15)).toBe(1900)
    expect(computeCalorieTargetKcal(FULL, 20)).toBe(1800)
  })

  it('treats a zero deficit as maintenance, not as a missing value', () => {
    expect(computeCalorieTargetKcal(FULL, 0)).toBe(estimateMaintenance(FULL).kcal)
  })

  it('every offered choice lands inside the allowed range', () => {
    for (const choice of DEFICIT_CHOICES) {
      for (const weightKg of [45, 78.3, 140]) {
        const target = computeCalorieTargetKcal({ ...FULL, weightKg }, choice)
        expect(target).toBeGreaterThanOrEqual(MIN_CALORIE_TARGET_KCAL)
        expect(target).toBeLessThanOrEqual(MAX_CALORIE_TARGET_KCAL)
      }
    }
  })

  it('works before the profile exists', () => {
    expect(computeCalorieTargetKcal({ weightKg: 78.3 })).toBe(1900)
  })
})

describe('clamps', () => {
  it('refuses a deficit deep enough to be a different app', () => {
    expect(clampDeficitPercent(80)).toBe(30)
    expect(clampDeficitPercent(-10)).toBe(0)
    expect(clampDeficitPercent(Number.NaN)).toBe(DEFAULT_DEFICIT_PERCENT)
  })

  it('holds height and age to plausible human values', () => {
    expect(clampHeightCm(10)).toBe(120)
    expect(clampHeightCm(400)).toBe(250)
    expect(clampHeightCm(178.4)).toBe(178)
    expect(clampAgeYears(2)).toBe(14)
    expect(clampAgeYears(300)).toBe(100)
  })

  it('holds the manual override inside the same range', () => {
    expect(clampCalorieTargetKcal(400)).toBe(MIN_CALORIE_TARGET_KCAL)
    expect(clampCalorieTargetKcal(99999)).toBe(MAX_CALORIE_TARGET_KCAL)
    expect(clampCalorieTargetKcal(2200)).toBe(2200)
  })
})
