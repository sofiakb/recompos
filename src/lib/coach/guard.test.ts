import { describe, expect, it } from 'vitest'
import { distressIn, forbiddenWordsIn } from '@/lib/coach/guard'

describe('forbiddenWordsIn', () => {
  it.each([
    ['Tu as craqué ce week-end.', 'craqué'],
    ['Pas grave, un petit écart.', 'écart'],
    ['Il faut rattraper demain.', 'rattraper'],
    ['Tu peux compenser au dîner.', 'compenser'],
    ['Ne te sens pas coupable.', 'coupable'],
    ['Il faut manger plus de légumes.', 'Il faut'],
    ['Tu dois viser 130 g.', 'Tu dois'],
    ['Le sucre est interdit.', 'interdit'],
    ['UN ÉCART', 'ÉCART'],
  ])('attrape « %s »', (text, word) => {
    expect(forbiddenWordsIn(text)).toContain(word)
  })

  it.each([
    'Rien à compenser : ton prochain repas peut être normal.',
    'Pas besoin de rattraper quoi que ce soit.',
    'Profite de ton repas sans culpabilité.',
    'Inutile de culpabiliser.',
    'Écarte la sauce si tu préfères, ou garde-la.',
    'Une belle régularité cette semaine.',
    'Le fromage frais est un bon allié.',
    'Tes protéines ont bien tenu, bravo.',
  ])('laisse passer « %s »', (text) => {
    expect(forbiddenWordsIn(text)).toEqual([])
  })
})

describe('distressIn', () => {
  it.each([
    ['je vais me faire vomir', 'eating'],
    ['je prends des laxatifs après manger', 'eating'],
    ['je veux arrêter de manger', 'eating'],
    ['je me dégoûte', 'eating'],
    ['je veux me punir de ce repas', 'eating'],
    ['je jeûne depuis 4 jours', 'eating'],
    ["j'ai envie d'en finir", 'crisis'],
    ['je pense au suicide', 'crisis'],
  ])('reconnaît « %s »', (text, kind) => {
    expect(distressIn(text)).toBe(kind)
  })

  it.each([
    "j'ai beaucoup mangé ce midi",
    'une idée pour ce soir ?',
    "j'ai tout gâché ce week-end",
    'comment finir mes protéines',
    'bilan de ma semaine',
  ])('ne surréagit pas à « %s »', (text) => {
    expect(distressIn(text)).toBeNull()
  })

  it('fait passer la crise avant le reste', () => {
    expect(distressIn('je me dégoûte, envie de mourir')).toBe('crisis')
  })
})
