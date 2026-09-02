import { useCallback } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { useWeight } from '@/features/weight/useWeight'
import { computeProteinTargetGrams, PROTEIN_GRAMS_PER_KG } from '@/lib/nutrition'
import { FALLBACK_PROTEIN_TARGET_GRAMS } from '@/db/seed'
import type { ProteinTargetMode } from '@/types/models'

export interface ProteinTargetState {
  /** The number every other screen should use. */
  targetGrams: number
  mode: ProteinTargetMode
  /** What the weight-derived calculation says right now, if a weigh-in exists. */
  computedGrams: number | null
  weightKg: number | null
  gramsPerKg: number
  /** True while the target is a fallback because no weight has been logged. */
  isFallback: boolean
  setManual: (grams: number) => void
  useAuto: () => void
}

/**
 * Resolves the daily protein target (PRD §6.3).
 *
 * Auto mode follows the last weigh-in. A manual value is frozen: a later
 * weigh-in never silently overwrites a number the user chose.
 */
export function useProteinTarget(): ProteinTargetState {
  const mode = useSettingsStore((state) => state.settings.proteinTargetMode)
  const manualGrams = useSettingsStore((state) => state.settings.manualProteinTargetGrams)
  const setManualProteinTarget = useSettingsStore((state) => state.setManualProteinTarget)
  const resetProteinTargetToAuto = useSettingsStore((state) => state.resetProteinTargetToAuto)
  const { currentKg } = useWeight()

  const computedGrams = currentKg === null ? null : computeProteinTargetGrams(currentKg)

  const targetGrams =
    mode === 'manual' && typeof manualGrams === 'number'
      ? manualGrams
      : (computedGrams ?? FALLBACK_PROTEIN_TARGET_GRAMS)

  const setManual = useCallback(
    (grams: number) => setManualProteinTarget(grams),
    [setManualProteinTarget],
  )
  const useAuto = useCallback(() => resetProteinTargetToAuto(), [resetProteinTargetToAuto])

  return {
    targetGrams,
    mode,
    computedGrams,
    weightKg: currentKg,
    gramsPerKg: PROTEIN_GRAMS_PER_KG,
    isFallback: mode === 'auto' && computedGrams === null,
    setManual,
    useAuto,
  }
}
