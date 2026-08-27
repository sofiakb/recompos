/**
 * What a vision model is allowed to hand back (PRD §6.6).
 *
 * A model asked for JSON returns JSON *most* of the time. The rest of the time
 * it returns JSON wrapped in prose, a number as a string, a macro it invented a
 * name for, or a plausible-looking object with a missing field. None of that may
 * reach the database, so everything crossing this boundary is parsed rather than
 * cast — `parseAnalysis` is the only door in.
 */
import { MAX_MEAL_KCAL } from '@/lib/nutrition'
import type { MealConfidence, MealItem } from '@/types/models'

export interface MealAnalysis {
  label: string
  items: MealItem[]
  kcal: number
  proteinG: number
  carbsG: number
  fatG: number
  confidence: MealConfidence
  /** The model's caveat, e.g. « sauce non identifiable ». Shown as-is. */
  notes?: string
}

export const MAX_ITEMS = 12
const MAX_LABEL_LENGTH = 80
const MAX_NOTES_LENGTH = 240

/** Grams of macro per plate, above which the answer is nonsense, not a meal. */
const MAX_MACRO_G = 500

function asNumber(value: unknown): number | null {
  // Models hand back `"250"`, `"250 kcal"` and `250` for the same field.
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value !== 'string') return null
  const match = value.replace(',', '.').match(/-?\d+(\.\d+)?/)
  return match ? Number(match[0]) : null
}

function clampMacro(value: unknown, max: number): number {
  const parsed = asNumber(value)
  if (parsed === null || parsed < 0) return 0
  return Math.round(Math.min(parsed, max))
}

function asText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function asConfidence(value: unknown): MealConfidence {
  // Anything the model did not spell exactly is treated as its weakest claim:
  // an unreadable hedge is not a reason to trust the numbers more.
  return value === 'high' || value === 'medium' ? value : 'low'
}

/**
 * Every balanced `{…}` in a string, outermost first.
 *
 * Quotes and escapes are tracked so a brace inside a value — « sauce 1/2 { » —
 * does not close an object early.
 */
function balancedObjects(text: string): string[] {
  const found: string[] = []
  let depth = 0
  let start = -1
  let inString = false
  let escaped = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (escaped) {
      escaped = false
      continue
    }
    if (char === '\\') {
      escaped = true
      continue
    }
    if (char === '"') {
      inString = !inString
      continue
    }
    if (inString) continue
    if (char === '{') {
      if (depth === 0) start = i
      depth++
    } else if (char === '}') {
      depth--
      if (depth === 0 && start !== -1) {
        found.push(text.slice(start, i + 1))
        start = -1
      }
      if (depth < 0) depth = 0
    }
  }
  return found
}

/**
 * Pulls the meal object out of a completion.
 *
 * JSON mode is requested, but the answer still arrives wrapped often enough that
 * failing on it would mean a failed meal: a fenced block, a leading « Voici », or
 * — with the reasoning models these providers now serve — a whole train of
 * thought before the answer. So every balanced object is a candidate, and the
 * one that actually looks like a meal wins over the one that merely parses.
 */
export function extractJson(text: string): unknown {
  const trimmed = text.trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    // fall through to the scan
  }

  const candidates = balancedObjects(trimmed)
  let firstParsed: unknown = null
  for (const candidate of candidates) {
    let parsed: unknown
    try {
      parsed = JSON.parse(candidate)
    } catch {
      continue
    }
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray((parsed as { items?: unknown }).items)
    ) {
      return parsed
    }
    if (firstParsed === null) firstParsed = parsed
  }
  return firstParsed
}

function parseItem(raw: unknown): MealItem | null {
  if (!raw || typeof raw !== 'object') return null
  const record = raw as Record<string, unknown>
  const name = asText(record.name, MAX_LABEL_LENGTH)
  if (!name) return null
  return {
    name,
    quantity: asText(record.quantity, 40),
    kcal: clampMacro(record.kcal, MAX_MEAL_KCAL),
    proteinG: clampMacro(record.proteinG ?? record.protein_g, MAX_MACRO_G),
    carbsG: clampMacro(record.carbsG ?? record.carbs_g, MAX_MACRO_G),
    fatG: clampMacro(record.fatG ?? record.fat_g, MAX_MACRO_G),
  }
}

export function totalsFromItems(items: MealItem[]): {
  kcal: number
  proteinG: number
  carbsG: number
  fatG: number
} {
  return items.reduce(
    (total, item) => ({
      kcal: total.kcal + item.kcal,
      proteinG: total.proteinG + item.proteinG,
      carbsG: total.carbsG + item.carbsG,
      fatG: total.fatG + item.fatG,
    }),
    { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  )
}

/**
 * Validates a model response into a `MealAnalysis`, or returns null.
 *
 * The totals are always recomputed from the items rather than read from the
 * response: models routinely return a breakdown that does not add up to their
 * own total, and the breakdown is the part the user can actually correct.
 */
export function parseAnalysis(raw: unknown): MealAnalysis | null {
  const source = typeof raw === 'string' ? extractJson(raw) : raw
  if (!source || typeof source !== 'object') return null
  const record = source as Record<string, unknown>

  const rawItems = Array.isArray(record.items) ? record.items : []
  const items = rawItems
    .slice(0, MAX_ITEMS)
    .map(parseItem)
    .filter((item): item is MealItem => item !== null)
  if (items.length === 0) return null

  const totals = totalsFromItems(items)
  const label =
    asText(record.label, MAX_LABEL_LENGTH) ||
    items
      .map((item) => item.name)
      .join(', ')
      .slice(0, MAX_LABEL_LENGTH)

  return {
    label,
    items,
    ...totals,
    confidence: asConfidence(record.confidence),
    ...(asText(record.notes, MAX_NOTES_LENGTH)
      ? { notes: asText(record.notes, MAX_NOTES_LENGTH) }
      : {}),
  }
}
