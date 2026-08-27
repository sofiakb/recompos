import { useCallback } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { useWeight } from '@/features/weight/useWeight'
import {
  CALORIES_PER_KG,
  computeCalorieTargetKcal,
  PROVISIONAL_CALORIE_TARGET_KCAL,
} from '@/lib/nutrition'
import type { CalorieTargetMode } from '@/types/models'

export interface CalorieTargetState {
  targetKcal: number
  mode: CalorieTargetMode
  computedKcal: number | null
  smoothedWeightKg: number | null
  kcalPerKg: number
  /** True while the target is a placeholder because no weight has been logged. */
  isFallback: boolean
  setManual: (kcal: number) => void
  useAuto: () => void
}

/**
 * Resolves the daily calorie target (PRD §6.6).
 *
 * Same shape as the protein target, deliberately: auto follows smoothed body
 * weight, a manual number freezes and a later weigh-in never overwrites it.
 *
 * The coefficient is a starting point and the UI says so. No formula that only
 * knows body weight can know height, age or how much a day actually moves — the
 * target worth keeping is the one adjusted after a few weeks of watching the
 * weight trend against it.
 */
export function useCalorieTarget(): CalorieTargetState {
  const mode = useSettingsStore((state) => state.settings.calorieTargetMode)
  const manualKcal = useSettingsStore((state) => state.settings.manualCalorieTargetKcal)
  const setManualCalorieTarget = useSettingsStore((state) => state.setManualCalorieTarget)
  const resetCalorieTargetToAuto = useSettingsStore((state) => state.resetCalorieTargetToAuto)
  const { smoothedKg } = useWeight()

  const computedKcal = smoothedKg === null ? null : computeCalorieTargetKcal(smoothedKg)
  const targetKcal =
    mode === 'manual' && typeof manualKcal === 'number'
      ? manualKcal
      : (computedKcal ?? PROVISIONAL_CALORIE_TARGET_KCAL)

  return {
    targetKcal,
    mode,
    computedKcal,
    smoothedWeightKg: smoothedKg,
    kcalPerKg: CALORIES_PER_KG,
    isFallback: mode === 'auto' && computedKcal === null,
    setManual: useCallback(
      (kcal: number) => setManualCalorieTarget(kcal),
      [setManualCalorieTarget],
    ),
    useAuto: useCallback(() => resetCalorieTargetToAuto(), [resetCalorieTargetToAuto]),
  }
}
