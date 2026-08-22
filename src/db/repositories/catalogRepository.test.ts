import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RecompDb, seedDatabase } from '@/db/dexie'
import {
  addTakeoutOption,
  addZeroCookItem,
  cuisinesOf,
  deleteTakeoutOption,
  deleteZeroCookItem,
  setZeroCookStock,
  updateZeroCookItem,
} from '@/db/repositories/catalogRepository'

let db: RecompDb

beforeEach(async () => {
  db = new RecompDb(`test-${Math.random().toString(36).slice(2)}`)
  await db.open()
  await seedDatabase(db)
})

afterEach(async () => {
  await db.delete()
})

describe('zero-cook catalog', () => {
  it('toggles stock without touching the rest of the item', async () => {
    await setZeroCookStock('skyr', false, db)
    const item = await db.zeroCookItems.get('skyr')
    expect(item?.inStock).toBe(false)
    expect(item?.proteinPerServingGrams).toBe(17)
  })

  it('adds a custom item flagged as such', async () => {
    const created = await addZeroCookItem(
      { name: 'Jambon', proteinPerServingGrams: 18, servingLabel: '2 tranches', inStock: true },
      db,
    )
    expect(created.isCustom).toBe(true)
    expect(await db.zeroCookItems.get(created.id)).toMatchObject({ name: 'Jambon' })
  })

  it('updates and deletes a custom item', async () => {
    const created = await addZeroCookItem(
      { name: 'Jambon', proteinPerServingGrams: 18, servingLabel: '2 tranches', inStock: true },
      db,
    )
    await updateZeroCookItem(created.id, { proteinPerServingGrams: 20 }, db)
    expect((await db.zeroCookItems.get(created.id))?.proteinPerServingGrams).toBe(20)

    await deleteZeroCookItem(created.id, db)
    expect(await db.zeroCookItems.get(created.id)).toBeUndefined()
  })
})

describe('takeout cheat sheet', () => {
  it('adds and removes a custom entry', async () => {
    const created = await addTakeoutOption(
      { cuisine: 'Grec', pick: 'Assiette souvlaki', avoid: 'Pita frites' },
      db,
    )
    expect(created.isCustom).toBe(true)

    await deleteTakeoutOption(created.id, db)
    expect(await db.takeoutOptions.get(created.id)).toBeUndefined()
  })
})

describe('cuisinesOf', () => {
  it('lists each cuisine once, alphabetically', async () => {
    const options = await db.takeoutOptions.toArray()
    const cuisines = cuisinesOf(options)

    expect(new Set(cuisines).size).toBe(cuisines.length)
    expect(cuisines).toEqual([...cuisines].sort((a, b) => a.localeCompare(b)))
    expect(cuisines).toContain('Burger')
  })

  it('is empty for an empty sheet', () => {
    expect(cuisinesOf([])).toEqual([])
  })
})
