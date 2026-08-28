import { describe, expect, it } from 'vitest'
import { KCAL_PER_GRAM, macroTargetsG, mealTargetKcal, MEAL_SLOT_SHARE } from '@/lib/nutrition'
import type { MealSlot } from '@/types/models'

describe('mealTargetKcal', () => {
  it('splits a day the way the four meals were drawn', () => {
    expect(mealTargetKcal(1850, 'breakfast')).toBe(460)
    expect(mealTargetKcal(1850, 'lunch')).toBe(740)
    expect(mealTargetKcal(1850, 'dinner')).toBe(560)
    expect(mealTargetKcal(1850, 'snack')).toBe(90)
  })

  it('shares out the whole day, give or take the rounding', () => {
    const slots: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack']
    const total = slots.reduce((sum, slot) => sum + mealTargetKcal(2000, slot), 0)

    expect(total).toBe(2000)
    expect(Object.values(MEAL_SLOT_SHARE).reduce((sum, share) => sum + share, 0)).toBeCloseTo(1)
  })
})

describe('macroTargetsG', () => {
  it('serves protein first, then splits what is left 55/45', () => {
    expect(macroTargetsG(1850, 140)).toEqual({ proteinG: 140, carbsG: 175, fatG: 65 })
  })

  it('spends the whole budget, to within the 5 g rounding', () => {
    const targets = macroTargetsG(1850, 140)
    const spent =
      targets.proteinG * KCAL_PER_GRAM.protein +
      targets.carbsG * KCAL_PER_GRAM.carbs +
      targets.fatG * KCAL_PER_GRAM.fat

    // Two figures rounded to 5 g can drift by at most 10 and 22 kcal.
    expect(Math.abs(spent - 1850)).toBeLessThanOrEqual(35)
  })

  it('rounds to 5 g, like the protein target it derives from', () => {
    const targets = macroTargetsG(1850, 140)

    expect(targets.carbsG % 5).toBe(0)
    expect(targets.fatG % 5).toBe(0)
  })

  it('returns zeros rather than a confident negative when protein eats the budget', () => {
    // Reachable with a manual protein target and a manual calorie target that
    // disagree. A −40 g carb target would look exactly as authoritative as a
    // real one.
    expect(macroTargetsG(1200, 400)).toEqual({ proteinG: 400, carbsG: 0, fatG: 0 })
  })
})
