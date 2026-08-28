import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RecompDb } from '@/db/dexie'
import {
  applyAnalysis,
  createManualMeal,
  createPendingMeal,
  createTextMeal,
  editMeal,
  getMealPhoto,
  macrosFor,
  markFailed,
  mealsForDate,
  pendingMeals,
  pruneMealPhotos,
  removeMeal,
  slotForHour,
} from '@/db/repositories/mealRepository'
import { totalProteinForDate } from '@/db/repositories/proteinRepository'
import type { MealAnalysis } from '@/lib/vision/schema'

const TARGET = 145

function analysis(overrides: Partial<MealAnalysis> = {}): MealAnalysis {
  return {
    label: 'Poulet riz',
    items: [
      { name: 'Poulet', quantity: '150 g', kcal: 248, proteinG: 46, carbsG: 0, fatG: 5 },
      { name: 'Riz', quantity: '200 g', kcal: 260, proteinG: 5, carbsG: 56, fatG: 1 },
    ],
    kcal: 508,
    proteinG: 51,
    carbsG: 56,
    fatG: 6,
    confidence: 'medium',
    ...overrides,
  }
}

function photo() {
  return { bytes: new ArrayBuffer(64), mimeType: 'image/webp', byteSize: 64 }
}

let db: RecompDb

beforeEach(async () => {
  db = new RecompDb(`test-${Math.random().toString(36).slice(2)}`)
  await db.open()
})

afterEach(async () => {
  await db.delete()
})

describe('slotForHour', () => {
  it('maps the clock onto a plausible slot', () => {
    expect(slotForHour(8)).toBe('breakfast')
    expect(slotForHour(12)).toBe('lunch')
    expect(slotForHour(16)).toBe('snack')
    expect(slotForHour(20)).toBe('dinner')
  })
})

describe('createPendingMeal', () => {
  it('stores the photo before anything is analysed', async () => {
    const meal = await createPendingMeal(photo(), { date: '2026-08-27' }, db)

    expect(meal.status).toBe('pending')
    expect(meal.photoId).toBeTruthy()
    const stored = await getMealPhoto(meal.id, db)
    expect(stored?.byteSize).toBe(64)
  })

  it('shows up in the retry queue until it is analysed', async () => {
    await createPendingMeal(photo(), { date: '2026-08-27' }, db)
    expect(await pendingMeals(db)).toHaveLength(1)

    const [meal] = await pendingMeals(db)
    await applyAnalysis(meal.id, analysis(), 'groq', TARGET, db)
    expect(await pendingMeals(db)).toHaveLength(0)
  })

  it('keeps a failed meal out of the automatic queue', async () => {
    const meal = await createPendingMeal(photo(), { date: '2026-08-27' }, db)
    await markFailed(meal.id, 'réseau', db)
    expect(await pendingMeals(db)).toHaveLength(0)
  })
})

describe('applyAnalysis', () => {
  it('writes the macros and marks the meal done', async () => {
    const created = await createPendingMeal(photo(), { date: '2026-08-27' }, db)
    const meal = await applyAnalysis(created.id, analysis(), 'groq', TARGET, db)

    expect(meal?.status).toBe('done')
    expect(meal?.kcal).toBe(508)
    expect(meal?.analysedBy).toBe('groq')
    expect(meal?.source).toBe('ai')
  })

  it("feeds the day's protein total exactly once", async () => {
    const created = await createPendingMeal(photo(), { date: '2026-08-27' }, db)
    await applyAnalysis(created.id, analysis(), 'groq', TARGET, db)

    expect(await totalProteinForDate('2026-08-27', db)).toBe(51)
    expect(await db.proteinLogs.count()).toBe(1)
  })

  it('re-analysing updates the same protein row rather than adding one', async () => {
    const created = await createPendingMeal(photo(), { date: '2026-08-27' }, db)
    await applyAnalysis(created.id, analysis(), 'groq', TARGET, db)
    await applyAnalysis(created.id, analysis({ proteinG: 20 }), 'groq', TARGET, db)

    expect(await db.proteinLogs.count()).toBe(1)
    expect(await totalProteinForDate('2026-08-27', db)).toBe(20)
  })

  it('keeps no protein row for a meal with no protein', async () => {
    const created = await createPendingMeal(photo(), { date: '2026-08-27' }, db)
    await applyAnalysis(
      created.id,
      analysis({
        proteinG: 0,
        items: [{ name: 'Salade', quantity: '100 g', kcal: 20, proteinG: 0, carbsG: 4, fatG: 0 }],
      }),
      'groq',
      TARGET,
      db,
    )
    expect(await db.proteinLogs.count()).toBe(0)
  })

  it('drops the protein row when a correction takes the protein to zero', async () => {
    const created = await createPendingMeal(photo(), { date: '2026-08-27' }, db)
    await applyAnalysis(created.id, analysis(), 'groq', TARGET, db)
    expect(await db.proteinLogs.count()).toBe(1)

    await editMeal(
      created.id,
      { items: [{ name: 'Eau', quantity: '1 verre', kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 }] },
      TARGET,
      db,
    )
    expect(await db.proteinLogs.count()).toBe(0)
    expect(await totalProteinForDate('2026-08-27', db)).toBe(0)
  })
})

