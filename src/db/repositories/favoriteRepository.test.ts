import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RecompDb } from '@/db/dexie'
import { favoriteKey, listFavorites, toggleFavorite } from '@/db/repositories/favoriteRepository'
import type { MealItem } from '@/types/models'

const COFFEE = 'Café au lait dosette (Senseo)'
const ITEMS: MealItem[] = [
  { name: 'Café au lait', quantity: '1 tasse', kcal: 171, proteinG: 2, carbsG: 18, fatG: 8 },
]

let db: RecompDb
/** A fresh database per test, named by a counter rather than a random string. */
let dbCount = 0

beforeEach(async () => {
  db = new RecompDb(`test-favorites-${++dbCount}`)
  await db.open()
})

afterEach(async () => {
  await db.delete()
})

describe('favorites', () => {
  it('pins a meal and says so', async () => {
    expect(await toggleFavorite(COFFEE, ITEMS, db)).toBe(true)
    const [favorite] = await listFavorites(db)
    expect(favorite).toMatchObject({ label: COFFEE, items: ITEMS })
  })

  it('unpins the same meal on a second star', async () => {
    await toggleFavorite(COFFEE, ITEMS, db)
    expect(await toggleFavorite(COFFEE, ITEMS, db)).toBe(false)
    expect(await listFavorites(db)).toEqual([])
  })

  it('treats a differently-cased label as the same meal', async () => {
    await toggleFavorite(COFFEE, ITEMS, db)
    expect(await toggleFavorite(COFFEE.toUpperCase(), ITEMS, db)).toBe(false)
    expect(await listFavorites(db)).toEqual([])
  })

  it('refuses to pin a meal with no name', async () => {
    expect(await toggleFavorite('   ', ITEMS, db)).toBe(false)
    expect(await listFavorites(db)).toEqual([])
  })

  it('keeps its own copy of the items', async () => {
    const items = [...ITEMS]
    await toggleFavorite(COFFEE, items, db)
    items[0] = { ...items[0], kcal: 999 }
    const [favorite] = await listFavorites(db)
    expect(favorite.items[0].kcal).toBe(171)
  })

  it('lists the newest first', async () => {
    await toggleFavorite('Skyr', ITEMS, db)
    await new Promise((resolve) => setTimeout(resolve, 2))
    await toggleFavorite(COFFEE, ITEMS, db)
    expect((await listFavorites(db)).map((row) => row.label)).toEqual([COFFEE, 'Skyr'])
  })

  it('folds the key the way the habits list folds a label', () => {
    expect(favoriteKey('  Café AU Lait  ')).toBe('café au lait')
  })
})
