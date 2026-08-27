import { describe, expect, it } from 'vitest'
import { MEAL_SYSTEM_PROMPT } from '@/lib/vision/prompt'
import { extractJson, parseAnalysis, totalsFromItems } from '@/lib/vision/schema'

const VALID = {
  label: 'Poulet, riz, brocolis',
  items: [
    { name: 'Blanc de poulet', quantity: '150 g', kcal: 248, proteinG: 46, carbsG: 0, fatG: 5 },
    { name: 'Riz basmati', quantity: '200 g cuit', kcal: 260, proteinG: 5, carbsG: 56, fatG: 1 },
  ],
  confidence: 'medium',
}

describe('extractJson', () => {
  it('reads a bare object', () => {
    expect(extractJson('{"a":1}')).toEqual({ a: 1 })
  })

  it('digs the object out of a fenced block', () => {
    expect(extractJson('```json\n{"a":1}\n```')).toEqual({ a: 1 })
  })

  it('digs it out of a sentence', () => {
    expect(extractJson('Voici le résultat : {"a":1} — bon appétit')).toEqual({ a: 1 })
  })

  it('returns null on nothing parseable', () => {
    expect(extractJson('désolé, je ne peux pas')).toBeNull()
  })

  it('steps over a reasoning preamble that contains braces of its own', () => {
    const answer =
      '<think>Je compare {assiette} et {portion} avant de conclure.</think>\n' +
      '{"items":[{"name":"Riz","quantity":"200 g","kcal":260,"proteinG":5,"carbsG":56,"fatG":1}]}'
    const parsed = extractJson(answer) as { items: unknown[] }
    expect(parsed.items).toHaveLength(1)
  })

  it('prefers the object that looks like a meal over one that merely parses', () => {
    const answer = '{"note":"je réfléchis"} puis {"items":[{"name":"Œuf","kcal":78}]}'
    const parsed = extractJson(answer) as { items: unknown[] }
    expect(parsed.items).toHaveLength(1)
  })

  it('is not fooled by a brace inside a value', () => {
    const answer = '{"label":"Sauce {maison}","items":[{"name":"Pâtes","kcal":300}]}'
    const parsed = extractJson(answer) as { label: string }
    expect(parsed.label).toBe('Sauce {maison}')
  })
})

describe('parseAnalysis', () => {
  it('accepts a well-formed answer', () => {
    const parsed = parseAnalysis(VALID)
    expect(parsed?.label).toBe('Poulet, riz, brocolis')
    expect(parsed?.items).toHaveLength(2)
    expect(parsed?.confidence).toBe('medium')
  })

  it('recomputes the totals from the items rather than trusting the model', () => {
    const parsed = parseAnalysis({ ...VALID, kcal: 9999, proteinG: 3 })
    expect(parsed?.kcal).toBe(508)
    expect(parsed?.proteinG).toBe(51)
  })

  it('parses numbers the model sent as strings', () => {
    const parsed = parseAnalysis({
      ...VALID,
      items: [
        { name: 'Œuf', quantity: '2', kcal: '155 kcal', proteinG: '13', carbsG: '1,1', fatG: 11 },
      ],
    })
    expect(parsed?.kcal).toBe(155)
    expect(parsed?.proteinG).toBe(13)
    expect(parsed?.carbsG).toBe(1)
  })

  it('accepts snake_case macro keys', () => {
    const parsed = parseAnalysis({
      items: [{ name: 'Skyr', quantity: '150 g', kcal: 90, protein_g: 16, carbs_g: 6, fat_g: 0 }],
    })
    expect(parsed?.proteinG).toBe(16)
    expect(parsed?.carbsG).toBe(6)
  })

  it('treats an unspelled confidence as the weakest claim', () => {
    expect(parseAnalysis({ ...VALID, confidence: 'très sûr' })?.confidence).toBe('low')
    expect(parseAnalysis({ ...VALID, confidence: undefined })?.confidence).toBe('low')
  })

  it('drops items with no name instead of storing a blank row', () => {
    const parsed = parseAnalysis({
      items: [...VALID.items, { quantity: '1', kcal: 100, proteinG: 1, carbsG: 1, fatG: 1 }],
    })
    expect(parsed?.items).toHaveLength(2)
  })

  it('refuses an answer with no usable item', () => {
    expect(parseAnalysis({ label: 'Repas', items: [] })).toBeNull()
    expect(parseAnalysis({ label: 'Repas' })).toBeNull()
    expect(parseAnalysis('pas de JSON ici')).toBeNull()
    expect(parseAnalysis(null)).toBeNull()
  })

  it('clamps a runaway number rather than storing it', () => {
    const parsed = parseAnalysis({
      items: [{ name: 'Pizza', quantity: '1', kcal: 999999, proteinG: -5, carbsG: 90, fatG: 30 }],
    })
    expect(parsed?.kcal).toBe(4000)
    expect(parsed?.proteinG).toBe(0)
  })

  it('caps the number of lines a single answer can create', () => {
    const items = Array.from({ length: 30 }, (_, i) => ({
      name: `Aliment ${i}`,
      quantity: '10 g',
      kcal: 10,
      proteinG: 1,
      carbsG: 1,
      fatG: 0,
    }))
    expect(parseAnalysis({ items })?.items).toHaveLength(12)
  })

  it('falls back to the item names when the label is missing', () => {
    expect(parseAnalysis({ items: VALID.items })?.label).toBe('Blanc de poulet, Riz basmati')
  })

  it('reads a JSON string as well as an object', () => {
    expect(parseAnalysis(JSON.stringify(VALID))?.items).toHaveLength(2)
  })
})

describe('totalsFromItems', () => {
  it('sums each macro', () => {
    expect(totalsFromItems(VALID.items as never)).toEqual({
      kcal: 508,
      proteinG: 51,
      carbsG: 56,
      fatG: 6,
    })
  })

  it('returns zeros for an empty plate', () => {
    expect(totalsFromItems([])).toEqual({ kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 })
  })
})

describe('MEAL_SYSTEM_PROMPT', () => {
  it('forbids inventing a variety the photo cannot show', () => {
    // « Dessert aux fruits (type mangue) » on a glass of lben: the model
    // invented a flavour. The rule against it has to be in the prompt.
    expect(MEAL_SYSTEM_PROMPT).toMatch(/n'invente jamais une variété/i)
  })

  it('names the grains that look alike, so one is not assumed', () => {
    // « Riz au lait » for couscous: the model fell back on the cuisine it sees
    // most often rather than admitting the grain was ambiguous.
    for (const grain of ['semoule', 'couscous', 'boulgour', 'riz']) {
      expect(MEAL_SYSTEM_PROMPT.toLowerCase()).toContain(grain)
    }
  })

  it('spends its instructions on portion size, the dominant error', () => {
    expect(MEAL_SYSTEM_PROMPT).toMatch(/repères d'échelle/i)
  })
})
