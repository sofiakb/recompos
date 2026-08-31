/**
 * Re-reading a portion when its size changes.
 *
 * « Le riz c'était 200 g pas 150 » is the correction people actually make, and
 * before this the numbers underneath stayed where the model had put them: the
 * quantity said 200 g and the calories still described 150. Changing an amount
 * has to move the macros with it, or the breakdown quietly lies.
 */

export interface Macros {
  kcal: number
  proteinG: number
  carbsG: number
  fatG: number
}

/** A quantity and the macros that describe *that* quantity. */
export interface Portion extends Macros {
  quantity: string
}

const NUMBER = /\d+(?:[.,]\d+)?/

/** The leading number in « 150 g », « 1 nectarine » — null when there is none. */
export function amountOf(quantity: string): number | null {
  const match = NUMBER.exec(quantity)
  if (!match) return null
  const parsed = Number(match[0].replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

/**
 * What is left once the number is taken out: « g », « nectarine », « ».
 *
 * The trailing `s` goes too, so « 1 tranche » → « 2 tranches » still counts as
 * the same thing in a larger amount. It only has to be *consistent*, not
 * grammatical — both sides are normalised the same way.
 */
function unitOf(quantity: string): string {
  return quantity.replace(NUMBER, ' ').trim().toLowerCase().replace(/\s+/g, ' ').replace(/s$/, '')
}

/**
 * The macros `basis` becomes at `quantity`, or null when the edit cannot be read
 * as a change of size.
 *
 * Null is a deliberate no-op rather than a zero: half-typed states pass through
 * here on every keystroke — « 150 g » is briefly « 150 » while the unit is being
 * retyped — and blanking someone's numbers mid-word would be worse than waiting.
 * Every call scales from the same basis instead of from the previous result, so
 * typing and deleting a digit cannot round the figures away.
 */
export function rescale(basis: Portion, quantity: string): Macros | null {
  const from = amountOf(basis.quantity)
  const to = amountOf(quantity)
  if (from === null || to === null || from <= 0 || to < 0) return null
  if (unitOf(basis.quantity) !== unitOf(quantity)) return null

  const ratio = to / from
  return {
    kcal: Math.round(basis.kcal * ratio),
    proteinG: Math.round(basis.proteinG * ratio),
    carbsG: Math.round(basis.carbsG * ratio),
    fatG: Math.round(basis.fatG * ratio),
  }
}

/** Grams and millilitres move by tens; anything counted moves by halves. */
const MEASURED: ReadonlySet<string> = new Set(['g', 'gr', 'gramme', 'ml', 'cl'])

/** The word a counted portion is written with, and read back by. */
export const PORTION_UNIT = 'portion'

/** « 0,5 portion », « 1 portion », « 2 portions » — French takes the plural at two. */
export function formatPortions(count: number): string {
  return `${frenchNumber(count)} ${PORTION_UNIT}${count >= 2 ? 's' : ''}`
}

/** True when the quantity is a weight rather than a count of something. */
export function isWeighed(quantity: string): boolean {
  return MEASURED.has(unitOf(quantity))
}

/** True when the quantity counts portions — « 1,5 portion ». */
export function isPortions(quantity: string): boolean {
  return unitOf(quantity) === PORTION_UNIT
}

function stepOf(quantity: string): number {
  return MEASURED.has(unitOf(quantity)) ? 10 : 0.5
}

/** « 1,5 » rather than « 1.5 » — the field is read in French. */
function frenchNumber(value: number): string {
  return String(Math.round(value * 10) / 10).replace('.', ',')
}

/**
 * One press of `−` or `+`, written back into the quantity as it was phrased.
 *
 * The rest of the string is left alone: « 1 cuisse (~150 g) » becomes « 2 cuisse
 * (~150 g) », not a rewritten sentence. The number is the only thing the button
 * claims to know about.
 */
export function stepQuantity(quantity: string, direction: 1 | -1): string {
  const amount = amountOf(quantity)
  if (amount === null) return quantity
  const step = stepOf(quantity)
  const next = Math.max(0, Math.round((amount + direction * step) * 10) / 10)
  // Portions are the one unit the app writes itself, so it also owns their
  // plural. Everything else keeps the wording it arrived with.
  return isPortions(quantity) ? formatPortions(next) : quantity.replace(NUMBER, frenchNumber(next))
}

/**
 * The handful of amounts worth one tap, or none at all.
 *
 * Only for what is weighed or poured: « 2 cuisses » would need a plural this
 * module has no business inventing, and a stepper already covers it.
 */
export function quantityChips(quantity: string): string[] {
  const unit = unitOf(quantity)
  if (!MEASURED.has(unit)) return []
  return [50, 100, 150, 200].map((amount) => `${amount} ${unit}`)
}

/**
 * The same amount, said in the other unit.
 *
 * A portion is only ever a weight in disguise: 252 g of something whose portion
 * weighs 168 is 1,5 portion, and back again. Converting rather than rescaling
 * on purpose — nothing is eaten or un-eaten by switching how it is counted, so
 * the macros do not move.
 *
 * Null when the switch cannot be made honestly: no number to read, or no
 * portion weight to divide by.
 */
export function convertUnit(
  quantity: string,
  servingGrams: number,
  to: 'grams' | 'portions',
): string | null {
  const amount = amountOf(quantity)
  if (amount === null || servingGrams <= 0) return null
  if (to === 'grams') {
    return isPortions(quantity) ? `${Math.round(amount * servingGrams)} g` : quantity
  }
  if (isPortions(quantity)) return quantity
  return formatPortions(Math.round((amount / servingGrams) * 10) / 10)
}

/** The portions worth one tap. Halves included: half a pod is a real answer. */
export function portionChips(): string[] {
  return [0.5, 1, 2, 3].map(formatPortions)
}
