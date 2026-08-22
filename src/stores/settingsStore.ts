/**
 * Settings and habit definitions (PRD §7 storage split).
 *
 * Small, read on every render, and needed synchronously on first paint — so
 * localStorage via Zustand `persist`, not IndexedDB.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_HABITS } from '@/db/seed'
import { createId } from '@/lib/utils'
import { toLogicalDate } from '@/lib/date'
import { clampProteinTargetGrams } from '@/lib/nutrition'
import {
  SCHEMA_VERSION,
  type AppSettings,
  type FloorHabitDefinition,
  type ProteinTargetMode,
} from '@/types/models'

export const STORAGE_KEY = 'recompos:settings'

function seedHabits(): FloorHabitDefinition[] {
  const now = new Date().toISOString()
  return DEFAULT_HABITS.map((habit) => ({
    ...habit,
    id: createId(),
    createdAt: now,
    updatedAt: now,
  }))
}

function initialSettings(): AppSettings {
  return {
    schemaVersion: SCHEMA_VERSION,
    installedAt: new Date().toISOString(),
    proteinTargetMode: 'auto',
    locale: 'fr',
    restTimerDefaultSeconds: 60,
    hapticsEnabled: true,
    soundEnabled: true,
  }
}

interface SettingsState {
  settings: AppSettings
  habits: FloorHabitDefinition[]
  /** Freezes the target on a human-chosen number until auto is asked for again. */
  setManualProteinTarget: (grams: number) => void
  /** Hands the target back to the weight-derived calculation. */
  resetProteinTargetToAuto: () => void
  setRestTimerSeconds: (seconds: 60 | 90) => void
  toggleHaptics: (enabled: boolean) => void
  toggleSound: (enabled: boolean) => void
  completeOnboarding: () => void
  addHabit: (habit: Omit<FloorHabitDefinition, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void
  updateHabit: (id: string, patch: Partial<FloorHabitDefinition>) => void
  archiveHabit: (id: string) => void
  installedOnDate: () => string
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: initialSettings(),
      habits: seedHabits(),

      setManualProteinTarget: (grams) =>
        set((state) => ({
          settings: {
            ...state.settings,
            proteinTargetMode: 'manual',
            manualProteinTargetGrams: clampProteinTargetGrams(grams),
          },
        })),

      resetProteinTargetToAuto: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            proteinTargetMode: 'auto',
            manualProteinTargetGrams: undefined,
          },
        })),

      setRestTimerSeconds: (seconds) =>
        set((state) => ({ settings: { ...state.settings, restTimerDefaultSeconds: seconds } })),

      toggleHaptics: (enabled) =>
        set((state) => ({ settings: { ...state.settings, hapticsEnabled: enabled } })),

      toggleSound: (enabled) =>
        set((state) => ({ settings: { ...state.settings, soundEnabled: enabled } })),

      completeOnboarding: () =>
        set((state) => ({
          settings: { ...state.settings, onboardingCompletedAt: new Date().toISOString() },
        })),

      addHabit: (habit) =>
        set((state) => {
          const now = new Date().toISOString()
          const order = state.habits.reduce((max, h) => Math.max(max, h.order), -1) + 1
          return {
            habits: [
              ...state.habits,
              { ...habit, id: createId(), order, createdAt: now, updatedAt: now },
            ],
          }
        }),

      updateHabit: (id, patch) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, ...patch, updatedAt: new Date().toISOString() } : habit,
          ),
        })),

      // Archive rather than delete: a deleted habit would punch a hole in the
      // completions history and silently change past consistency scores.
      archiveHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? {
                  ...habit,
                  archivedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : habit,
          ),
        })),

      installedOnDate: () => toLogicalDate(new Date(get().settings.installedAt)),
    }),
    {
      name: STORAGE_KEY,
      version: SCHEMA_VERSION,
      migrate: (persisted, fromVersion) => migrateSettings(persisted, fromVersion),
    },
  ),
)

type PersistedShape = { settings: AppSettings; habits: FloorHabitDefinition[] }

/**
 * v1 → v2: the protein target moved from a bare number to a weight-derived
 * calculation, and the floor's protein habit became a real food portion.
 *
 * A number the user typed in v1 was a human decision, so it survives as a manual
 * override rather than being silently replaced by the computed value.
 */
export function migrateSettings(persisted: unknown, fromVersion: number): PersistedShape {
  const state = persisted as PersistedShape & {
    settings: AppSettings & { proteinTargetGrams?: number }
  }

  if (fromVersion >= SCHEMA_VERSION) return state

  const { proteinTargetGrams, ...settings } = state.settings

  return {
    settings: {
      ...settings,
      schemaVersion: SCHEMA_VERSION,
      proteinTargetMode: proteinTargetGrams ? 'manual' : 'auto',
      ...(proteinTargetGrams
        ? { manualProteinTargetGrams: clampProteinTargetGrams(proteinTargetGrams) }
        : {}),
    },
    habits: state.habits.map((habit) => {
      const isLegacyShake =
        habit.category === 'nutrition' && /shaker/i.test(habit.title) && habit.kind === 'floor'
      if (isLegacyShake) {
        return {
          ...habit,
          title: '1 portion de protéines zéro-cuisson',
          targetRepsOrAction: 'au choix dans le catalogue',
          completionMode: 'protein_portion' as const,
          updatedAt: new Date().toISOString(),
        }
      }
      return { ...habit, completionMode: habit.completionMode ?? ('toggle' as const) }
    }),
  }
}

/** Active (non-archived) habits of a kind, in display order. */
export function selectHabits(habits: FloorHabitDefinition[], kind: 'floor' | 'stack') {
  return habits
    .filter((habit) => !habit.archivedAt && habit.kind === kind)
    .sort((a, b) => a.order - b.order)
}

export type { ProteinTargetMode }
