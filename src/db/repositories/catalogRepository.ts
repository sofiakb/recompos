/** Zero-cook staples and the takeout cheat sheet — both user-editable. */
import { db, type RecompDb } from '@/db/dexie'
import { createId } from '@/lib/utils'
import type { TakeoutOption, ZeroCookItem } from '@/types/models'

export async function setZeroCookStock(
  id: string,
  inStock: boolean,
  database: RecompDb = db,
): Promise<void> {
  await database.zeroCookItems.update(id, { inStock })
}

export async function addZeroCookItem(
  item: Omit<ZeroCookItem, 'id' | 'isCustom'>,
  database: RecompDb = db,
): Promise<ZeroCookItem> {
  const created: ZeroCookItem = { ...item, id: createId(), isCustom: true }
  await database.zeroCookItems.add(created)
  return created
}

export async function updateZeroCookItem(
  id: string,
  patch: Partial<ZeroCookItem>,
  database: RecompDb = db,
): Promise<void> {
  await database.zeroCookItems.update(id, patch)
}

export async function deleteZeroCookItem(id: string, database: RecompDb = db): Promise<void> {
  await database.zeroCookItems.delete(id)
}

export async function addTakeoutOption(
  option: Omit<TakeoutOption, 'id' | 'isCustom'>,
  database: RecompDb = db,
): Promise<TakeoutOption> {
  const created: TakeoutOption = { ...option, id: createId(), isCustom: true }
  await database.takeoutOptions.add(created)
  return created
}

export async function updateTakeoutOption(
  id: string,
  patch: Partial<TakeoutOption>,
  database: RecompDb = db,
): Promise<void> {
  await database.takeoutOptions.update(id, patch)
}

export async function deleteTakeoutOption(id: string, database: RecompDb = db): Promise<void> {
  await database.takeoutOptions.delete(id)
}

/** Cuisine names present in the sheet, in display order. */
export function cuisinesOf(options: TakeoutOption[]): string[] {
  return [...new Set(options.map((option) => option.cuisine))].sort((a, b) => a.localeCompare(b))
}
