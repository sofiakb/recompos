import { describe, expect, it } from 'vitest'
import {
  clampRestSeconds,
  elapsedSeconds,
  formatDuration,
  isElapsed,
  MAX_REST_SECONDS,
  MIN_REST_SECONDS,
  minutesBetween,
  remainingSeconds,
  REST_PRESETS,
} from '@/lib/timer'

const START = 1_000_000_000_000

describe('elapsedSeconds', () => {
  it('counts whole seconds since the start', () => {
    expect(elapsedSeconds(START, START + 5_400)).toBe(5)
  })

  it('never goes negative when the clock jumps backwards', () => {
    expect(elapsedSeconds(START, START - 10_000)).toBe(0)
  })
})

describe('remainingSeconds', () => {
  it('counts down from the duration', () => {
    expect(remainingSeconds(START, 90, START + 30_000)).toBe(60)
  })

  it('floors at zero instead of going negative', () => {
    // The screen was locked for two minutes on a 90 s rest.
    expect(remainingSeconds(START, 90, START + 120_000)).toBe(0)
    expect(isElapsed(START, 90, START + 120_000)).toBe(true)
  })

  it('is derived from the timestamp, so a skipped tick loses nothing', () => {
    expect(remainingSeconds(START, 60, START + 59_000)).toBe(1)
    expect(remainingSeconds(START, 60, START + 60_000)).toBe(0)
  })
})

describe('formatDuration', () => {
  it('pads the seconds', () => {
    expect(formatDuration(65)).toBe('1:05')
    expect(formatDuration(9)).toBe('0:09')
  })

  it('adds hours only when there are any', () => {
    expect(formatDuration(3_661)).toBe('1:01:01')
    expect(formatDuration(600)).toBe('10:00')
  })

  it('treats a negative duration as zero', () => {
    expect(formatDuration(-5)).toBe('0:00')
  })
})

describe('minutesBetween', () => {
  it('rounds to the nearest minute', () => {
    expect(minutesBetween('2026-08-22T10:00:00.000Z', '2026-08-22T10:20:20.000Z')).toBe(20)
    expect(minutesBetween('2026-08-22T10:00:00.000Z', '2026-08-22T10:20:40.000Z')).toBe(21)
  })

  it('never reports a negative session', () => {
    expect(minutesBetween('2026-08-22T10:20:00.000Z', '2026-08-22T10:00:00.000Z')).toBe(0)
  })
})

describe('clampRestSeconds', () => {
  it('keeps a plausible duration untouched', () => {
    expect(clampRestSeconds(120)).toBe(120)
  })

  it('holds the bounds instead of storing an absurd rest', () => {
    expect(clampRestSeconds(2)).toBe(MIN_REST_SECONDS)
    expect(clampRestSeconds(99_999)).toBe(MAX_REST_SECONDS)
  })

  it('rounds a typed decimal', () => {
    expect(clampRestSeconds(75.6)).toBe(76)
  })

  it('falls back to the first preset on a non-number', () => {
    expect(clampRestSeconds(Number.NaN)).toBe(REST_PRESETS[0])
  })
})
