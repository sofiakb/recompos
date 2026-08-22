import { describe, expect, it } from 'vitest'
import { buildHeatmap, monthLabels, startOfWeek, DAYS_PER_WEEK } from '@/lib/heatmap'

describe('startOfWeek', () => {
  it('returns the Monday of the week', () => {
    // 2026-08-22 is a Saturday.
    expect(startOfWeek('2026-08-22')).toBe('2026-08-17')
  })

  it('leaves a Monday untouched', () => {
    expect(startOfWeek('2026-08-17')).toBe('2026-08-17')
  })

  it('walks back to the previous Monday on a Sunday', () => {
    expect(startOfWeek('2026-08-23')).toBe('2026-08-17')
  })
})

describe('buildHeatmap', () => {
  const today = '2026-08-22'
  const installedOn = '2026-08-10'

  it('builds 12 columns of 7 days', () => {
    const grid = buildHeatmap([], installedOn, today)
    expect(grid).toHaveLength(12)
    expect(grid.every((week) => week.length === DAYS_PER_WEEK)).toBe(true)
  })

  it('ends on the Sunday of the current week', () => {
    const grid = buildHeatmap([], installedOn, today)
    expect(grid[grid.length - 1][DAYS_PER_WEEK - 1].date).toBe('2026-08-23')
  })

  it('marks completed days done', () => {
    const grid = buildHeatmap(['2026-08-20'], installedOn, today)
    const cell = grid.flat().find((c) => c.date === '2026-08-20')
    expect(cell?.state).toBe('done')
  })

  it('marks days before the install as preInstall, not missed', () => {
    const grid = buildHeatmap([], installedOn, today)
    expect(grid.flat().find((c) => c.date === '2026-08-09')?.state).toBe('preInstall')
    expect(grid.flat().find((c) => c.date === '2026-08-11')?.state).toBe('missed')
  })

  it('marks days after today as future', () => {
    const grid = buildHeatmap([], installedOn, today)
    expect(grid.flat().find((c) => c.date === '2026-08-23')?.state).toBe('future')
    expect(grid.flat().find((c) => c.date === today)?.state).toBe('missed')
  })

  it('never marks a day both done and out of range', () => {
    const grid = buildHeatmap([today], installedOn, today)
    expect(grid.flat().find((c) => c.date === today)?.state).toBe('done')
  })
})

describe('monthLabels', () => {
  it('labels a column only when its month changes', () => {
    const grid = buildHeatmap([], '2026-06-01', '2026-08-22')
    const labels = monthLabels(grid)
    expect(labels).toHaveLength(grid.length)
    expect(labels.filter(Boolean).length).toBeGreaterThan(1)
    expect(labels[0]).toBeTruthy()
  })
})
