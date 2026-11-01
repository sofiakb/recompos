import { describe, expect, it } from 'vitest'
import { buildDigest } from '@/lib/coach/digest'
import { WEEKS } from '@/lib/coach/fixtures'
import { forbiddenWordsIn } from '@/lib/coach/guard'
import { isQuickPromptId, PERSONAS } from '@/lib/coach/personas'
import { NUTRITION_PERSONA, nutritionSystemPrompt, rewritePrompt } from '@/lib/coach/prompt'
import { mentionsJson } from '@/lib/llm/client'

const system = nutritionSystemPrompt(buildDigest(WEEKS.regular))

describe('prompt du coach (décision n°34)', () => {
  it('ne dit jamais « json », qui allumerait le mode JSON', () => {
    expect(mentionsJson([{ role: 'system', content: system }])).toBe(false)
  })

  it('porte les données de l’app comme contexte, une seule fois', () => {
    expect(system).toContain('"aujourdhui":"2026-11-01"')
    expect(system.split('"aujourdhui"')).toHaveLength(2)
  })

  it('demande une conversation : réagir, questionner, suivre le fil', () => {
    expect(NUTRITION_PERSONA).toMatch(/réagis d'abord à ce que la personne vient de dire/)
    expect(NUTRITION_PERSONA).toMatch(/Une question à la fois/)
    expect(NUTRITION_PERSONA).toMatch(/tu ne répètes jamais/)
  })

  it('garde le bilan hebdo et ses bornes', () => {
    expect(NUTRITION_PERSONA).toContain('semaine.minimumJourKcal')
    expect(NUTRITION_PERSONA).toMatch(/sauter un repas/)
  })

  it('nomme les mots à retirer quand il fait réécrire', () => {
    expect(rewritePrompt(['écart', 'il faut'])).toContain('« écart », « il faut »')
  })
})

describe('persona nutrition', () => {
  it('propose les quatre questions rapides, dans l’ordre de la spec', () => {
    expect(PERSONAS.nutrition.quickPrompts.map((p) => p.id)).toEqual([
      'tonight',
      'week',
      'big_meal',
      'protein',
    ])
  })

  it('n’emploie elle-même aucun mot du lexique dans ses questions', () => {
    for (const prompt of PERSONAS.nutrition.quickPrompts) {
      expect(forbiddenWordsIn(prompt.question)).toEqual([])
    }
  })

  it('reconnaît un identifiant de question rapide', () => {
    expect(isQuickPromptId('tonight')).toBe(true)
    expect(isQuickPromptId('dessert')).toBe(false)
    expect(isQuickPromptId(null)).toBe(false)
  })
})
