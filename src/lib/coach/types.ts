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
  poids: { tendance: number[]; derniere: IsoDate } | null
  tourDeTailleCm: number | null
  favoris: string[]
  zeroCuisson: string[]
  livraison: string[]
}
