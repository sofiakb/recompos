/**
 * Meals captured from a photo (PRD §6.6).
 *
 * The one invariant worth stating: **protein is not counted twice**. The app
 * already has a protein ledger with a ring, a floor habit and a day total
 * hanging off it, so a meal does not run a parallel count — it owns exactly one
 * `ProteinLog` and keeps it in step. Create writes one, edit updates it, delete
 * removes it. Everything downstream of `refreshProteinTotal` then keeps working
 * without knowing meals exist.
 */
import { db, type RecompDb } from '@/db/dexie'
import {
  addProteinLog,
  refreshProteinTotal,
  removeProteinLog,
} from '@/db/repositories/proteinRepository'
import { toLogicalDate, type IsoDate } from '@/lib/date'
import { createId, nowIso } from '@/lib/utils'
import { totalsFromItems, type MealAnalysis } from '@/lib/vision/schema'
import type { MealEntry, MealItem, MealPhoto, MealSlot, VisionProviderId } from '@/types/models'

/** Rough clock slots; the user can change one in a tap. */
export function slotForHour(hour: number): MealSlot {
  if (hour < 11) return 'breakfast'
  if (hour < 15) return 'lunch'
  if (hour < 18) return 'snack'
  return 'dinner'
}

export async function mealsForDate(date: IsoDate, database: RecompDb = db): Promise<MealEntry[]> {
  const rows = await database.meals.where('date').equals(date).toArray()
  return rows.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}

