import { describe, expect, it } from 'vitest'
import { fitWithin, MAX_EDGE_PX } from '@/lib/image'

describe('fitWithin', () => {
  it('shrinks a landscape photo by its width', () => {
    expect(fitWithin(4000, 3000)).toEqual({ width: 1200, height: 900 })
  })

  it('shrinks a portrait photo by its height', () => {
    expect(fitWithin(3000, 4000)).toEqual({ width: 900, height: 1200 })
  })

  it('leaves a small photo alone rather than upscaling it', () => {
    expect(fitWithin(800, 600)).toEqual({ width: 800, height: 600 })
  })

  it('keeps the long edge exactly at the limit', () => {
    const fitted = fitWithin(5000, 2500)
    expect(Math.max(fitted.width, fitted.height)).toBe(MAX_EDGE_PX)
  })

  it('handles a square', () => {
    expect(fitWithin(2400, 2400)).toEqual({ width: 1200, height: 1200 })
  })
})
