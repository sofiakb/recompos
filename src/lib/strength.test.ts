import { describe, expect, it } from 'vitest'
import {
  bestSets,
  loadFactor,
  movingAverage,
  parseLoadKg,
  setVolume,
  strengthIndex,
  weeklyVolume,
} from '@/lib/strength'
import type { ExerciseSet } from '@/types/models'

function set(overrides: Partial<ExerciseSet> = {}): ExerciseSet {
  return {
    id: Math.random().toString(36).slice(2),
    exerciseId: 'pushup',
    reps: 10,
    loadOrResistance: 'Poids du corps',
    difficulty: 'target',
    date: '2026-08-19',
    timestamp: '2026-08-19T10:00:00.000Z',
    ...overrides,
  }
}

describe('parseLoadKg', () => {
  it('reads a plain load', () => {
    expect(parseLoadKg('12 kg')).toBe(12)
    expect(parseLoadKg('8kg')).toBe(8)
    expect(parseLoadKg('7,5 kg')).toBe(7.5)
  })

  it('multiplies a paired load', () => {
    expect(parseLoadKg('2 × 8 kg')).toBe(16)
    expect(parseLoadKg('2x8kg')).toBe(16)
  })

  it('returns null rather than guessing at text with no kilos', () => {
    expect(parseLoadKg('Poids du corps')).toBeNull()
    expect(parseLoadKg('élastique rouge')).toBeNull()
    expect(parseLoadKg('')).toBeNull()
  })
})

describe('loadFactor', () => {
  it('counts a bodyweight set as one', () => {
    expect(loadFactor(null, 80)).toBe(1)
    expect(loadFactor(0, 80)).toBe(1)
  })

  it('adds the load as a fraction of bodyweight', () => {
    expect(loadFactor(8, 80)).toBeCloseTo(1.1)
  })

  it('falls back to a reference bodyweight rather than dividing by zero', () => {
    expect(Number.isFinite(loadFactor(10, 0))).toBe(true)
  })
})

describe('setVolume', () => {
  it('is reps for a bodyweight set', () => {
    expect(setVolume(set({ reps: 12 }), 80)).toBe(12)
  })

  it('scales gently with added load instead of exploding', () => {
    const loaded = setVolume(set({ reps: 10, loadOrResistance: '8 kg' }), 80)
    expect(loaded).toBeCloseTo(11)
  })
})

describe('weeklyVolume', () => {
  const TODAY = '2026-08-22'

  it('keeps empty weeks at zero rather than dropping them', () => {
    const weeks = weeklyVolume([set({ date: TODAY })], 80, 4, TODAY)
    expect(weeks).toHaveLength(4)
    expect(weeks.slice(0, 3).every((week) => week.volume === 0)).toBe(true)
    expect(weeks[3].volume).toBe(10)
  })

  it('buckets by the Monday of the set’s week', () => {
    // 2026-08-19 is the Wednesday of the week starting 2026-08-17.
    const weeks = weeklyVolume([set({ date: '2026-08-19' })], 80, 2, TODAY)
    expect(weeks[1].weekStart).toBe('2026-08-17')
    expect(weeks[1].setCount).toBe(1)
  })

  it('ignores sets older than the window', () => {
    const weeks = weeklyVolume([set({ date: '2026-01-05' })], 80, 4, TODAY)
    expect(weeks.every((week) => week.volume === 0)).toBe(true)
  })
})

describe('strengthIndex', () => {
  it('bases 100 on the first week with any volume', () => {
    const points = strengthIndex([
      { weekStart: '2026-08-03', volume: 0, setCount: 0 },
      { weekStart: '2026-08-10', volume: 100, setCount: 10 },
      { weekStart: '2026-08-17', volume: 130, setCount: 13 },
    ])
    expect(points.map((point) => point.index)).toEqual([0, 100, 130])
  })

  it('returns zeroes rather than dividing by zero on an empty history', () => {
    const points = strengthIndex([{ weekStart: '2026-08-17', volume: 0, setCount: 0 }])
    expect(points[0].index).toBe(0)
  })
})

describe('bestSets', () => {
  it('keeps the highest-volume set per movement', () => {
    const best = bestSets(
      [
        set({ id: 'a', reps: 10 }),
        set({ id: 'b', reps: 15 }),
        set({ id: 'c', exerciseId: 'band-row', reps: 12 }),
      ],
      80,
    )
    expect(best.get('pushup')?.id).toBe('b')
    expect(best.get('band-row')?.id).toBe('c')
  })
})

describe('movingAverage', () => {
  it('stays null until the window is full', () => {
    expect(movingAverage([1, 2, 3, 4, 5], 4)).toEqual([null, null, null, 2.5, 3.5])
  })

  it('averages over what exists when the series is shorter than the window', () => {
    expect(movingAverage([80, 82], 4)).toEqual([null, 81])
  })
})
