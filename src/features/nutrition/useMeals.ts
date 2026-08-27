import { useCallback, useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  applyAnalysis,
  createManualMeal,
  createPendingMeal,
  editMeal,
  getMealPhoto,
  macrosFor,
  markAnalysing,
  markFailed,
  mealsForDate,
  pendingMeals,
  pruneMealPhotos,
  removeMeal,
  type DayMacros,
  type MealEdit,
} from '@/db/repositories/mealRepository'
import { useProteinTarget } from '@/features/nutrition/useProteinTarget'
import { useSettingsStore } from '@/stores/settingsStore'
import { bytesToDataUrl } from '@/lib/backup'
import { toLogicalDate } from '@/lib/date'
import { encodePhoto, MEAL_MAX_EDGE_PX, MEAL_WEBP_QUALITY } from '@/lib/image'
import { haptic } from '@/lib/utils'
import { analyseMeal, configuredProviders, VisionError } from '@/lib/vision/providers'
import { t } from '@/i18n/fr'
import type { MealEntry, MealItem, MealSlot } from '@/types/models'

export interface MealsState {
  today: string
  meals: MealEntry[]
  macros: DayMacros
  /** True once at least one provider has a key. */
  canAnalyse: boolean
  /** Ids currently in flight, so the UI can show a spinner per row. */
  analysing: string[]
  capture: (file: File) => Promise<void>
  retry: (id: string) => Promise<void>
  correct: (id: string, edit: MealEdit) => Promise<void>
  addManual: (label: string, items: MealItem[], slot: MealSlot) => Promise<void>
  remove: (id: string) => Promise<void>
  photoUrlFor: (id: string) => Promise<string | null>
}

/**
 * Ids currently being analysed, module-wide.
 *
 * The queue is owned by a single hook instance, but a remount — a tab switch, a
 * hot reload, a second card added later by mistake — must not send the same
 * photo twice and bill it twice. A module-level set costs nothing and makes that
 * impossible rather than merely unlikely.
 */
const inFlight = new Set<string>()

function messageFor(error: unknown): string {
  if (error instanceof VisionError) return t.vision.errorKind[error.kind]
  return t.meals.unknownError
}

/**
 * The meal journal and its analysis queue (PRD §6.6).
 *
 * A capture is written to the database *before* it is analysed, and the queue
 * picks up whatever is still pending — on mount, when the tab comes back, and
 * when the network returns. A photo taken in a basement restaurant is a meal
 * that happened; it must survive the app being closed before the network is
 * back. That is also the only concession to being online at all: the rest of
 * the app keeps working with no network, and so does this one, minus the
 * numbers, until the call goes through.
 */
export function useMeals(): MealsState {
  const today = toLogicalDate()
  const { targetGrams } = useProteinTarget()
  const providers = useSettingsStore((state) => state.settings.visionProviders)
  const retentionDays = useSettingsStore((state) => state.settings.mealPhotoRetentionDays)

  const mealsQuery = useLiveQuery(() => mealsForDate(today), [today], [])
  const meals = mealsQuery ?? []
  const [analysing, setAnalysing] = useState<string[]>([])

  const chain = configuredProviders(providers)
  const canAnalyse = chain.length > 0

  // Kept in a ref so the queue effect does not restart on every settings read.
  const context = useRef({ chain, targetGrams })
  context.current = { chain, targetGrams }

  const analyse = useCallback(async (mealId: string) => {
    if (inFlight.has(mealId)) return
    const { chain: providersNow, targetGrams: target } = context.current
    if (providersNow.length === 0) {
      await markFailed(mealId, t.vision.errorKind.auth)
      return
    }
    const photo = await getMealPhoto(mealId)
    if (!photo) {
      await markFailed(mealId, t.meals.photoGone)
      return
    }
    inFlight.add(mealId)
    setAnalysing((current) => (current.includes(mealId) ? current : [...current, mealId]))
    await markAnalysing(mealId)
    try {
      const outcome = await analyseMeal(providersNow, {
        dataUrl: bytesToDataUrl(photo.bytes, photo.mimeType),
      })
      await applyAnalysis(mealId, outcome.analysis, outcome.providerId, target)
      haptic()
    } catch (error) {
      await markFailed(mealId, messageFor(error))
    } finally {
      inFlight.delete(mealId)
      setAnalysing((current) => current.filter((id) => id !== mealId))
    }
  }, [])

  /**
   * Drains whatever is still pending.
   *
   * Serial rather than parallel: three photos fired at once is the fastest way
   * to meet a rate limit, and nothing here is urgent enough to risk it.
   */
  const drain = useCallback(async () => {
    if (context.current.chain.length === 0) return
    const queue = await pendingMeals()
    for (const meal of queue) {
      await analyse(meal.id)
    }
  }, [analyse])

  useEffect(() => {
    void drain()
    const onOnline = () => void drain()
    const onVisible = () => {
      if (document.visibilityState === 'visible') void drain()
    }
    window.addEventListener('online', onOnline)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('online', onOnline)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [drain])

  // Retention runs once per mount rather than on a timer: the app is opened
  // several times a day, and a sweep that costs nothing when there is nothing
  // to sweep does not need scheduling.
  useEffect(() => {
    void pruneMealPhotos(retentionDays, today)
  }, [retentionDays, today])

  const capture = useCallback(
    async (file: File) => {
      const encoded = await encodePhoto(file, MEAL_MAX_EDGE_PX, MEAL_WEBP_QUALITY)
      const meal = await createPendingMeal({
        bytes: encoded.bytes,
        mimeType: encoded.mimeType,
        byteSize: encoded.byteSize,
      })
      haptic()
      await analyse(meal.id)
    },
    [analyse],
  )

  const photoUrlFor = useCallback(async (id: string) => {
    const photo = await getMealPhoto(id)
    if (!photo) return null
    return URL.createObjectURL(new Blob([photo.bytes], { type: photo.mimeType }))
  }, [])

  return {
    today,
    meals,
    macros: macrosFor(meals),
    canAnalyse,
    analysing,
    capture,
    retry: analyse,
    correct: useCallback(
      async (id: string, edit: MealEdit) => {
        await editMeal(id, edit, targetGrams)
      },
      [targetGrams],
    ),
    addManual: useCallback(
      async (label: string, items: MealItem[], slot: MealSlot) => {
        await createManualMeal(label, items, targetGrams, { slot })
        haptic()
      },
      [targetGrams],
    ),
    remove: useCallback(
      async (id: string) => {
        await removeMeal(id, targetGrams)
      },
      [targetGrams],
    ),
    photoUrlFor,
  }
}
