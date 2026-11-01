import { describe, expect, it } from 'vitest'
import { LIMITS, parseCoachReply } from '@/lib/coach/schema'

const FULL = {
  constat: 'Tu as tenu tes protéines 5 jours sur 7.',
  suggestion: { titre: 'Un skyr ce soir', detail: "Il t'apporte 15 g, sans cuisson." },
  question: "Qu'est-ce qui t'a aidé mardi ?",
}

describe('parseCoachReply', () => {
  it('lit une réponse complète', () => {
    expect(parseCoachReply(JSON.stringify(FULL))).toEqual(FULL)
  })

  it('trouve le JSON dans de la prose', () => {
    expect(parseCoachReply(`Voici : ${JSON.stringify(FULL)} Bonne soirée`)).toEqual(FULL)
  })

  it('accepte une suggestion et une question absentes', () => {
    expect(parseCoachReply(JSON.stringify({ constat: 'Belle semaine.' }))).toEqual({
      constat: 'Belle semaine.',
      suggestion: null,
      question: null,
    })
  })

  it('rejette une réponse sans constat', () => {
    expect(parseCoachReply(JSON.stringify({ suggestion: FULL.suggestion }))).toBeNull()
  })

  it('jette une suggestion à moitié remplie', () => {
    const reply = parseCoachReply(JSON.stringify({ ...FULL, suggestion: { titre: 'x' } }))
    expect(reply?.suggestion).toBeNull()
  })

  it('coupe les champs trop longs', () => {
    const reply = parseCoachReply(JSON.stringify({ ...FULL, constat: 'a'.repeat(2000) }))
    expect(reply?.constat.length).toBe(LIMITS.constat)
  })

  it('rend null sur du texte sans JSON', () => {
    expect(parseCoachReply('Désolé, je ne peux pas.')).toBeNull()
  })

  it('lit la clé « reponse » demandée par le prompt', () => {
    expect(parseCoachReply(JSON.stringify({ reponse: 'Je suis ton coach.' }))?.constat).toBe(
      'Je suis ton coach.',
    )
  })
})
