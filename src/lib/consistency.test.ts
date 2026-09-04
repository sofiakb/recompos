import { describe, expect, it } from 'vitest'
import { bandFor, consistencyScore, dayNumber, mealStreak } from '@/lib/consistency'

const TODAY = '2026-08-22'

describe('consistencyScore', () => {
  it('caps the denominator at the days since install', () => {
    // Day two of use with one day done is 50%, not 14% out of a 7-day window.
    const score = consistencyScore(7, ['2026-08-21'], '2026-08-21', TODAY)
    expect(score.eligible).toBe(2)
    expect(score.completed).toBe(1)
    expect(score.percent).toBe(50)
  })

  it('uses the full window once enough days have passed', () => {
    const done = ['2026-08-18', '2026-08-19', '2026-08-20', '2026-08-21', '2026-08-22']
    const score = consistencyScore(7, done, '2026-01-01', TODAY)
    expect(score.eligible).toBe(7)
    expect(score.completed).toBe(5)
    expect(score.percent).toBe(71)
  })

  it('ignores days outside the window', () => {
    const score = consistencyScore(7, ['2026-08-01', '2026-08-22'], '2026-01-01', TODAY)
    expect(score.completed).toBe(1)
  })

  it('reports 100% when every eligible day is done', () => {
    const done = ['2026-08-20', '2026-08-21', '2026-08-22']
    expect(consistencyScore(7, done, '2026-08-20', TODAY).percent).toBe(100)
  })

  it('reports 0% without ever throwing on an empty history', () => {
    const score = consistencyScore(30, [], '2026-08-22', TODAY)
    expect(score.percent).toBe(0)
    expect(score.eligible).toBe(1)
  })

  it('never divides by zero on install day', () => {
    expect(consistencyScore(7, [], TODAY, TODAY).eligible).toBe(1)
  })

  it('bends rather than resets after a gap', () => {
    // Three weeks off then back today: the score drops, it does not zero out.
    const score = consistencyScore(
      30,
      ['2026-08-22', '2026-08-01', '2026-07-31'],
      '2026-01-01',
      TODAY,
    )
    expect(score.completed).toBe(3)
    expect(score.percent).toBe(10)
    expect(score.band).toBe('restart')
  })
})

describe('bandFor', () => {
  it('maps percentages to non-judgmental bands', () => {
    expect(bandFor(0)).toBe('restart')
    expect(bandFor(49)).toBe('restart')
    expect(bandFor(50)).toBe('onTrack')
    expect(bandFor(79)).toBe('onTrack')
    expect(bandFor(80)).toBe('solid')
    expect(bandFor(100)).toBe('solid')
  })
})

describe('dayNumber', () => {
  it('counts the install day as day 1', () => {
    expect(dayNumber(TODAY, TODAY)).toBe(1)
  })

  it('counts elapsed days, not consecutive completed ones', () => {
    expect(dayNumber('2026-05-24', TODAY)).toBe(91)
  })
})

describe('mealStreak', () => {
  const TODAY = '2026-09-04'

  it('compte les jours d’affilée jusqu’à aujourd’hui', () => {
    expect(mealStreak(['2026-09-02', '2026-09-03', '2026-09-04'], TODAY)).toBe(3)
  })

  it('s’arrête au premier trou, sans compter ce qu’il y a derrière', () => {
    const days = ['2026-08-20', '2026-08-21', '2026-09-03', '2026-09-04']
    expect(mealStreak(days, TODAY)).toBe(2)
  })

  it('tient pendant la journée en cours, tant qu’elle n’est pas finie', () => {
    // Rien de noté ce matin : la série de la veille tient jusqu’à minuit.
    expect(mealStreak(['2026-09-02', '2026-09-03'], TODAY)).toBe(2)
  })

  it('tombe à zéro une fois la journée manquée passée', () => {
    expect(mealStreak(['2026-09-01', '2026-09-02'], TODAY)).toBe(0)
  })

  it('vaut un le premier jour', () => {
    expect(mealStreak([TODAY], TODAY)).toBe(1)
    expect(mealStreak([], TODAY)).toBe(0)
  })

  it('ignore les jours à venir', () => {
    expect(mealStreak(['2026-09-04', '2026-09-05'], TODAY)).toBe(1)
  })
})
