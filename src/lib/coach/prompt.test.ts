import { describe, expect, it } from 'vitest'
import { coachUserPrompt, NUTRITION_SYSTEM_PROMPT, rewritePrompt } from '@/lib/coach/prompt'
import { isQuickPromptId, PERSONAS } from '@/lib/coach/personas'
import { mentionsJson } from '@/lib/llm/client'
import { forbiddenWordsIn } from '@/lib/coach/guard'

describe('prompt du coach', () => {
  it('dit « JSON », sans quoi le mode JSON est refusé', () => {
    expect(mentionsJson([{ role: 'system', content: NUTRITION_SYSTEM_PROMPT }])).toBe(true)
  })

  it('porte le résumé et la question dans le message utilisateur', () => {
    const text = coachUserPrompt('{"jours":[]}', '  Une idée pour ce soir ?  ')
    expect(text).toContain('{"jours":[]}')
    expect(text).toContain('Ma question : Une idée pour ce soir ?')
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
