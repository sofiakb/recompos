/**
 * Turning an OpenFoodFacts record into something the journal can hold.
 *
 * The API is a community database: fields are optional, units vary, and a
 * product can exist with a name and nothing else. Everything tolerant lives
 * here, in pure functions, so the network layer stays a network layer and the
 * screen never has to ask what `serving_size: ""` means.
 */
import type { Food } from '@/lib/foods/food'

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

/** kJ per kcal, the factor the food industry rounds with. */
const KJ_PER_KCAL = 4.184

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

/** « g » or « ml » standing on its own — not the tail of « mg » or « dosette ». */
const UNIT = /(?:g|ml)\b/gi

const DIGIT = /[\d.,]/
const LETTER = /[a-z]/i

/**
 * The number a unit is attached to — « 168 ml », « 30 g » — wherever it sits.
 *
 * `serving_size` is free text and often names the thing before its weight :
 * « 1 dosette (168 ml) ». Taking the first number would answer 1, and a sheet
 * opening on « 1 g » is worse than one admitting it does not know. Millilitres
 * are read as grams, the usual approximation for a drink and the one the
 * per-100 g figures already make.
 *
 * Read unit first and digits backwards, by hand rather than by one regex: a
 * pattern that scans digits *then* looks for the unit re-walks them at every
 * start position, which is quadratic on a long label for nothing.
 */
function weighedAmount(text: string): number | null {
  for (const match of text.matchAll(UNIT)) {
    const at = match.index ?? 0
    // « 500 mg » is milligrams, not 500 grams.
    if (at > 0 && LETTER.test(text[at - 1])) continue
    let end = at
    while (end > 0 && text[end - 1] === ' ') end -= 1
    let start = end
    while (start > 0 && DIGIT.test(text[start - 1])) start -= 1
    const parsed = Number(text.slice(start, end).replace(',', '.'))
    if (Number.isFinite(parsed) && parsed > 0) return parsed
  }
  return null
}

/**
 * Grams for one serving, or nothing when the record names none.
 *
 * Absent rather than defaulted: falling back to 100 made « portion inconnue »
 * indistinguishable from « portion de 100 g », so nothing downstream could tell
 * whether counting in portions meant anything for this product.
 */
function servingGrams(record: Record<string, unknown>): number | undefined {
  const quantity = asNumber(record.serving_quantity)
  if (quantity !== null && quantity > 0) return Math.round(quantity)
  const size = weighedAmount(asText(record.serving_size))
  return size !== null ? Math.round(size) : undefined
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

export function parseProduct(raw: unknown): Food {
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
    id: code,
    source: 'off',
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
