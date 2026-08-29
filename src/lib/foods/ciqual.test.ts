import { describe, expect, it } from 'vitest'
import { hasCiqualTable, parseCiqual, rankCiqual } from '@/lib/foods/ciqual'

/** The column names the official export ships, verbatim. */
const KCAL = 'Energie, Règlement UE N° 1169/2011 (kcal/100 g)'
const PROTEIN = 'Protéines, N x facteur de Jones (g/100 g)'
const CARBS = 'Glucides (g/100 g)'
const FAT = 'Lipides (g/100 g)'

const OFFICIAL = [
  {
    alim_code: '13039',
    alim_nom_fr: 'Nectarine, pulpe, crue',
    [KCAL]: '44,0',
    [PROTEIN]: '1,1',
    [CARBS]: '8,9',
    [FAT]: '0,3',
  },
  {
    alim_code: '9642',
    alim_nom_fr: 'Riz blanc, cuit',
    [KCAL]: 130,
    [PROTEIN]: 2.4,
    [CARBS]: 28,
    [FAT]: '< 0,5',
  },
]

const CREME = 'Crème fraîche épaisse 30 %'
const POIVRON = 'Poivron farci au riz'
const RIZ_LAIT = 'Riz au lait'

const SHORT = [
  { name: CREME, kcal: 293, proteinG: 2.4, carbsG: 3, fatG: 30 },
  { name: POIVRON, kcal: 110, proteinG: 3, carbsG: 12, fatG: 5 },
  { name: RIZ_LAIT, kcal: 130, proteinG: 3, carbsG: 22, fatG: 3 },
]

describe('parseCiqual', () => {
  it('lit les colonnes officielles, virgule décimale comprise', () => {
    const [nectarine] = parseCiqual(OFFICIAL)

    expect(nectarine).toMatchObject({
      id: '13039',
      source: 'ciqual',
      name: 'Nectarine, pulpe, crue',
      servingGrams: 100,
      per100g: { kcal: 44, proteinG: 1.1, carbsG: 8.9, fatG: 0.3 },
    })
  })

  it('lit « < 0,5 » comme 0,5 : surestimer une trace est le sens inoffensif', () => {
    const riz = parseCiqual(OFFICIAL)[1]

    expect(riz.per100g.fatG).toBe(0.5)
  })

  it('accepte aussi un export déjà simplifié', () => {
    expect(parseCiqual(SHORT)[0]).toMatchObject({
      name: CREME,
      per100g: { kcal: 293, proteinG: 2.4, carbsG: 3, fatG: 30 },
    })
  })

  it('écarte les lignes sans nom ou sans énergie', () => {
    expect(parseCiqual([{ alim_nom_fr: 'Sans énergie' }, { kcal: 100 }, 'texte', null])).toEqual([])
  })

  it('signale une macro absente au lieu de la faire passer pour zéro', () => {
    const [food] = parseCiqual([{ name: 'Eau', kcal: 0, proteinG: 0 }])

    expect(food.per100g.carbsG).toBe(0)
    expect(food.missingMacros).toEqual(['carbsG', 'fatG'])
  })

  it('survit à un fichier qui n’est pas un tableau', () => {
    expect(parseCiqual({ foods: [] })).toEqual([])
  })
})

describe('rankCiqual', () => {
  const foods = parseCiqual(SHORT)

  it('remonte le mot en tête de nom avant le mot au milieu', () => {
    const found = rankCiqual(foods, 'riz')

    expect(found.map((food) => food.name)).toEqual([RIZ_LAIT, POIVRON])
  })

  it('ignore les accents, qu’on ne tape pas au clavier du téléphone', () => {
    expect(rankCiqual(foods, 'creme')[0]?.name).toBe(CREME)
  })

  it('exige tous les mots, pas un seul', () => {
    expect(rankCiqual(foods, 'riz lait').map((food) => food.name)).toEqual([RIZ_LAIT])
    expect(rankCiqual(foods, 'riz poulet')).toEqual([])
  })

  it('ne rend rien sur une requête vide', () => {
    expect(rankCiqual(foods, '   ')).toEqual([])
  })
})

describe('hasCiqualTable', () => {
  it('dit non tant que le JSON n’est pas déposé', () => {
    // Le jour où `src/data/ciqual.json` arrive, ce test devient l'inverse — et
    // c'est le seul endroit du code à changer.
    expect(hasCiqualTable()).toBe(false)
  })
})
