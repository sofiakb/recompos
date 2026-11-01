import { describe, expect, it } from 'vitest'
import { buildDigest, MAX_LABEL, MAX_MEALS_PER_DAY } from '@/lib/coach/digest'
import { WEEKS, week } from '@/lib/coach/fixtures'

describe('buildDigest', () => {
  it("couvre exactement 7 jours, du plus ancien à aujourd'hui", () => {
    const digest = buildDigest(WEEKS.regular)
    expect(digest.jours).toHaveLength(7)
    expect(digest.jours[0].date).toBe('2026-10-26')
    expect(digest.jours[6].date).toBe('2026-11-01')
    expect(digest.aujourdhui).toBe('2026-11-01')
    expect(digest.heure).toBe('19:40')
  })

  it('marque un jour vide comme non saisi, sans zéro', () => {
    const blank = buildDigest(WEEKS.threeBlank).jours[1]
    expect(blank.saisi).toBe(false)
    expect(blank).not.toHaveProperty('kcal')
    expect(blank).not.toHaveProperty('proteinesG')
    expect(blank).not.toHaveProperty('repas')
  })

  it('garde le plancher et les séances d’un jour sans repas', () => {
    const input = week([{ kcal: null, session: true, floor: true }])
    expect(buildDigest(input).jours[0]).toEqual({
      date: '2026-10-26',
      saisi: false,
      plancherFait: true,
      seances: ['circuit 20 min'],
    })
  })

  it('prend les protéines du registre, sans les compter deux fois', () => {
    const day = buildDigest(WEEKS.regular).jours[0]
    // 132 g dans le registre ; les repas en portent aussi ~132 g au total.
    expect(day.proteinesG).toBe(132)
    expect(day.kcal).toBe(1950)
  })

  it("ignore un repas encore en attente d'analyse", () => {
    const input = WEEKS.regular
    const pending = { ...input.meals[0], id: 'pending', status: 'pending' as const, kcal: 999 }
    const digest = buildDigest({ ...input, meals: [...input.meals, pending] })
    expect(digest.jours[0].kcal).toBe(1950)
  })

  it('tronque les libellés et plafonne le nombre de repas', () => {
    const input = week([{ kcal: 2000 }])
    const many = Array.from({ length: 10 }, (_, i) => ({
      ...input.meals[0],
      id: `m${i}`,
      label: 'x'.repeat(100),
    }))
    const repas = buildDigest({ ...input, meals: many }).jours[0].repas ?? []
    expect(repas).toHaveLength(MAX_MEALS_PER_DAY)
    expect(repas[0].libelle.length).toBeLessThanOrEqual(MAX_LABEL)
  })

  it('ne donne aucun écart ni dépassement : la valeur et la cible seulement', () => {
    const text = JSON.stringify(buildDigest(WEEKS.heavyWeekend))
    expect(text).not.toMatch(/ecart|écart|depass|dépass|deficit|déficit|exces|excès/i)
  })

  it('rend la tendance du poids du plus ancien au plus récent', () => {
    expect(buildDigest(WEEKS.regular).poids).toEqual({
      tendance: [72.4, 72.1, 71.9, 71.8],
      derniere: '2026-10-30',
    })
  })

  it('rend null sans pesée', () => {
    expect(buildDigest({ ...WEEKS.regular, weightsNewestFirst: [] }).poids).toBeNull()
  })

  it('ne propose que le zéro-cuisson en stock', () => {
    expect(buildDigest(WEEKS.regular).zeroCuisson).toEqual(['Skyr', 'Thon en boîte'])
  })

  it('tient dans le budget, même une semaine chargée', () => {
    // ~4 caractères par token : 8 000 caractères ≈ 2 000 tokens (spec §4.3).
    const input = week(Array.from({ length: 7 }, () => ({ kcal: 2400, session: true })))
    expect(JSON.stringify(buildDigest(input)).length).toBeLessThan(8000)
  })
})
