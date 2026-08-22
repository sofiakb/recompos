/**
 * Settings and habit definitions (PRD §7 storage split).
 *
 * Small, read on every render, and needed synchronously on first paint — so
 * localStorage via Zustand `persist`, not IndexedDB.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_HABITS, DEFAULT_PROTEIN_TARGET_GRAMS } from '@/db/seed'
import { createId } from '@/lib/utils'
import { toLogicalDate } from '@/lib/date'
import { SCHEMA_VERSION, type AppSettings, type FloorHabitDefinition } from '@/types/models'

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
    proteinTargetGrams: DEFAULT_PROTEIN_TARGET_GRAMS,
    locale: 'fr',
    restTimerDefaultSeconds: 60,
    hapticsEnabled: true,
    soundEnabled: true,
  }
}

interface SettingsState {
  settings: AppSettings
  habits: FloorHabitDefinition[]
  setProteinTarget: (grams: number) => void
  setRestTimerSeconds: (seconds: 60 | 90) => void
  toggleHaptics: (enabled: boolean) => void
  toggleSound: (enabled: boolean) => void
  completeOnboarding: () => void
  addHabit: (habit: Omit<FloorHabitDefinition, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void
  updateHabit: (id: string, patch: Partial<FloorHabitDefinition>) => void
  archiveHabit: (id: string) => void
  /** Day key the install is anchored on, for the consistency denominator. */
  installedOnDate: () => string
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: initialSettings(),
      habits: seedHabits(),

      setProteinTarget: (grams) =>
        set((state) => ({
          settings: { ...state.settings, proteinTargetGrams: Math.round(grams) },
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
    },
  ),
)

/** Active (non-archived) habits of a kind, in display order. */
export function selectHabits(habits: FloorHabitDefinition[], kind: 'floor' | 'stack') {
  return habits
    .filter((habit) => !habit.archivedAt && habit.kind === kind)
    .sort((a, b) => a.order - b.order)
}
