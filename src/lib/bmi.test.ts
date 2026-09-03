import { describe, expect, it } from 'vitest'
import {
  bmi,
  bmiBand,
  bmiPercent,
  healthyWeight,
  BMI_NORMAL_MAX,
  BMI_NORMAL_MIN,
  BMI_SCALE_MAX,
  BMI_SCALE_MIN,
} from '@/lib/bmi'

describe('bmi', () => {
  it('divides the weight by the square of the height in metres', () => {
    expect(bmi(78.4, 178)).toBe(24.7)
  })

  it('rounds to the one decimal the screen shows', () => {
    // 24.96 would print as « 25,0 » beside a band that still said « normale ».
    expect(bmi(79.1, 178)).toBe(25)
    expect(bmiBand(bmi(79.1, 178))).toBe('overweight')
  })
})

describe('bmiBand', () => {
  it('places each band on its lower bound', () => {
    expect(bmiBand(18.4)).toBe('underweight')
    expect(bmiBand(18.5)).toBe('normal')
    expect(bmiBand(24.9)).toBe('normal')
    expect(bmiBand(25)).toBe('overweight')
    expect(bmiBand(29.9)).toBe('overweight')
    expect(bmiBand(30)).toBe('obese')
  })
})

describe('bmiPercent', () => {
  it('puts the band boundaries where the rail draws them', () => {
    // The rail is four segments of 17.5 / 32.5 / 25 / 25 %; the labels sit on
    // those joins, so the cursor has to use the same scale or it would point
    // between two graduations that disagree with it.
    expect(bmiPercent(18.5)).toBeCloseTo(17.5)
    expect(bmiPercent(25)).toBeCloseTo(50)
    expect(bmiPercent(30)).toBeCloseTo(75)
  })

  it('pins rather than running off either end', () => {
    expect(bmiPercent(BMI_SCALE_MIN - 5)).toBe(0)
    expect(bmiPercent(BMI_SCALE_MAX + 5)).toBe(100)
  })
})

describe('healthyWeight', () => {
  // 1,74 m : la corpulence normale court de 56,0 à 75,7 kg.
  const HEIGHT = 174

  it('reads the band on the scale rather than on the index', () => {
    const healthy = healthyWeight(77, HEIGHT)

    expect(healthy.minKg).toBe(56)
    expect(healthy.maxKg).toBe(75.7)
  })

  it('points at the ceiling, and says how far below it sits', () => {
    const healthy = healthyWeight(77, HEIGHT)

    expect(healthy.boundKg).toBe(75.7)
    expect(healthy.boundIndex).toBe(BMI_NORMAL_MAX)
    expect(healthy.toGoKg).toBe(-1.3)
  })

  it('points at the floor for a body under it', () => {
    const healthy = healthyWeight(52, HEIGHT)

    expect(healthy.boundKg).toBe(56)
    expect(healthy.boundIndex).toBe(BMI_NORMAL_MIN)
    expect(healthy.toGoKg).toBe(4)
  })

  it('has no distance to report from inside the band', () => {
    expect(healthyWeight(70, HEIGHT).toGoKg).toBeNull()
  })

  /**
   * Someone inside the band keeps reading the ceiling. The alternative — the
   * nearer of the two bounds — makes the dashed line jump from one side of the
   * chart to the other as the weight drifts across the middle.
   */
  it('keeps naming the ceiling from just above the floor', () => {
    expect(healthyWeight(57, HEIGHT).boundKg).toBe(75.7)
  })

  it('scales with the height it is read on', () => {
    expect(healthyWeight(77, 190).maxKg).toBeGreaterThan(healthyWeight(77, 160).maxKg)
  })
})
