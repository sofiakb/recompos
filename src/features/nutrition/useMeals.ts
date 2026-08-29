import { useCallback, useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  applyAnalysis,
  createManualMeal,
  createFoodMeal,
  createPendingMeal,
  createTextMeal,
  editMeal,
  getMeal,
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
import { toLogicalDate, type IsoDate } from '@/lib/date'
import { encodePhoto, MEAL_MAX_EDGE_PX, MEAL_WEBP_QUALITY, type EncodedImage } from '@/lib/image'
import { haptic } from '@/lib/utils'
import {
  analyseMeal,
  analyseMealText,
  configuredProviders,
  VisionError,
} from '@/lib/vision/providers'
import { t } from '@/i18n/fr'
import type { FoodMealOptions } from '@/db/repositories/mealRepository'
import type { MealEntry, MealItem, MealSlot } from '@/types/models'

/** Where a food came from, as the journal will record it. */
export type FoodOrigin = Pick<FoodMealOptions, 'source' | 'table'>

export interface StagedPhoto {
  encoded: EncodedImage
  /** Object URL for the preview. Revoked by `confirmCapture` or `discardCapture`. */
  previewUrl: string
}

export interface CaptureOptions {
  /** What the user said while the plate was still in front of them. */
  context?: string
  /** The meal its `+` was tapped on; the clock decides when nothing said so. */
  slot?: MealSlot
}

export interface MealsState {
  /** The day being shown, which is not always today. */
  date: IsoDate
  meals: MealEntry[]
  macros: DayMacros
  /** True once at least one provider has a key. */
  canAnalyse: boolean
  /** Ids currently in flight, so the UI can show a spinner per row. */
  analysing: string[]
  /** Encodes a photo without writing anything: the preview sheet may cancel. */
  stageCapture: (file: File) => Promise<StagedPhoto>
  /** Writes the staged photo as a pending meal and analyses it. */
  confirmCapture: (staged: StagedPhoto, options?: CaptureOptions) => Promise<void>
  /** Drops a staged photo the user backed out of. */
  discardCapture: (staged: StagedPhoto) => void
  /** Re-runs the analysis on the stored photo, optionally with a correction. */
  retry: (id: string, hint?: string) => Promise<void>
  correct: (id: string, edit: MealEdit) => Promise<void>
  addManual: (label: string, items: MealItem[], slot: MealSlot) => Promise<void>
  /** Writes a scanned product as a one-line meal. */
  /** `from` says which route found the food, and which table stated its figures. */
  addProduct: (item: MealItem, slot?: MealSlot, from?: FoodOrigin) => Promise<void>
  /** Queues a meal described in words, then analyses it. */
  describeMeal: (description: string, slot?: MealSlot) => Promise<void>
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
export function useMeals(date: IsoDate = toLogicalDate()): MealsState {
  const { targetGrams } = useProteinTarget()
  const providers = useSettingsStore((state) => state.settings.visionProviders)
  const retentionDays = useSettingsStore((state) => state.settings.mealPhotoRetentionDays)

  const mealsQuery = useLiveQuery(() => mealsForDate(date), [date], [])
  const meals = mealsQuery ?? []
  const [analysing, setAnalysing] = useState<string[]>([])

  const chain = configuredProviders(providers)
  const canAnalyse = chain.length > 0

  // Kept in a ref so the queue effect does not restart on every settings read.
  const context = useRef({ chain, targetGrams })
  context.current = { chain, targetGrams }

  const analyse = useCallback(async (mealId: string, hint?: string) => {
    if (inFlight.has(mealId)) return
    const { chain: providersNow, targetGrams: target } = context.current
    if (providersNow.length === 0) {
      await markFailed(mealId, t.vision.errorKind.auth)
      return
    }
    const meal = await getMeal(mealId)
    if (!meal) return
    const isText = meal.source === 'ai_text'

    const photo = isText ? null : await getMealPhoto(mealId)
    if (!isText && !photo) {
      await markFailed(mealId, t.meals.photoGone)
      return
    }
    if (isText && !meal.hint) {
      await markFailed(mealId, t.meals.descriptionGone)
      return
    }

    inFlight.add(mealId)
    setAnalysing((current) => (current.includes(mealId) ? current : [...current, mealId]))
    await markAnalysing(mealId, hint)
    // A retry with no new correction keeps the last one: the reading it produced
    // is still better than the one that made the user type it.
    const effectiveHint = hint?.trim() || meal.hint
    // Read here rather than inside the call: the photo branch is already guarded
    // above, and this keeps the call free of a non-null assertion.
    const dataUrl = photo ? bytesToDataUrl(photo.bytes, photo.mimeType) : ''
    try {
      const outcome = isText
        ? await analyseMealText(providersNow, effectiveHint ?? '')
        : await analyseMeal(providersNow, {
            dataUrl,
            hint: effectiveHint,
            // A meal that has already been read is being corrected; one that has
            // not is being introduced.
            isCorrection: meal.status === 'done' || meal.status === 'failed',
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
  // Anchored on the real today rather than the day being browsed: retention
  // sweeps the archive, and walking back through the week must not make the
  // window slide with it and delete photos that are still inside it.
  const realToday = toLogicalDate()
  useEffect(() => {
    void pruneMealPhotos(retentionDays, realToday)
  }, [retentionDays, realToday])

  /**
   * Encodes the photo and stops.
   *
   * Nothing is written yet: the sheet that follows can be cancelled, and a meal
   * the user backed out of has no business being in the journal.
   */
  const stageCapture = useCallback(async (file: File): Promise<StagedPhoto> => {
    const encoded = await encodePhoto(file, MEAL_MAX_EDGE_PX, MEAL_WEBP_QUALITY)
    const previewUrl = URL.createObjectURL(new Blob([encoded.bytes], { type: encoded.mimeType }))
    return { encoded, previewUrl }
  }, [])

  const confirmCapture = useCallback(
    async (staged: StagedPhoto, options: CaptureOptions = {}) => {
      URL.revokeObjectURL(staged.previewUrl)
      const meal = await createPendingMeal(
        {
          bytes: staged.encoded.bytes,
          mimeType: staged.encoded.mimeType,
          byteSize: staged.encoded.byteSize,
        },
        { date, slot: options.slot },
      )
      haptic()
      await analyse(meal.id, options.context)
    },
    [analyse, date],
  )

  const discardCapture = useCallback((staged: StagedPhoto) => {
    URL.revokeObjectURL(staged.previewUrl)
  }, [])

  const photoUrlFor = useCallback(async (id: string) => {
    const photo = await getMealPhoto(id)
    if (!photo) return null
    return URL.createObjectURL(new Blob([photo.bytes], { type: photo.mimeType }))
  }, [])

  return {
    date,
    meals,
    macros: macrosFor(meals),
    canAnalyse,
    analysing,
    stageCapture,
    confirmCapture,
    discardCapture,
    retry: analyse,
    correct: useCallback(
      async (id: string, edit: MealEdit) => {
        await editMeal(id, edit, targetGrams)
      },
      [targetGrams],
    ),
    addManual: useCallback(
      async (label: string, items: MealItem[], slot: MealSlot) => {
        await createManualMeal(label, items, targetGrams, { date, slot })
        haptic()
      },
      [targetGrams, date],
    ),
    addProduct: useCallback(
      async (item: MealItem, slot?: MealSlot, from?: FoodOrigin) => {
        await createFoodMeal(item, targetGrams, { date, slot, ...from })
        haptic()
      },
      [targetGrams, date],
    ),
    describeMeal: useCallback(
      async (description: string, slot?: MealSlot) => {
        const meal = await createTextMeal(description, { date, slot })
        haptic()
        await analyse(meal.id)
      },
      [analyse, date],
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
