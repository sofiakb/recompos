/**
 * Turning an OpenFoodFacts record into something the journal can hold.
 *
 * The API is a community database: fields are optional, units vary, and a
 * product can exist with a name and nothing else. Everything tolerant lives
 * here, in pure functions, so the network layer stays a network layer and the
 * screen never has to ask what `serving_size: ""` means.
 */
import type { MealItem } from '@/types/models'

export type OffErrorKind = 'not_found' | 'no_nutriments' | 'network' | 'server' | 'bad_response'

export class OffError extends Error {
  constructor(
    readonly kind: OffErrorKind,
    message: string,
  ) {
    super(message)
    this.name = 'OffError'
  }
}

export interface OffProduct {
  code: string
  name: string
  brand?: string
  /** Grams for one serving; 100 when the record does not say. */
  servingGrams: number
  per100g: { kcal: number; proteinG: number; carbsG: number; fatG: number }
  /**
   * Macros the record was missing, counted as zero.
   *
   * Surfaced rather than swallowed: a product sheet reading « 0 g de glucides »
   * is a claim, and the user is entitled to know it was an absence.
   */
  missingMacros: string[]
}

/** kJ per kcal, the factor the food industry rounds with. */
const KJ_PER_KCAL = 4.184

const DEFAULT_SERVING_G = 100

function asNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value !== 'string') return null
  const match = /-?\d+(\.\d+)?/.exec(value.replace(',', '.'))
  if (!match) return null
  const parsed = Number(match[0])
  return Number.isFinite(parsed) ? parsed : null
}

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/** Grams for one serving, from whichever of the two fields carries it. */
function servingGrams(record: Record<string, unknown>): number {
  const quantity = asNumber(record.serving_quantity)
  if (quantity !== null && quantity > 0) return Math.round(quantity)
  const size = asNumber(record.serving_size)
  if (size !== null && size > 0) return Math.round(size)
  return DEFAULT_SERVING_G
}

/**
 * Energy per 100 g, in kcal.
 *
 * A good part of the database carries kilojoules only, so a missing
 * `energy-kcal_100g` is a conversion away rather than a missing product.
 */
function kcalPer100g(nutriments: Record<string, unknown>): number | null {
  const direct = asNumber(nutriments['energy-kcal_100g'])
  if (direct !== null) return Math.round(direct)
  const kj = asNumber(nutriments.energy_100g)
  return kj !== null ? Math.round(kj / KJ_PER_KCAL) : null
}

export function parseProduct(raw: unknown): OffProduct {
  if (!raw || typeof raw !== 'object') {
    throw new OffError('bad_response', 'Réponse illisible')
  }
  const record = raw as Record<string, unknown>
  const nutriments = (record.nutriments ?? {}) as Record<string, unknown>

  const kcal = kcalPer100g(nutriments)

  const macros = {
    proteinG: asNumber(nutriments.proteins_100g),
    carbsG: asNumber(nutriments.carbohydrates_100g),
    fatG: asNumber(nutriments.fat_100g),
  }
  const missingMacros = Object.entries(macros)
    .filter(([, value]) => value === null)
    .map(([key]) => key)

  // No energy, or nothing but energy: whatever this record is, it is not a
  // nutrition table, and a sheet full of zeros would be a lie with a button on it.
  if (kcal === null || missingMacros.length === 3) {
    throw new OffError('no_nutriments', 'Valeurs nutritionnelles absentes')
  }

  const code = asText(record.code)
  return {
    code,
    name: asText(record.product_name_fr) || asText(record.product_name) || code,
    brand: asText(record.brands).split(',')[0]?.trim() || undefined,
    servingGrams: servingGrams(record),
    per100g: {
      kcal,
      proteinG: macros.proteinG ?? 0,
      carbsG: macros.carbsG ?? 0,
      fatG: macros.fatG ?? 0,
    },
    missingMacros,
  }
}

/** Scales the per-100 g figures to what the user says they ate. */
export function toMealItem(product: OffProduct, grams: number): MealItem {
  const ratio = Math.max(0, grams) / 100
  const scale = (value: number) => Math.round(value * ratio)
  return {
    name: product.brand ? `${product.name} (${product.brand})` : product.name,
    quantity: `${Math.round(Math.max(0, grams))} g`,
    kcal: scale(product.per100g.kcal),
    proteinG: scale(product.per100g.proteinG),
    carbsG: scale(product.per100g.carbsG),
    fatG: scale(product.per100g.fatG),
  }
}
