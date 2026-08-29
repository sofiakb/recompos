import { useCallback, useState } from 'react'
import { fetchProduct } from '@/lib/off/client'
import { OffError } from '@/lib/off/product'
import type { Food } from '@/lib/foods/food'
import { t } from '@/i18n/fr'

export interface FoodPickState {
  /** True while the scan sheet is up. */
  open: boolean
  /** The food waiting for a portion, whether scanned or found by name. */
  food: Food | null
  /** How that food arrived — the journal records the two differently. */
  via: 'scan' | 'search' | null
  error: string | null
  loading: boolean
  start: () => void
  close: () => void
  submit: (barcode: string) => Promise<void>
  /** Hands a food straight to the portion sheet, skipping the lookup. */
  pick: (food: Food) => void
}

/**
 * The holding pen between « that one » and « how much of it ».
 *
 * A barcode and a name both end at the same place: a nutrition table per 100 g
 * and one unanswered question. So both land here, and the portion sheet does
 * not care which route brought the food in.
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

export function useFoodPick(): FoodPickState {
  const [open, setOpen] = useState(false)
  const [food, setFood] = useState<Food | null>(null)
  const [via, setVia] = useState<'scan' | 'search' | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return {
    open,
    food,
    via,
    error: message,
    loading,
    start: useCallback(() => {
      setFood(null)
      setVia(null)
      setMessage(null)
      setOpen(true)
    }, []),
    close: useCallback(() => {
      setOpen(false)
      setFood(null)
      setVia(null)
      setMessage(null)
    }, []),
    pick: useCallback((chosen: Food) => {
      setMessage(null)
      setVia('search')
      setFood(chosen)
    }, []),
    submit: useCallback(async (barcode: string) => {
      setLoading(true)
      setMessage(null)
      try {
        setFood(await fetchProduct(barcode))
        setVia('scan')
        setOpen(false)
      } catch (error) {
        setMessage(messageFor(error))
      } finally {
        setLoading(false)
      }
    }, []),
  }
}
