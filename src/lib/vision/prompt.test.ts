import { describe, expect, it } from 'vitest'
import {
  contextPrompt,
  hintPrompt,
  mealTextUserPrompt,
  MEAL_JSON_SHAPE,
  MEAL_PHOTO_SYSTEM_PROMPT,
  MEAL_RULES,
  MEAL_TEXT_SYSTEM_PROMPT,
} from '@/lib/vision/prompt'

describe('prompts partagés', () => {
  it('donne le même bloc de règles aux deux modalités', () => {
    expect(MEAL_PHOTO_SYSTEM_PROMPT).toContain(MEAL_RULES)
    expect(MEAL_TEXT_SYSTEM_PROMPT).toContain(MEAL_RULES)
  })

  it('donne le même format de sortie aux deux modalités', () => {
    expect(MEAL_PHOTO_SYSTEM_PROMPT).toContain(MEAL_JSON_SHAPE)
    expect(MEAL_TEXT_SYSTEM_PROMPT).toContain(MEAL_JSON_SHAPE)
  })

  it('dit « json » dans les deux, sans quoi le mode JSON est refusé', () => {
    expect(MEAL_PHOTO_SYSTEM_PROMPT).toMatch(/json/i)
    expect(MEAL_TEXT_SYSTEM_PROMPT).toMatch(/json/i)
  })

  it("garde les repères d'échelle visuelle du côté photo", () => {
    expect(MEAL_PHOTO_SYSTEM_PROMPT).toMatch(/assiette/i)
    expect(MEAL_TEXT_SYSTEM_PROMPT).not.toMatch(/assiette ~26/i)
  })

  it('demande au chemin texte de signaler les portions non données', () => {
    expect(MEAL_TEXT_SYSTEM_PROMPT).toMatch(/portion/i)
    expect(MEAL_TEXT_SYSTEM_PROMPT).toMatch(/notes/i)
  })
})

describe('contexte et correction', () => {
  it("ne désavoue pas une lecture précédente quand il n'y en a pas eu", () => {
    expect(contextPrompt('riz complet')).not.toMatch(/précédente/i)
    expect(contextPrompt('riz complet')).toContain('riz complet')
  })

  it('désavoue explicitement la lecture ratée dans une correction', () => {
    expect(hintPrompt('couscous, pas du riz')).toMatch(/précédente/i)
    expect(hintPrompt('couscous, pas du riz')).toContain('couscous, pas du riz')
  })

  it('coupe les espaces autour du texte reçu', () => {
    expect(contextPrompt('  riz  ')).toContain('riz')
    expect(contextPrompt('  riz  ')).not.toContain('  riz  ')
  })
})

describe('mealTextUserPrompt', () => {
  it("porte la description telle que l'utilisateur l'a écrite", () => {
    expect(mealTextUserPrompt('200 g de poulet')).toContain('200 g de poulet')
  })
})
