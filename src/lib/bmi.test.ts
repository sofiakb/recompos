import { describe, expect, it } from 'vitest'
import { bmi, bmiBand, bmiPercent, BMI_SCALE_MAX, BMI_SCALE_MIN } from '@/lib/bmi'

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
