import { describe, expect, it } from 'vitest'
import { formatBytes, formatCount, formatDecimal } from '@/lib/format'

describe('formatDecimal', () => {
  it('writes the decimal mark the way French does', () => {
    // Rendered straight into French copy, a raw number reads as « 78.4 » —
    // the one place the app silently switched language.
    expect(formatDecimal(78.4)).toBe('78,4')
  })

  it('adds nothing to a whole number', () => {
    expect(formatDecimal(80)).toBe('80')
  })

  it('keeps a negative sign where it is', () => {
    expect(formatDecimal(-1.2)).toBe('-1,2')
  })

  it('leaves zero alone', () => {
    expect(formatDecimal(0)).toBe('0')
  })
})

describe('formatBytes', () => {
  it('speaks French units and a French decimal mark', () => {
    expect(formatBytes(512)).toBe('512 o')
    expect(formatBytes(2048)).toBe('2,0 Ko')
  })

  it('keeps the one decimal it deliberately shows under 10', () => {
    // Formatting through Number() would turn '2.0' back into 2 and lose it.
    expect(formatBytes(1536)).toBe('1,5 Ko')
  })

  it('drops decimals once the figure is large enough not to need them', () => {
    expect(formatBytes(50 * 1024)).toBe('50 Ko')
  })
})

describe('formatCount', () => {
  it('groups thousands with a narrow no-break space', () => {
    expect(formatCount(1850)).toBe('1 850')
    expect(formatCount(2050)).toBe('2 050')
  })

  it('leaves a number that needs no grouping alone', () => {
    expect(formatCount(603)).toBe('603')
    expect(formatCount(0)).toBe('0')
  })

  it('handles a negative and a number past a million', () => {
    expect(formatCount(-1200)).toBe('-1 200')
    expect(formatCount(1234567)).toBe('1 234 567')
  })

  it('separates with a narrow no-break space, whatever ICU the engine ships', () => {
    // U+202F, not U+00A0 and certainly not a plain space: the grouping must
    // never wrap, and must not change width between two phones.
    expect([...formatCount(1850)].map((char) => char.codePointAt(0))).toEqual([
      0x31, 0x202f, 0x38, 0x35, 0x30,
    ])
  })
})
