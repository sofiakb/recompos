/**
 * Shapes the coach passes around.
 *
 * Kept out of `types/models.ts` except for what the database stores: a digest is
 * rebuilt on every question and never persisted, so it is not a model.
 */
import type { ActivityLevel, BiologicalSex } from '@/lib/nutrition'
import type { IsoDate, MealSlot } from '@/types/models'

export type QuickPromptId = 'tonight' | 'week' | 'big_meal' | 'protein'

export type DistressKind = 'crisis' | 'eating'

export interface CoachReply {
  constat: string
  suggestion: { titre: string; detail: string } | null
  question: string | null
}

export interface DigestMeal {
  creneau: MealSlot
  libelle: string
  kcal: number
  proteinesG: number
}

export interface DigestDay {
  date: IsoDate
  /** False: nothing eaten was logged. Never a zero, which would read as a fast. */
  saisi: boolean
  kcal?: number
  proteinesG?: number
  repas?: DigestMeal[]
  plancherFait?: boolean
  seances?: string[]
}

/**
 * The week in numbers (décision n°33). Today is left out of the average: at
 * 7 pm it is half a day, and counting it would make every evening look light.
 */
export interface DigestWeek {
  /** Finished days with something logged, today excluded. */
  joursComptes: number
  moyenneKcal: number
  cibleKcal: number
  /** The lowest a single day may be planned at: 85 % of the target, never under 1 200. */
  minimumJourKcal: number
}

export interface CoachDigest {
  aujourdhui: IsoDate
  heure: string
  profil: {
    cibleProteinesG: number
    cibleKcal: number
    activite: ActivityLevel
    age: number | null
    sexe: BiologicalSex | null
    tailleCm: number | null
  }
  jours: DigestDay[]
  /** Null until at least one finished day was logged in the window. */
  semaine: DigestWeek | null
  poids: { tendance: number[]; derniere: IsoDate } | null
  tourDeTailleCm: number | null
  favoris: string[]
  zeroCuisson: string[]
  livraison: string[]
}
