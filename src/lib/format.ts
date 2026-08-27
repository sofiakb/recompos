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
