import { describe, expect, it } from 'vitest'
import { isValidEan } from '@/lib/off/barcode'

describe('isValidEan', () => {
  it('accepte un EAN-13 valide', () => {
    expect(isValidEan('3017620422003')).toBe(true)
  })

  it('accepte un EAN-8 valide', () => {
    expect(isValidEan('96385074')).toBe(true)
  })

  it('accepte un UPC-A valide, sur 12 chiffres', () => {
    expect(isValidEan('036000291452')).toBe(true)
  })

  it('refuse une somme de contrôle fausse', () => {
    expect(isValidEan('3017620422004')).toBe(false)
  })

  it('refuse une longueur inattendue', () => {
    expect(isValidEan('12345')).toBe(false)
    expect(isValidEan('')).toBe(false)
  })

  it('refuse ce qui n’est pas une suite de chiffres', () => {
    expect(isValidEan('30176204220a3')).toBe(false)
    expect(isValidEan('301 762 042 200 3')).toBe(false)
  })
})
