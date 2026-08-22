import { describe, expect, it } from 'vitest'
import { createId, nowIso } from '@/lib/utils'

describe('createId', () => {
  it('never hands out the same id twice', () => {
    const ids = new Set(Array.from({ length: 500 }, () => createId()))
    expect(ids.size).toBe(500)
  })
})

describe('nowIso', () => {
  it('is strictly increasing even inside one millisecond', () => {
    const stamps = Array.from({ length: 50 }, () => nowIso())
    const sorted = [...stamps].sort()
    expect(stamps).toEqual(sorted)
    expect(new Set(stamps).size).toBe(50)
  })

  it('stays within a second of the wall clock during a burst', () => {
    const before = Date.now()
    const last = Array.from({ length: 100 }, () => nowIso()).pop() as string
    expect(new Date(last).getTime() - before).toBeLessThan(1000)
  })
})