describe('editMeal', () => {
  it('recomputes the totals from the corrected items', async () => {
    const created = await createPendingMeal(photo(), { date: '2026-08-27' }, db)
    await applyAnalysis(created.id, analysis(), 'groq', TARGET, db)

    const edited = await editMeal(
      created.id,
      {
        items: [{ name: 'Poulet', quantity: '100 g', kcal: 165, proteinG: 31, carbsG: 0, fatG: 3 }],
      },
      TARGET,
      db,
    )
    expect(edited?.kcal).toBe(165)
    expect(edited?.proteinG).toBe(31)
    expect(await totalProteinForDate('2026-08-27', db)).toBe(31)
  })

  it('marks a corrected analysis as corrected', async () => {
    const created = await createPendingMeal(photo(), { date: '2026-08-27' }, db)
    await applyAnalysis(created.id, analysis(), 'groq', TARGET, db)
    const edited = await editMeal(created.id, { items: analysis().items }, TARGET, db)
    expect(edited?.source).toBe('corrected')
  })

  it('renaming alone does not claim the numbers were corrected', async () => {
    const created = await createPendingMeal(photo(), { date: '2026-08-27' }, db)
    await applyAnalysis(created.id, analysis(), 'groq', TARGET, db)
    const edited = await editMeal(created.id, { label: 'Déjeuner du mardi' }, TARGET, db)
    expect(edited?.source).toBe('ai')
    expect(edited?.label).toBe('Déjeuner du mardi')
  })

  it('a hand-typed meal stays manual after an edit', async () => {
    const meal = await createManualMeal(
      'Skyr',
      [{ name: 'Skyr', quantity: '150 g', kcal: 90, proteinG: 16, carbsG: 6, fatG: 0 }],
      TARGET,
      { date: '2026-08-27' },
      db,
    )
    const edited = await editMeal(meal.id, { items: meal.items }, TARGET, db)
    expect(edited?.source).toBe('manual')
  })

  it('clears the failure so a corrected meal stops showing an error', async () => {
    const created = await createPendingMeal(photo(), { date: '2026-08-27' }, db)
    await markFailed(created.id, 'réseau', db)
    const edited = await editMeal(
      created.id,
      {
        items: [{ name: 'Pizza', quantity: '1/2', kcal: 600, proteinG: 25, carbsG: 70, fatG: 22 }],
      },
      TARGET,
      db,
    )
    expect(edited?.status).toBe('done')
    expect(edited?.error).toBeUndefined()
  })
})

describe('createManualMeal', () => {
  it('needs no photo and no provider', async () => {
    const meal = await createManualMeal(
      'Skyr',
      [{ name: 'Skyr', quantity: '150 g', kcal: 90, proteinG: 16, carbsG: 6, fatG: 0 }],
      TARGET,
      { date: '2026-08-27' },
      db,
    )
    expect(meal.status).toBe('done')
    expect(meal.photoId).toBeUndefined()
    expect(await totalProteinForDate('2026-08-27', db)).toBe(16)
  })
})

