/**
 * An edible thing with a nutrition table, whoever wrote the table.
 *
 * OpenFoodFacts knows branded products by barcode; the CIQUAL table knows plain
 * food — « nectarine, pulpe, crue » — which no barcode will ever describe. Both
 * answer the same two questions, so both land in this one shape and the sheets
 * downstream never ask where a figure came from.
 */
import type { MealItem } from '@/types/models'

export type FoodSource = 'off' | 'ciqual'

export interface FoodMacros {
  kcal: number
  proteinG: number
  carbsG: number
  fatG: number
}

export interface Food {
  /** Unique within its source: a barcode for OFF, the `alim_code` for CIQUAL. */
  id: string
  source: FoodSource
  name: string
  /** Brand for a packaged product; plain food has none. */
  brand?: string
  /**
   * Grams for one serving, when the record names one.
   *
   * Absent is a real answer: CIQUAL is a per-100 g table and names no portion,
   * and half of OpenFoodFacts says nothing either. The sheet then asks in grams
   * rather than pretending « une portion » means something here.
   */
  servingGrams?: number
  per100g: FoodMacros
  /**
   * Macros the record was missing, counted as zero.
   *
   * Surfaced rather than swallowed: a sheet reading « 0 g de glucides » is a
   * claim, and the user is entitled to know it was an absence.
   */
  missingMacros: string[]
}

/** Scales the per-100 g figures to what the user says they ate. */
export function toMealItem(food: Food, grams: number): MealItem {
  const ratio = Math.max(0, grams) / 100
  const scale = (value: number) => Math.round(value * ratio)
  return {
    name: food.brand ? `${food.name} (${food.brand})` : food.name,
    quantity: `${Math.round(Math.max(0, grams))} g`,
    kcal: scale(food.per100g.kcal),
    proteinG: scale(food.per100g.proteinG),
    carbsG: scale(food.per100g.carbsG),
    fatG: scale(food.per100g.fatG),
  }
}

/**
 * Accent- and case-blind, for matching « crème » against « creme ».
 *
 * Typing accents on a phone keyboard costs a long press each; nobody does it
 * while looking for a yoghurt.
 */
export function normalise(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}
