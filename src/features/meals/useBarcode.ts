import { useCallback, useState } from 'react'
import { fetchProduct } from '@/lib/off/client'
import { OffError, type OffProduct } from '@/lib/off/product'
import { t } from '@/i18n/fr'

export interface BarcodeState {
  /** True while the scan sheet is up. */
  open: boolean
  product: OffProduct | null
  error: string | null
  loading: boolean
  start: () => void
  close: () => void
  submit: (barcode: string) => Promise<void>
}

/**
 * Scan, lookup, product — and nothing written until the user says how much.
 *
 * The one deliberate difference with the photo path: a failed scan writes
 * nothing at all. A photo is a meal that happened and must survive a dead
 * network; a scan is redone in a second, and a queue of failed lookups in the
 * journal would be noise.
 */
export function useBarcode(): BarcodeState {
  const [open, setOpen] = useState(false)
  const [product, setProduct] = useState<OffProduct | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return {
    open,
    product,
    error,
    loading,
    start: useCallback(() => {
      setProduct(null)
      setError(null)
      setOpen(true)
    }, []),
    close: useCallback(() => {
      setOpen(false)
      setProduct(null)
      setError(null)
    }, []),
    submit: useCallback(async (barcode: string) => {
      setLoading(true)
      setError(null)
      try {
        setProduct(await fetchProduct(barcode))
        setOpen(false)
      } catch (caught) {
        setError(
          caught instanceof OffError ? t.barcode.errorKind[caught.kind] : t.meals.unknownError,
        )
      } finally {
        setLoading(false)
      }
    }, []),
  }
}