export async function recentMeals(days = 30, database: RecompDb = db): Promise<MealEntry[]> {
  const from = new Date()
  from.setDate(from.getDate() - days)
  const cutoff = from.toISOString().slice(0, 10)
  const rows = await database.meals.where('date').aboveOrEqual(cutoff).toArray()
  return rows.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

/** Rows the retry queue owes an analysis to, oldest first. */
export async function pendingMeals(database: RecompDb = db): Promise<MealEntry[]> {
  const rows = await database.meals.where('status').anyOf('pending', 'analysing').toArray()
  return rows.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}

export async function getMeal(id: string, database: RecompDb = db): Promise<MealEntry | undefined> {
  return database.meals.get(id)
}

export async function getMealPhoto(
  mealId: string,
  database: RecompDb = db,
): Promise<MealPhoto | undefined> {
  return database.mealPhotos.where('mealId').equals(mealId).first()
}

/**
 * Records a captured photo before anything has been analysed.
 *
 * Written first and analysed second on purpose: a photo taken in a basement
 * restaurant is a meal that happened, and it must survive the app being closed
 * before the network comes back.
 */
export async function createPendingMeal(
  photo: { bytes: ArrayBuffer; mimeType: string; byteSize: number },
  options: { date?: IsoDate; slot?: MealSlot } = {},
  database: RecompDb = db,
): Promise<MealEntry> {
  const now = nowIso()
  const date = options.date ?? toLogicalDate()
  const meal: MealEntry = {
    id: createId(),
    date,
    timestamp: now,
    slot: options.slot ?? slotForHour(new Date().getHours()),
    label: '',
    items: [],
    kcal: 0,
    proteinG: 0,
    carbsG: 0,
    fatG: 0,
    confidence: 'low',
    source: 'ai',
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  }
  const photoRow: MealPhoto = {
    id: createId(),
    mealId: meal.id,
    date,
    bytes: photo.bytes,
    mimeType: photo.mimeType,
    byteSize: photo.byteSize,
    createdAt: now,
  }
  await database.transaction('rw', [database.meals, database.mealPhotos], async () => {
    await database.meals.add({ ...meal, photoId: photoRow.id })
    await database.mealPhotos.add(photoRow)
  })
  return { ...meal, photoId: photoRow.id }
}

export async function markAnalysing(
  id: string,
  hint: string | undefined,
  database: RecompDb = db,
): Promise<void> {
  await database.meals.update(id, {
    status: 'analysing',
    // Stored before the call, so a correction survives a failed retry and is
    // still there for the next one.
    ...(hint !== undefined ? { hint: hint.trim() || undefined } : {}),
    updatedAt: nowIso(),
  })
}

export async function markFailed(
  id: string,
  error: string,
  database: RecompDb = db,
): Promise<void> {
  await database.meals.update(id, { status: 'failed', error, updatedAt: nowIso() })
}

/**
 * Writes an analysis onto a meal and syncs its protein row.
 *
 * `targetGrams` is the day's protein target, needed only because the daily
 * aggregate freezes it on first write.
 */
export async function applyAnalysis(
  id: string,
  analysis: MealAnalysis,
  providerId: VisionProviderId,
  targetGrams: number,
  database: RecompDb = db,
): Promise<MealEntry | undefined> {
  const meal = await database.meals.get(id)
  if (!meal) return undefined
  const patched: MealEntry = {
    ...meal,
    label: analysis.label,
    items: analysis.items,
    kcal: analysis.kcal,
    proteinG: analysis.proteinG,
    carbsG: analysis.carbsG,
    fatG: analysis.fatG,
    confidence: analysis.confidence,
    status: 'done',
    analysedBy: providerId,
    error: undefined,
    updatedAt: nowIso(),
  }
  await database.meals.put(patched)
  return syncProteinLog(patched, targetGrams, database)
}

/**
 * Keeps the meal's single protein row equal to its protein figure.
 *
 * A zero-gram meal keeps no row at all: an empty entry in the day's protein list
 * is noise, and its absence is what « no protein in this one » looks like.
 */
async function syncProteinLog(
  meal: MealEntry,
  targetGrams: number,
  database: RecompDb = db,
): Promise<MealEntry> {
  const grams = Math.round(meal.proteinG)

  if (meal.proteinLogId) {
    const existing = await database.proteinLogs.get(meal.proteinLogId)
    if (existing && grams > 0) {
      await database.proteinLogs.put({ ...existing, grams, note: meal.label || existing.note })
      await refreshProteinTotal(existing.date, targetGrams, database)
      return meal
    }
    if (existing) {
      await removeProteinLog(meal.proteinLogId, targetGrams, database)
      const cleared = { ...meal, proteinLogId: undefined }
      await database.meals.put(cleared)
      return cleared
    }
  }

  if (grams <= 0) return meal

  const log = await addProteinLog(
    grams,
    'meal',
    targetGrams,
    { note: meal.label, date: meal.date },
    database,
  )
  const linked = { ...meal, proteinLogId: log.id }
  await database.meals.put(linked)
  return linked
}

export interface MealEdit {
  label?: string
  slot?: MealSlot
  items?: MealItem[]
}

/**
 * Applies a human correction.
 *
 * Editing the items recomputes the totals rather than taking them as given, so
 * a corrected line and the headline figure cannot drift apart. The source flips
 * to `corrected`, which is what makes « the model was wrong here » visible later.
 */
export async function editMeal(
  id: string,
  edit: MealEdit,
  targetGrams: number,
  database: RecompDb = db,
): Promise<MealEntry | undefined> {
  const meal = await database.meals.get(id)
  if (!meal) return undefined

  const items = edit.items ?? meal.items
  const totals = totalsFromItems(items)
  const itemsChanged = edit.items !== undefined
  const patched: MealEntry = {
    ...meal,
    ...(edit.label !== undefined ? { label: edit.label } : {}),
    ...(edit.slot !== undefined ? { slot: edit.slot } : {}),
    items,
    ...totals,
    source: itemsChanged && meal.source === 'ai' ? 'corrected' : meal.source,
    status: 'done',
    error: undefined,
    updatedAt: nowIso(),
  }
  await database.meals.put(patched)
  return syncProteinLog(patched, targetGrams, database)
}

/** A meal typed by hand — no photo, no provider, no network. */
export async function createManualMeal(
  label: string,
  items: MealItem[],
  targetGrams: number,
  options: { date?: IsoDate; slot?: MealSlot } = {},
  database: RecompDb = db,
): Promise<MealEntry> {
  const now = nowIso()
  const date = options.date ?? toLogicalDate()
  const totals = totalsFromItems(items)
  const meal: MealEntry = {
    id: createId(),
    date,
    timestamp: now,
    slot: options.slot ?? slotForHour(new Date().getHours()),
    label,
    items,
    ...totals,
    confidence: 'high',
    source: 'manual',
    status: 'done',
    createdAt: now,
    updatedAt: now,
  }
  await database.meals.add(meal)
  return syncProteinLog(meal, targetGrams, database)
}

export async function removeMeal(
  id: string,
  targetGrams: number,
  database: RecompDb = db,
): Promise<void> {
  const meal = await database.meals.get(id)
  if (!meal) return
  if (meal.proteinLogId) await removeProteinLog(meal.proteinLogId, targetGrams, database)
  await database.transaction('rw', [database.meals, database.mealPhotos], async () => {
    await database.mealPhotos.where('mealId').equals(id).delete()
    await database.meals.delete(id)
  })
}

export interface DayMacros {
  kcal: number
  proteinG: number
  carbsG: number
  fatG: number
  mealCount: number
}

export function macrosFor(meals: MealEntry[]): DayMacros {
  const counted = meals.filter((meal) => meal.status === 'done')
  return {
    ...totalsFromItems(counted.flatMap((meal) => meal.items)),
    mealCount: counted.length,
  }
}

/**
 * Drops photo bytes past the retention window, keeping the numbers.
 *
 * Three meals a day at ~50 kB is roughly 55 MB a year, which IndexedDB holds
 * comfortably — but a meal photo is worth looking at for a few weeks, not
 * forever, and this is what keeps the storage gauge honest without a server.
 */
export async function pruneMealPhotos(
  retentionDays: number,
  today: IsoDate = toLogicalDate(),
  database: RecompDb = db,
): Promise<number> {
  const cutoffDate = new Date(`${today}T00:00:00.000Z`)
  cutoffDate.setDate(cutoffDate.getDate() - Math.max(0, retentionDays))
  const cutoff = cutoffDate.toISOString().slice(0, 10)
  const stale = await database.mealPhotos.where('date').below(cutoff).toArray()
  if (stale.length === 0) return 0
  await database.transaction('rw', [database.meals, database.mealPhotos], async () => {
    for (const photo of stale) {
      await database.mealPhotos.delete(photo.id)
      await database.meals.update(photo.mealId, { photoId: undefined })
    }
  })
  return stale.length
}
