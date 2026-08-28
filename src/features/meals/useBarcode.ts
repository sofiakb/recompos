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
/**
 * One place that turns a failure into a sentence, as `useMeals` already does.
 *
 * Also what lets the catch parameter be called `error`: the message is built
 * out here, so nothing inside the hook shadows its own `error` state.
 */
function messageFor(error: unknown): string {
  return error instanceof OffError ? t.barcode.errorKind[error.kind] : t.meals.unknownError
}

export function useBarcode(): BarcodeState {
  const [open, setOpen] = useState(false)
  const [product, setProduct] = useState<OffProduct | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return {
    open,
    product,
    error: message,
    loading,
    start: useCallback(() => {
      setProduct(null)
      setMessage(null)
      setOpen(true)
    }, []),
    close: useCallback(() => {
      setOpen(false)
      setProduct(null)
      setMessage(null)
    }, []),
    submit: useCallback(async (barcode: string) => {
      setLoading(true)
      setMessage(null)
      try {
        setProduct(await fetchProduct(barcode))
        setOpen(false)
      } catch (error) {
        setMessage(messageFor(error))
      } finally {
        setLoading(false)
      }
    }, []),
  }
}
