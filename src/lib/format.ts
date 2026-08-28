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
 * A whole number as French writes it, with a thin space every three digits.
 *
 * `1850` is a string of digits; `1 850` is a number you can read at a glance on
 * a dashboard. A narrow no-break space (U+202F) rather than a plain one so the
 * grouping never wraps mid-number at the end of a line.
 *
 * Counted rather than matched. The usual `/\B(?=(\d{3})+(?!\d))/g` backtracks
 * on a long run of digits; a single pass cannot, and reads no worse.
 */
export function formatCount(value: number): string {
  const rounded = Math.round(value).toString()
  const negative = rounded.startsWith('-')
  const digits = negative ? rounded.slice(1) : rounded

  let grouped = ''
  for (let index = 0; index < digits.length; index += 1) {
    if (index > 0 && (digits.length - index) % 3 === 0) grouped += '\u202f'
    grouped += digits[index]
  }
  return negative ? `-${grouped}` : grouped
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
