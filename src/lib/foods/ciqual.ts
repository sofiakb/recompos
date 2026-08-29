/**
 * The CIQUAL table, read from disk — once it is there.
 *
 * ANSES publishes the French reference composition table: plain food, no brand,
 * no barcode. « Nectarine » or « riz blanc cuit » have no packaging and will
 * never be in OpenFoodFacts, and they are most of what someone actually cooks.
 *
 * The file is not in the repository yet. `import.meta.glob` is what makes that
 * survivable: an absent path is an empty map at build time rather than a broken
 * import, so this module answers « rien pour l'instant » and the search falls
 * back to the network until the JSON is dropped at the path below.
 */
import { normalise, type Food } from '@/lib/foods/food'

/** Drop the table here — nothing else needs to change. */
const TABLE_PATH = '/src/data/ciqual.json'

const tables = import.meta.glob('/src/data/ciqual.json', { import: 'default' })

/**
 * CIQUAL column names, in the spellings the public exports use.
 *
 * The official file names its columns after the regulation they come from —
 * « Energie, Règlement UE N° 1169/2011 (kcal/100 g) » — and every converter
 * shortens them differently. Reading several spellings costs a few lines and
 * saves rewriting this module around whichever export the user downloads.
 */
const KEYS = {
  name: ['alim_nom_fr', 'alim_nom_index_fr', 'name', 'nom'],
  id: ['alim_code', 'code', 'id'],
  kcal: ['energie_kcal', 'Energie, Règlement UE N° 1169/2011 (kcal/100 g)', 'kcal', 'energy_kcal'],
  proteinG: ['proteines', 'Protéines, N x facteur de Jones (g/100 g)', 'proteinG', 'proteins'],
  carbsG: ['glucides', 'Glucides (g/100 g)', 'carbsG', 'carbohydrates'],
  fatG: ['lipides', 'Lipides (g/100 g)', 'fatG', 'fat'],
} as const

/**
 * A CIQUAL cell as a number.
 *
 * The table says « traces », « - » and « < 0,5 » where a value is below the
 * quantification threshold. « < 0,5 » is read as 0,5 — the upper bound, because
 * over-counting a trace is the harmless direction — and the rest as nothing.
 */
function asNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value !== 'string') return null
  const match = /\d+(?:[.,]\d+)?/.exec(value.replace(',', '.'))
  if (!match) return null
  const parsed = Number(match[0])
  return Number.isFinite(parsed) ? parsed : null
}

function pick(record: Record<string, unknown>, keys: readonly string[]): unknown {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null && record[key] !== '') return record[key]
  }
  return undefined
}

function parseRow(raw: unknown, index: number): Food | null {
  if (!raw || typeof raw !== 'object') return null
  const record = raw as Record<string, unknown>
  const name = typeof pick(record, KEYS.name) === 'string' ? String(pick(record, KEYS.name)) : ''
  const kcal = asNumber(pick(record, KEYS.kcal))
  if (!name.trim() || kcal === null) return null

  const macros = {
    proteinG: asNumber(pick(record, KEYS.proteinG)),
    carbsG: asNumber(pick(record, KEYS.carbsG)),
    fatG: asNumber(pick(record, KEYS.fatG)),
  }
  return {
    id: String(pick(record, KEYS.id) ?? index),
    source: 'ciqual',
    name: name.trim(),
    // CIQUAL is a per-100 g table and names no portion: the sheet asks.
    servingGrams: 100,
    per100g: {
      kcal: Math.round(kcal),
      proteinG: macros.proteinG ?? 0,
      carbsG: macros.carbsG ?? 0,
      fatG: macros.fatG ?? 0,
    },
    missingMacros: Object.entries(macros)
      .filter(([, value]) => value === null)
      .map(([key]) => key),
  }
}

/** Every row the file holds that carries a name and an energy figure. */
export function parseCiqual(raw: unknown): Food[] {
  const rows = Array.isArray(raw) ? raw : []
  return rows.map(parseRow).filter((food): food is Food => food !== null)
}

let loading: Promise<Food[]> | null = null

async function table(): Promise<Food[]> {
  const load = tables[TABLE_PATH]
  if (!load) return []
  loading ??= load().then(parseCiqual)
  return loading
}

/**
 * Normalised names, computed once per food.
 *
 * The table is a few thousand rows and this runs on every keystroke; doing the
 * NFD decomposition again each time is the one thing here that would be felt.
 */
const haystacks = new WeakMap<Food, string>()

function haystackOf(food: Food): string {
  let known = haystacks.get(food)
  if (known === undefined) {
    known = normalise(food.name)
    haystacks.set(food, known)
  }
  return known
}

/** True once the table is in the build — the UI says so rather than staying mute. */
export function hasCiqualTable(): boolean {
  return tables[TABLE_PATH] !== undefined
}

/** Only for tests: forgets the parsed table so the next call re-reads it. */
export function resetCiqualCache(): void {
  loading = null
}

/**
 * Ranks a match by where it lands, not just whether it lands.
 *
 * « riz » must bring up « Riz blanc cuit » before « Poivron farci au riz » —
 * a word at the front of a name is what the person was naming.
 */
function score(haystack: string, needles: string[]): number {
  let total = 0
  for (const needle of needles) {
    const at = haystack.indexOf(needle)
    if (at < 0) return -1
    if (at === 0) total += 3
    else if (haystack[at - 1] === ' ') total += 2
    else total += 1
  }
  // Shorter names are the plainer foods, and the plainer food is the likelier one.
  return total * 100 - haystack.length
}

/** Best matches first, by where the words land in the name. */
export function rankCiqual(foods: Food[], query: string, limit = 8): Food[] {
  const needles = normalise(query).split(' ').filter(Boolean)
  if (needles.length === 0) return []

  const scored: Array<{ food: Food; score: number }> = []
  for (const food of foods) {
    const value = score(haystackOf(food), needles)
    if (value >= 0) scored.push({ food, score: value })
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.food)
}

export async function searchCiqual(query: string, limit = 8): Promise<Food[]> {
  return rankCiqual(await table(), query, limit)
}
