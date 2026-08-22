import { describe, expect, it } from 'vitest'
import {
  clampProteinTargetGrams,
  clampWeightKg,
  computeProteinTargetGrams,
  MAX_PROTEIN_TARGET_GRAMS,
  MIN_PROTEIN_TARGET_GRAMS,
  smoothedWeightKg,
} from '@/lib/nutrition'

describe('computeProteinTargetGrams', () => {
  it('applies 1,8 g/kg rounded to the nearest 5 g', () => {
    expect(computeProteinTargetGrams(80)).toBe(145) // 144 → 145
    expect(computeProteinTargetGrams(70)).toBe(125) // 126 → 125
    expect(computeProteinTargetGrams(90)).toBe(160) // 162 → 160
  })

  it('clamps a very light body weight to the floor', () => {
    expect(computeProteinTargetGrams(40)).toBe(MIN_PROTEIN_TARGET_GRAMS)
  })

  it('clamps a very heavy body weight to the ceiling', () => {
    expect(computeProteinTargetGrams(200)).toBe(MAX_PROTEIN_TARGET_GRAMS)
  })

  it('moves the target when weight moves', () => {
    expect(computeProteinTargetGrams(85)).toBeGreaterThan(computeProteinTargetGrams(80))
  })
})

describe('smoothedWeightKg', () => {
  it('averages the four most recent weigh-ins', () => {
    expect(smoothedWeightKg([80, 81, 79, 80])).toBe(80)
  })

  it('ignores anything older than the smoothing window', () => {
    // The 60 kg entry is the fifth point and must not drag the average down.
    expect(smoothedWeightKg([80, 80, 80, 80, 60])).toBe(80)
  })

  it('works with a single weigh-in', () => {
    expect(smoothedWeightKg([82.4])).toBe(82.4)
  })

  it('returns null when nothing has been logged', () => {
    expect(smoothedWeightKg([])).toBeNull()
  })

  it('rounds to one decimal', () => {
    expect(smoothedWeightKg([80.1, 80.2])).toBe(80.2)
  })

  it('dampens a one-off water swing', () => {
    // A +2 kg spike moves the smoothed value by 0.5 kg, not 2.
    const steady = smoothedWeightKg([80, 80, 80, 80])!
    const spiked = smoothedWeightKg([82, 80, 80, 80])!
    expect(spiked - steady).toBeCloseTo(0.5, 5)
  })
})

describe('clamps', () => {
  it('keeps weight inside a plausible human range and one decimal', () => {
    expect(clampWeightKg(80.44)).toBe(80.4)
    expect(clampWeightKg(5)).toBe(35)
    expect(clampWeightKg(400)).toBe(250)
  })

  it('keeps a manual protein target inside its bounds', () => {
    expect(clampProteinTargetGrams(10)).toBe(MIN_PROTEIN_TARGET_GRAMS)
    expect(clampProteinTargetGrams(999)).toBe(MAX_PROTEIN_TARGET_GRAMS)
    expect(clampProteinTargetGrams(147.6)).toBe(148)
  })
})
