import { describe, expect, it } from 'vitest'
import {
  DAY_ROLLOVER_HOUR,
  daysBetween,
  formatCalendarDate,
  formatIsoDate,
  lastDays,
  parseIsoDate,
  toLogicalDate,
} from '@/lib/date'

describe('toLogicalDate', () => {
  it('keeps an afternoon instant on its calendar day', () => {
    expect(toLogicalDate(new Date(2026, 7, 22, 14, 30))).toBe('2026-08-22')
  })

  it('attributes a late-night instant to the previous day', () => {
    // 03:59 is still "yesterday evening" for someone logging a shake before bed.
    expect(toLogicalDate(new Date(2026, 7, 22, 3, 59))).toBe('2026-08-21')
  })

  it('starts the new day exactly at the rollover hour', () => {
    expect(toLogicalDate(new Date(2026, 7, 22, DAY_ROLLOVER_HOUR, 0))).toBe('2026-08-22')
  })

  it('rolls back across a month boundary', () => {
    expect(toLogicalDate(new Date(2026, 8, 1, 2, 0))).toBe('2026-08-31')
  })

  it('rolls back across a year boundary', () => {
    expect(toLogicalDate(new Date(2026, 0, 1, 1, 0))).toBe('2025-12-31')
  })
})

describe('daysBetween', () => {
  it('counts forward days', () => {
    expect(daysBetween('2026-08-20', '2026-08-22')).toBe(2)
  })

  it('is signed', () => {
    expect(daysBetween('2026-08-22', '2026-08-20')).toBe(-2)
  })

  it('is zero for the same day', () => {
    expect(daysBetween('2026-08-22', '2026-08-22')).toBe(0)
  })

  it('crosses a month boundary', () => {
    expect(daysBetween('2026-08-30', '2026-09-02')).toBe(3)
  })

  it('survives a spring-forward DST transition', () => {
    // Europe/Paris springs forward on 2026-03-29; the day count must stay whole.
    expect(daysBetween('2026-03-28', '2026-03-30')).toBe(2)
  })

  it('survives a fall-back DST transition', () => {
    expect(daysBetween('2026-10-24', '2026-10-26')).toBe(2)
  })
})

describe('lastDays', () => {
  it('returns the window oldest first, end inclusive', () => {
    expect(lastDays(3, '2026-08-22')).toEqual(['2026-08-20', '2026-08-21', '2026-08-22'])
  })

  it('spans a month boundary', () => {
    expect(lastDays(2, '2026-09-01')).toEqual(['2026-08-31', '2026-09-01'])
  })
})

describe('parseIsoDate / formatIsoDate', () => {
  it('round-trips a date key', () => {
    expect(formatIsoDate(parseIsoDate('2026-01-05'))).toBe('2026-01-05')
  })
})

describe('formatCalendarDate', () => {
  it('names the year and drops the weekday', () => {
    // The install date is read long after the fact: "jeudi" tells nobody
    // anything, and without the year "27 août" is ambiguous by year two.
    expect(formatCalendarDate('2026-07-15')).toBe('15 juillet 2026')
  })

  it('reads the date as local, not as an instant', () => {
    expect(formatCalendarDate('2026-01-01')).toBe('1 janvier 2026')
  })
})
