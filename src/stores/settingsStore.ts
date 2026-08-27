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
import {
  clampAgeYears,
  clampCalorieTargetKcal,
  clampDeficitPercent,
  clampHeightCm,
  clampProteinTargetGrams,
  DEFAULT_ACTIVITY_LEVEL,
  DEFAULT_DEFICIT_PERCENT,
  DEFAULT_MEAL_PHOTO_RETENTION_DAYS,
} from '@/lib/nutrition'
import { clampRestSeconds } from '@/lib/timer'
import {
  SCHEMA_VERSION,
  type AppSettings,
  type FloorHabitDefinition,
  type ProteinTargetMode,
  type VisionProviderId,
  type VisionProviderSettings,
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
    calorieTargetMode: 'auto',
    calorieDeficitPercent: DEFAULT_DEFICIT_PERCENT,
    activityLevel: DEFAULT_ACTIVITY_LEVEL,
    mealPhotoRetentionDays: DEFAULT_MEAL_PHOTO_RETENTION_DAYS,
  }
}

interface SettingsState {
  settings: AppSettings
  habits: FloorHabitDefinition[]
  /** Freezes the target on a human-chosen number until auto is asked for again. */
  setManualProteinTarget: (grams: number) => void
  /** Hands the target back to the weight-derived calculation. */
  resetProteinTargetToAuto: () => void
  setRestTimerSeconds: (seconds: number) => void
  /** Freezes the calorie target on a human-chosen number, like the protein one. */
  setManualCalorieTarget: (kcal: number) => void
  resetCalorieTargetToAuto: () => void
  /** Moves the automatic target relative to estimated maintenance. */
  setCalorieDeficitPercent: (percent: number) => void
  /** Height, birth year, sex and activity — what the resting-rate formula needs. */
  setBodyProfile: (
    patch: Partial<Pick<AppSettings, 'heightCm' | 'birthYear' | 'biologicalSex' | 'activityLevel'>>,
  ) => void
  setMealPhotoRetentionDays: (days: number) => void
  setVisionProvider: (id: VisionProviderId, patch: Partial<VisionProviderSettings>) => void
  clearVisionProvider: (id: VisionProviderId) => void
  toggleHaptics: (enabled: boolean) => void
  toggleSound: (enabled: boolean) => void
  completeOnboarding: () => void
  markCatalogsSeeded: () => void
  addHabit: (habit: Omit<FloorHabitDefinition, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void
  updateHabit: (id: string, patch: Partial<FloorHabitDefinition>) => void
  archiveHabit: (id: string) => void
  /** Brings an archived habit back into today's list, at the end of its group. */
  restoreHabit: (id: string) => void
  /** Swaps a habit with its neighbour of the same kind. -1 is up, +1 is down. */
  moveHabit: (id: string, direction: -1 | 1) => void
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
        set((state) => ({
          settings: { ...state.settings, restTimerDefaultSeconds: clampRestSeconds(seconds) },
        })),

      setManualCalorieTarget: (kcal) =>
        set((state) => ({
          settings: {
            ...state.settings,
            calorieTargetMode: 'manual',
            manualCalorieTargetKcal: clampCalorieTargetKcal(kcal),
          },
        })),

      resetCalorieTargetToAuto: () =>
        set((state) => {
          const { manualCalorieTargetKcal: _dropped, ...settings } = state.settings
          return { settings: { ...settings, calorieTargetMode: 'auto' } }
        }),

      setCalorieDeficitPercent: (percent) =>
        set((state) => ({
          settings: {
            ...state.settings,
            calorieDeficitPercent: clampDeficitPercent(percent),
            // Changing the deficit is a request for the calculation to apply, so
            // it hands the target back to auto rather than sitting inert behind
            // a frozen manual number.
            calorieTargetMode: 'auto',
          },
        })),

      setBodyProfile: (patch) =>
        set((state) => {
          const currentYear = new Date().getFullYear()
          return {
            settings: {
              ...state.settings,
              ...patch,
              ...(patch.heightCm !== undefined
                ? { heightCm: patch.heightCm ? clampHeightCm(patch.heightCm) : undefined }
                : {}),
              ...(patch.birthYear !== undefined
                ? {
                    birthYear: patch.birthYear
                      ? currentYear - clampAgeYears(currentYear - patch.birthYear)
                      : undefined,
                  }
                : {}),
            },
          }
        }),

      setMealPhotoRetentionDays: (days) =>
        set((state) => ({
          settings: {
            ...state.settings,
            mealPhotoRetentionDays: Math.max(0, Math.min(365, Math.round(days))),
          },
        })),

      setVisionProvider: (id, patch) =>
        set((state) => {
          const current = state.settings.visionProviders?.[id]
          return {
            settings: {
              ...state.settings,
              visionProviders: {
                ...state.settings.visionProviders,
                [id]: { apiKey: '', enabled: true, ...current, ...patch },
              },
            },
          }
        }),

      clearVisionProvider: (id) =>
        set((state) => {
          const providers = { ...state.settings.visionProviders }
          delete providers[id]
          return { settings: { ...state.settings, visionProviders: providers } }
        }),

      toggleHaptics: (enabled) =>
        set((state) => ({ settings: { ...state.settings, hapticsEnabled: enabled } })),

      toggleSound: (enabled) =>
        set((state) => ({ settings: { ...state.settings, soundEnabled: enabled } })),

      completeOnboarding: () =>
        set((state) => ({
          settings: { ...state.settings, onboardingCompletedAt: new Date().toISOString() },
        })),

      markCatalogsSeeded: () =>
        set((state) =>
          state.settings.catalogsSeededAt
            ? state
            : { settings: { ...state.settings, catalogsSeededAt: new Date().toISOString() } },
        ),

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

      restoreHabit: (id) =>
        set((state) => {
          const now = new Date().toISOString()
          const order = state.habits.reduce((max, h) => Math.max(max, h.order), -1) + 1
          return {
            habits: state.habits.map((habit) =>
              habit.id === id ? { ...habit, archivedAt: undefined, order, updatedAt: now } : habit,
            ),
          }
        }),

      // Order is a single sequence across both kinds, so moving within a kind is
      // a swap with the previous or next *active habit of that kind*, never with
      // the numerically adjacent one — which may belong to the other list.
      moveHabit: (id, direction) =>
        set((state) => {
          const habit = state.habits.find((h) => h.id === id)
          if (!habit) return {}
          const siblings = selectHabits(state.habits, habit.kind)
          const index = siblings.findIndex((h) => h.id === id)
          const target = siblings[index + direction]
          if (!target) return {}
          const now = new Date().toISOString()
          return {
            habits: state.habits.map((h) => {
              if (h.id === habit.id) return { ...h, order: target.order, updatedAt: now }
              if (h.id === target.id) return { ...h, order: habit.order, updatedAt: now }
              return h
            }),
          }
        }),

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
      // v2 → v3 added the calorie target and the meal photo retention. Both get
      // their defaults rather than being left undefined, so nothing downstream
      // has to guard for a settings object that predates the meal module.
      calorieTargetMode: settings.calorieTargetMode ?? 'auto',
      calorieDeficitPercent: settings.calorieDeficitPercent ?? DEFAULT_DEFICIT_PERCENT,
      activityLevel: settings.activityLevel ?? DEFAULT_ACTIVITY_LEVEL,
      mealPhotoRetentionDays: settings.mealPhotoRetentionDays ?? DEFAULT_MEAL_PHOTO_RETENTION_DAYS,
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

/** Archived habits, most recently archived first. */
export function selectArchivedHabits(habits: FloorHabitDefinition[]) {
  return habits
    .filter((habit) => habit.archivedAt)
    .sort((a, b) => (b.archivedAt ?? '').localeCompare(a.archivedAt ?? ''))
}

/** Active (non-archived) habits of a kind, in display order. */
export function selectHabits(habits: FloorHabitDefinition[], kind: 'floor' | 'stack') {
  return habits
    .filter((habit) => !habit.archivedAt && habit.kind === kind)
    .sort((a, b) => a.order - b.order)
}

export type { ProteinTargetMode }
