/**
 * Elastic consistency (PRD §6.1).
 *
 * Deliberately not a streak: missing a day lowers a rolling percentage and
 * nothing resets. The denominator is capped at the number of days since install
 * so a brand-new user is not shown 14% on day two.
 */
import { daysBetween, lastDays, toLogicalDate, type IsoDate } from '@/lib/date'

export type ConsistencyBand = 'restart' | 'onTrack' | 'solid'

export interface ConsistencyScore {
  /** 0-100, rounded. */
  percent: number
  /** Days credited in the window. */
  completed: number
  /** Days actually eligible — never more than the days since install. */
  eligible: number
  band: ConsistencyBand
}

export function bandFor(percent: number): ConsistencyBand {
  if (percent >= 80) return 'solid'
  if (percent >= 50) return 'onTrack'
  return 'restart'
}

/**
 * @param windowDays 7 or 30
 * @param completedDates date keys where the floor was completed
 * @param installedOn the first day the app could have been used
 */
export function consistencyScore(
  windowDays: number,
  completedDates: Iterable<IsoDate>,
  installedOn: IsoDate,
  today: IsoDate = toLogicalDate(),
): ConsistencyScore {
  const completedSet = completedDates instanceof Set ? completedDates : new Set(completedDates)
  const daysSinceInstall = daysBetween(installedOn, today) + 1 // install day counts
  const eligible = Math.max(1, Math.min(windowDays, daysSinceInstall))
  const window = lastDays(eligible, today)
  const completed = window.reduce((n, day) => (completedSet.has(day) ? n + 1 : n), 0)
  const percent = Math.round((completed / eligible) * 100)
  return { percent, completed, eligible, band: bandFor(percent) }
}

/** Cumulative milestone — « Jour N », never a countdown to a deadline. */
export function dayNumber(installedOn: IsoDate, today: IsoDate = toLogicalDate()): number {
  return Math.max(1, daysBetween(installedOn, today) + 1)
}
