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
