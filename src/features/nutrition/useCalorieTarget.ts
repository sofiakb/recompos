import { useCallback } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { useWeight } from '@/features/weight/useWeight'
import {
  computeCalorieTargetKcal,
  estimateMaintenance,
  PROVISIONAL_CALORIE_TARGET_KCAL,
  type ActivityLevel,
  type BiologicalSex,
} from '@/lib/nutrition'
import type { AppSettings, CalorieTargetMode } from '@/types/models'

export type BodyProfilePatch = Partial<
  Pick<AppSettings, 'heightCm' | 'birthYear' | 'biologicalSex' | 'activityLevel'>
>

export interface CalorieTargetState {
  targetKcal: number
  mode: CalorieTargetMode
  computedKcal: number | null
  weightKg: number | null
  /** Estimated maintenance before the deficit, so the screen can show both. */
  maintenanceKcal: number | null
  /** False while height or age are missing and the crude estimate is in use. */
  maintenanceFromProfile: boolean
  deficitPercent: number
  heightCm: number | null
  ageYears: number | null
  biologicalSex: BiologicalSex | null
  activityLevel: ActivityLevel
  /** True while the target is a placeholder because no weight has been logged. */
  isFallback: boolean
  setManual: (kcal: number) => void
  useAuto: () => void
  setDeficit: (percent: number) => void
  setProfile: (patch: BodyProfilePatch) => void
}

/**
 * Resolves the daily calorie target (PRD §6.6).
 *
 * Same shape as the protein target: auto follows the body, a manual number
 * freezes, and a later weigh-in never overwrites it.
 *
 * The estimate is built in two visible steps — maintenance, then how far under
 * it to sit — because a single coefficient hides which of the two is wrong when
 * the weight trend disagrees. The first version got this wrong twice: it shipped
 * at maintenance while calling itself a deficit, then overestimated maintenance
 * by roughly the size of the deficit. Both were invisible inside one number.
 */
export function useCalorieTarget(): CalorieTargetState {
  const settings = useSettingsStore((state) => state.settings)
  const setManualCalorieTarget = useSettingsStore((state) => state.setManualCalorieTarget)
  const resetCalorieTargetToAuto = useSettingsStore((state) => state.resetCalorieTargetToAuto)
  const setCalorieDeficitPercent = useSettingsStore((state) => state.setCalorieDeficitPercent)
  const setBodyProfile = useSettingsStore((state) => state.setBodyProfile)
  const { currentKg } = useWeight()

  const ageYears = settings.birthYear ? new Date().getFullYear() - settings.birthYear : null

  const input =
    currentKg === null
      ? null
      : {
          weightKg: currentKg,
          activityLevel: settings.activityLevel,
          heightCm: settings.heightCm,
          ageYears: ageYears ?? undefined,
          sex: settings.biologicalSex,
        }

  const maintenance = input ? estimateMaintenance(input) : null
  const computedKcal = input
    ? computeCalorieTargetKcal(input, settings.calorieDeficitPercent)
    : null

  const targetKcal =
    settings.calorieTargetMode === 'manual' && typeof settings.manualCalorieTargetKcal === 'number'
      ? settings.manualCalorieTargetKcal
      : (computedKcal ?? PROVISIONAL_CALORIE_TARGET_KCAL)

  return {
    targetKcal,
    mode: settings.calorieTargetMode,
    computedKcal,
    weightKg: currentKg,
    maintenanceKcal: maintenance?.kcal ?? null,
    maintenanceFromProfile: maintenance?.fromProfile ?? false,
    deficitPercent: settings.calorieDeficitPercent,
    heightCm: settings.heightCm ?? null,
    ageYears,
    biologicalSex: settings.biologicalSex ?? null,
    activityLevel: settings.activityLevel,
    isFallback: settings.calorieTargetMode === 'auto' && computedKcal === null,
    setManual: useCallback(
      (kcal: number) => setManualCalorieTarget(kcal),
      [setManualCalorieTarget],
    ),
    useAuto: useCallback(() => resetCalorieTargetToAuto(), [resetCalorieTargetToAuto]),
    setDeficit: useCallback(
      (percent: number) => setCalorieDeficitPercent(percent),
      [setCalorieDeficitPercent],
    ),
    setProfile: useCallback((patch: BodyProfilePatch) => setBodyProfile(patch), [setBodyProfile]),
  }
}
