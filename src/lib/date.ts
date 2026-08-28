/**
 * Logical days, not calendar days.
 *
 * A protein logged at 01:00 belongs to the evening that preceded it, so every
 * date key in the app is computed against a 04:00 rollover. This constant is the
 * single source of truth for that rule (PRD §6.2).
 */
export const DAY_ROLLOVER_HOUR = 4

export type IsoDate = string // 'YYYY-MM-DD'

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

/** Formats a Date as a 'YYYY-MM-DD' key in local time. */
export function formatIsoDate(date: Date): IsoDate {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** The logical day a given instant belongs to. */
export function toLogicalDate(instant: Date = new Date()): IsoDate {
  const shifted = new Date(instant.getTime())
  if (shifted.getHours() < DAY_ROLLOVER_HOUR) {
    shifted.setDate(shifted.getDate() - 1)
  }
  return formatIsoDate(shifted)
}

/** Parses a 'YYYY-MM-DD' key into a local Date at midnight. */
export function parseIsoDate(date: IsoDate): Date {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** The date key `days` after `date`; a negative count walks backwards. */
export function addDays(date: IsoDate, days: number): IsoDate {
  const shifted = parseIsoDate(date)
  shifted.setDate(shifted.getDate() + days)
  return formatIsoDate(shifted)
}

/** Signed number of calendar days from `from` to `to`. */
export function daysBetween(from: IsoDate, to: IsoDate): number {
  const a = parseIsoDate(from)
  const b = parseIsoDate(to)
  // Compare at noon so a DST shift cannot round the difference to the wrong day.
  a.setHours(12, 0, 0, 0)
  b.setHours(12, 0, 0, 0)
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

/** `count` consecutive date keys ending at `end` (inclusive), oldest first. */
export function lastDays(count: number, end: IsoDate = toLogicalDate()): IsoDate[] {
  const base = parseIsoDate(end)
  const days: IsoDate[] = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(base.getTime())
    d.setDate(d.getDate() - i)
    days.push(formatIsoDate(d))
  }
  return days
}

/** Human label for a date key, e.g. « samedi 22 août ». */
export function formatLongDate(date: IsoDate, locale = 'fr-FR'): string {
  return parseIsoDate(date).toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

/**
 * A date read once, months or years after the fact: the weekday is noise there,
 * and the year is the part that matters. Used for the install date.
 */
export function formatCalendarDate(date: IsoDate, locale = 'fr-FR'): string {
  return parseIsoDate(date).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
