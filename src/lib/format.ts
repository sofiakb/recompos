/**
 * A number as French writes it: comma for the decimal mark, nothing added when
 * the value is whole.
 *
 * Weights and waist measurements are fractional and go straight into French
 * copy, where a raw JavaScript number shows up as « 78.4 ». The decimal point
 * was the one thing in the app still speaking English.
 */
export function formatDecimal(value: number): string {
  return String(value).replace('.', ',')
}

/**
 * Grouping is a locale's business, not ours.
 *
 * Normalised afterwards all the same: `fr-FR` returns a narrow no-break space
 * (U+202F) on current ICU, but older builds — still shipping inside some
 * WebKits — return U+00A0. Pinning it keeps the figure the same shape whatever
 * phone the PWA is installed on, and keeps the assertion below meaningful.
 */
const FRENCH_INTEGER = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })

/**
 * A whole number as French writes it, with a thin space every three digits.
 *
 * `1850` is a string of digits; `1 850` is a number you read at a glance on a
 * dashboard.
 */
export function formatCount(value: number): string {
  return FRENCH_INTEGER.format(value).replaceAll('\u00a0', '\u202f')
}

/** The typographic minus (U+2212), not the hyphen: it aligns with the digits. */
function signOf(value: number): string {
  if (value > 0) return '+'
  if (value < 0) return '\u2212'
  return ''
}

/** A signed change, e.g. « −1,2 kg ». Zero carries no sign at all. */
export function formatSignedDelta(value: number, unit: string): string {
  return `${signOf(value)}${formatDecimal(Math.abs(value))} ${unit}`
}

/** Byte sizes in French units, for storage figures. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  const units = ['Ko', 'Mo', 'Go']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  // The fixed string, not the number: Number('2.0') is 2, which would drop the
  // one decimal this deliberately keeps under 10.
  return `${value.toFixed(value < 10 ? 1 : 0).replace('.', ',')} ${units[unit]}`
}
