/**
 * Meals pinned by name (PRD §6.11).
 *
 * The habits list already answers « what do you usually eat », but it answers it
 * from the last thirty days — so the coffee you drink every morning is in it
 * only for as long as you keep drinking it, and a week away empties it. A
 * favourite is the opposite claim: this one stays until I say otherwise.
 */
import { db, type RecompDb } from '@/db/dexie'
import { createId, nowIso } from '@/lib/utils'
import type { FavoriteMeal, MealItem } from '@/types/models'

/**
 * What makes two entries « the same meal ».
 *
 * The label, folded exactly as the habits list folds it: the two lists sit one
 * above the other and would look broken if « Café au lait » and « café au lait »
 * were the same row in one and two rows in the other.
 */
export function favoriteKey(label: string): string {
  return label.trim().toLocaleLowerCase('fr')
}

/** Newest first: the last thing pinned is the one being set up right now. */
export async function listFavorites(database: RecompDb = db): Promise<FavoriteMeal[]> {
  const rows = await database.favorites.toArray()
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/**
 * Pins a meal, or unpins it when it was already pinned.
 *
 * Returns the state it left behind, so the caller can say which of the two
 * happened without asking the database a second question. The read and the
 * write share a transaction: two taps in quick succession must not both find
 * « not pinned » and both insert.
 */
export async function toggleFavorite(
  label: string,
  items: MealItem[],
  database: RecompDb = db,
): Promise<boolean> {
  const key = favoriteKey(label)
  // An unnamed meal has nothing to be found by later, so there is nothing to pin.
  if (!key) return false

  return database.transaction('rw', database.favorites, async () => {
    const existing = await database.favorites.where('key').equals(key).first()
    if (existing) {
      await database.favorites.delete(existing.id)
      return false
    }
    const favorite: FavoriteMeal = {
      id: createId(),
      label: label.trim(),
      key,
      // Copied, not referenced: correcting the meal this was pinned from must
      // not silently rewrite what the favourite adds tomorrow.
      items: items.map((item) => ({ ...item })),
      createdAt: nowIso(),
    }
    await database.favorites.add(favorite)
    return true
  })
}
