import { describe, expect, it } from 'vitest'
import { loggingStreak } from '@/lib/streak'

const TODAY = '2026-09-14'

describe('loggingStreak', () => {
  it('compte les jours consécutifs qui finissent sur le jour lu', () => {
    const logged = new Set(['2026-09-12', '2026-09-13', '2026-09-14'])

    expect(loggingStreak(logged, TODAY)).toBe(3)
  })

  it('ne casse pas la série sur une journée pas encore saisie', () => {
    // Sinon le compteur repartirait de zéro chaque matin avant le petit-déj.
    const logged = new Set(['2026-09-12', '2026-09-13'])

    expect(loggingStreak(logged, TODAY)).toBe(2)
  })

  it('repart de zéro après un jour vide', () => {
    const logged = new Set(['2026-09-10', '2026-09-11', '2026-09-13'])

    // Le 13 est saisi mais le 14 ne l'est pas : la série s'arrête au 13.
    expect(loggingStreak(logged, TODAY)).toBe(1)
    // Le 12 est vide, donc le 11 et le 10 sont derrière une coupure.
    expect(loggingStreak(logged, '2026-09-12')).toBe(2)
  })

  it('rend zéro quand rien n’a jamais été saisi', () => {
    expect(loggingStreak(new Set(), TODAY)).toBe(0)
  })

  it('ne plafonne pas : une série peut dépasser la fenêtre d’un écran', () => {
    const logged = new Set<string>()
    for (let i = 0; i < 180; i++) {
      const d = new Date(2026, 8, 14)
      d.setDate(d.getDate() - i)
      logged.add(d.toISOString().slice(0, 10))
    }

    expect(loggingStreak(logged, TODAY)).toBe(180)
  })

  it('lit la série telle qu’elle était un jour donné du passé', () => {
    const logged = new Set(['2026-09-01', '2026-09-02', '2026-09-03'])

    expect(loggingStreak(logged, '2026-09-02')).toBe(2)
  })
})
