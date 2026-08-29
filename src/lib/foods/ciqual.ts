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

/**
 * Typed with `undefined` in the value: the glob is empty until the file exists,
 * so reading a key that is not there is the normal case, not an impossibility.
 */
const tables: Record<string, (() => Promise<unknown>) | undefined> = import.meta.glob(
  '/src/data/ciqual.json',
  { import: 'default' },
)

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
function asNumber(value: string | null): number | null {
  if (value === null) return null
  const decimal = value.replace(',', '.')
  // The whole cell first: it keeps the exponents a converter may have written,
  // which reading digit by digit would truncate.
  const whole = Number(decimal)
  if (Number.isFinite(whole)) return whole
  const match = /\d+(?:\.\d+)?/.exec(decimal)
  return match ? Number(match[0]) : null
}

/**
 * The first of several spellings that carries something, as text.
 *
 * Narrowed to what a table cell can hold — a converter that nests an object
 * under one of these keys would otherwise reach the row as « [object Object] ».
 * Numbers come back as text so a cell is one type wherever it is read.
 */
function cell(record: Record<string, unknown>, keys: readonly string[]): string | null {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
    if (typeof value === 'string' && value.trim() !== '') return value.trim()
  }
  return null
}

function parseRow(raw: unknown, index: number): Food | null {
  if (!raw || typeof raw !== 'object') return null
  const record = raw as Record<string, unknown>
  // `cell` trims, so a name that survives is a name.
  const name = cell(record, KEYS.name)
  const kcal = asNumber(cell(record, KEYS.kcal))
  if (name === null || kcal === null) return null

  const macros = {
    proteinG: asNumber(cell(record, KEYS.proteinG)),
    carbsG: asNumber(cell(record, KEYS.carbsG)),
    fatG: asNumber(cell(record, KEYS.fatG)),
  }
  return {
    id: String(cell(record, KEYS.id) ?? index),
    source: 'ciqual',
    name,
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
  // Named arguments rather than `map(parseRow)`: `map` also hands its callback
  // the array itself, and a signature that grows later would silently receive it.
  return rows
    .map((row, index) => parseRow(row, index))
    .filter((food): food is Food => food !== null)
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
  return Object.hasOwn(tables, TABLE_PATH)
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
  // Sorted on its own line: chaining reads as though it returned a new array,
  // and it does not.
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((entry) => entry.food)
}

export async function searchCiqual(query: string, limit = 8): Promise<Food[]> {
  return rankCiqual(await table(), query, limit)
}
