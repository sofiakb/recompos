import { describe, expect, it } from 'vitest'
import { DEFAULT_LOAD, isAtTopOfRange, suggestNextSet, REP_STEP } from '@/lib/overload'
import type { Exercise, ExerciseSet, SetDifficulty } from '@/types/models'

const PUSHUP: Exercise = {
  id: 'pushup',
  name: 'Pompes',
  pattern: 'push',
  defaultRepRange: [8, 15],
  progressionChain: ['decline-pushup'],
  isCustom: false,
}

const DECLINE: Exercise = {
  id: 'decline-pushup',
  name: 'Pompes surélevées',
  pattern: 'push',
  defaultRepRange: [6, 12],
  isCustom: false,
}

const resolve = (id: string) => (id === 'decline-pushup' ? DECLINE : undefined)

function set(reps: number, difficulty: SetDifficulty, load = 'Poids du corps'): ExerciseSet {
  return {
    id: 's',
    exerciseId: 'pushup',
    reps,
    loadOrResistance: load,
    difficulty,
    date: '2026-08-22',
    timestamp: '2026-08-22T10:00:00.000Z',
  }
}

describe('suggestNextSet', () => {
  it('starts at the bottom of the range with no history', () => {
    expect(suggestNextSet(PUSHUP, null, resolve)).toEqual({
      exerciseId: 'pushup',
      reps: 8,
      loadOrResistance: DEFAULT_LOAD,
    })
  })

  it('adds two reps after an easy set', () => {
    expect(suggestNextSet(PUSHUP, set(10, 'easy'), resolve).reps).toBe(12)
  })

  it('adds one rep after a set on target', () => {
    expect(suggestNextSet(PUSHUP, set(10, 'target'), resolve).reps).toBe(11)
  })

  it('repeats a hard set verbatim', () => {
    const suggestion = suggestNextSet(PUSHUP, set(10, 'hard', '2 × 8 kg'), resolve)
    expect(suggestion.reps).toBe(10)
    expect(suggestion.loadOrResistance).toBe('2 × 8 kg')
    expect(suggestion.exerciseId).toBe('pushup')
  })

  it('repeats a hard set even at the top of the range', () => {
    const suggestion = suggestNextSet(PUSHUP, set(15, 'hard'), resolve)
    expect(suggestion.exerciseId).toBe('pushup')
    expect(suggestion.reps).toBe(15)
  })

  it('moves to the harder variant when the range is exceeded', () => {
    const suggestion = suggestNextSet(PUSHUP, set(15, 'easy'), resolve)
    expect(suggestion.exerciseId).toBe('decline-pushup')
    expect(suggestion.reps).toBe(6)
    expect(suggestion.progressedFromExerciseId).toBe('pushup')
  })

  it('carries the load over on a plain rep bump but resets it on a progression', () => {
    expect(
      suggestNextSet(PUSHUP, set(10, 'easy', 'élastique rouge'), resolve).loadOrResistance,
    ).toBe('élastique rouge')
    expect(
      suggestNextSet(PUSHUP, set(15, 'easy', 'élastique rouge'), resolve).loadOrResistance,
    ).toBe(DEFAULT_LOAD)
  })

  it('holds the top of the range when no progression exists', () => {
    const suggestion = suggestNextSet(DECLINE, set(12, 'easy'), resolve)
    expect(suggestion.exerciseId).toBe('decline-pushup')
    expect(suggestion.reps).toBe(12)
    expect(suggestion.progressedFromExerciseId).toBeUndefined()
  })

  it('holds the top of the range when the chain names a missing exercise', () => {
    const orphan: Exercise = { ...PUSHUP, progressionChain: ['does-not-exist'] }
    expect(suggestNextSet(orphan, set(15, 'easy'), resolve).exerciseId).toBe('pushup')
  })

  it('lands exactly on the top of the range without progressing', () => {
    // 14 + 1 = 15, which is the top: still the same exercise.
    expect(suggestNextSet(PUSHUP, set(14, 'target'), resolve).exerciseId).toBe('pushup')
    expect(suggestNextSet(PUSHUP, set(14, 'target'), resolve).reps).toBe(15)
  })
})

describe('REP_STEP', () => {
  it('never suggests going backwards', () => {
    expect(Object.values(REP_STEP).every((step) => step >= 0)).toBe(true)
  })
})

describe('isAtTopOfRange', () => {
  it('is true at and above the top', () => {
    expect(isAtTopOfRange(PUSHUP, 15)).toBe(true)
    expect(isAtTopOfRange(PUSHUP, 16)).toBe(true)
    expect(isAtTopOfRange(PUSHUP, 14)).toBe(false)
  })
})