describe('removeMeal', () => {
  it('takes its protein and its photo with it', async () => {
    const created = await createPendingMeal(photo(), { date: '2026-08-27' }, db)
    await applyAnalysis(created.id, analysis(), 'groq', TARGET, db)

    await removeMeal(created.id, TARGET, db)
    expect(await mealsForDate('2026-08-27', db)).toHaveLength(0)
    expect(await db.proteinLogs.count()).toBe(0)
    expect(await db.mealPhotos.count()).toBe(0)
    expect(await totalProteinForDate('2026-08-27', db)).toBe(0)
  })

  it('leaves protein logged by hand alone', async () => {
    const created = await createPendingMeal(photo(), { date: '2026-08-27' }, db)
    await applyAnalysis(created.id, analysis(), 'groq', TARGET, db)
    await db.proteinLogs.add({
      id: 'manual-log',
      date: '2026-08-27',
      timestamp: '2026-08-27T12:00:00.000Z',
      grams: 30,
      sourceType: 'shake',
    })

    await removeMeal(created.id, TARGET, db)
    expect(await totalProteinForDate('2026-08-27', db)).toBe(30)
  })
})

describe('macrosFor', () => {
  it('counts only the meals that were actually analysed', async () => {
    const done = await createPendingMeal(photo(), { date: '2026-08-27' }, db)
    await applyAnalysis(done.id, analysis(), 'groq', TARGET, db)
    await createPendingMeal(photo(), { date: '2026-08-27' }, db)

    const macros = macrosFor(await mealsForDate('2026-08-27', db))
    expect(macros).toEqual({ kcal: 508, proteinG: 51, carbsG: 56, fatG: 6, mealCount: 1 })
  })

  it('is all zeros on an empty day', () => {
    expect(macrosFor([])).toEqual({ kcal: 0, proteinG: 0, carbsG: 0, fatG: 0, mealCount: 0 })
  })
})

describe('pruneMealPhotos', () => {
  it('drops the bytes past the window and keeps the numbers', async () => {
    const old = await createPendingMeal(photo(), { date: '2026-07-01' }, db)
    await applyAnalysis(old.id, analysis(), 'groq', TARGET, db)
    const fresh = await createPendingMeal(photo(), { date: '2026-08-27' }, db)

    const removed = await pruneMealPhotos(30, '2026-08-27', db)
    expect(removed).toBe(1)
    expect(await getMealPhoto(old.id, db)).toBeUndefined()
    expect(await getMealPhoto(fresh.id, db)).toBeTruthy()

    const kept = await db.meals.get(old.id)
    expect(kept?.kcal).toBe(508)
    expect(kept?.photoId).toBeUndefined()
  })

  it('keeps nothing when retention is zero', async () => {
    await createPendingMeal(photo(), { date: '2026-08-26' }, db)
    expect(await pruneMealPhotos(0, '2026-08-27', db)).toBe(1)
  })

  it('does nothing when there is nothing stale', async () => {
    await createPendingMeal(photo(), { date: '2026-08-27' }, db)
    expect(await pruneMealPhotos(30, '2026-08-27', db)).toBe(0)
  })
})

const DESCRIPTION = '200 g de poulet'

describe('createTextMeal', () => {
  it('écrit un repas en attente qui porte sa description', async () => {
    const meal = await createTextMeal(DESCRIPTION, {}, db)
    expect(meal.status).toBe('pending')
    expect(meal.source).toBe('ai_text')
    expect(meal.hint).toBe(DESCRIPTION)
    expect(meal.label).toBe(DESCRIPTION)
    expect(meal.items).toEqual([])
  })

  it('coupe un label trop long sans perdre la description', async () => {
    const long = 'a'.repeat(200)
    const meal = await createTextMeal(long, {}, db)
    expect(meal.label.length).toBeLessThanOrEqual(80)
    expect(meal.hint).toBe(long)
  })

  it('apparaît dans la file des repas à analyser', async () => {
    const meal = await createTextMeal('une pomme', {}, db)
    const queue = await pendingMeals(db)
    expect(queue.map((row) => row.id)).toContain(meal.id)
  })
})

describe('editMeal sur un repas texte', () => {
  it('passe ai_text à corrected quand les lignes changent', async () => {
    const meal = await createTextMeal('une pomme', {}, db)
    await applyAnalysis(
      meal.id,
      {
        label: 'Pomme',
        items: [{ name: 'Pomme', quantity: '1', kcal: 80, proteinG: 0, carbsG: 21, fatG: 0 }],
        kcal: 80,
        proteinG: 0,
        carbsG: 21,
        fatG: 0,
        confidence: 'medium',
      },
      'groq',
      TARGET,
      db,
    )
    const edited = await editMeal(
      meal.id,
      { items: [{ name: 'Pomme', quantity: '2', kcal: 160, proteinG: 0, carbsG: 42, fatG: 0 }] },
      TARGET,
      db,
    )
    expect(edited?.source).toBe('corrected')
  })
})
