import { useEffect, useState } from 'react'
import { MIN_QUERY_LENGTH, searchFoods } from '@/lib/foods/search'
import type { Food } from '@/lib/foods/food'

/**
 * Long enough that a word gets typed before a request leaves, short enough that
 * the list feels attached to the keyboard.
 */
const DEBOUNCE_MS = 300

export interface FoodSearchState {
  foods: Food[]
  loading: boolean
  networkFailed: boolean
  /** True once the query is long enough to have been asked at all. */
  asked: boolean
}

/**
 * Searching while someone types, without racing them.
 *
 * Every keystroke would otherwise leave a request, and the answers come back in
 * whatever order the network feels like — « nec » landing after « nectarine »
 * and replacing the right list with a stale one. The in-flight call is aborted
 * on each change, and a cancelled effect refuses to write its result at all.
 */
export function useFoodSearch(query: string): FoodSearchState {
  const [state, setState] = useState<FoodSearchState>({
    foods: [],
    loading: false,
    networkFailed: false,
    asked: false,
  })

  useEffect(() => {
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setState({ foods: [], loading: false, networkFailed: false, asked: false })
      return
    }

    let cancelled = false
    const controller = new AbortController()
    setState((current) => ({ ...current, loading: true, asked: true }))

    const timer = setTimeout(() => {
      void searchFoods(query, { signal: controller.signal }).then((result) => {
        if (cancelled) return
        setState({ ...result, loading: false, asked: true })
      })
    }, DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return state
}
