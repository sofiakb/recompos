import { describe, expect, it } from 'vitest'
import { migrateSettings } from '@/stores/settingsStore'
import { SCHEMA_VERSION } from '@/types/models'

const V1_STATE = {
  settings: {
    schemaVersion: 1,
    installedAt: '2026-08-22T14:00:00.000Z',
    proteinTargetGrams: 160,
    locale: 'fr' as const,
    restTimerDefaultSeconds: 60 as const,
    hapticsEnabled: true,
    soundEnabled: true,
  },
  habits: [
    {
      id: 'a',
      title: '5 pompes',
      targetRepsOrAction: '5 pompes',
      category: 'workout' as const,
      kind: 'floor' as const,
      order: 0,
      createdAt: '2026-08-22T14:00:00.000Z',
      updatedAt: '2026-08-22T14:00:00.000Z',
    },
    {
      id: 'b',
      title: '1 shaker de protéines',
      targetRepsOrAction: '1 shaker',
      category: 'nutrition' as const,
      kind: 'floor' as const,
      order: 1,
      createdAt: '2026-08-22T14:00:00.000Z',
      updatedAt: '2026-08-22T14:00:00.000Z',
    },
  ],
}

describe('migrateSettings v1 → v2', () => {
  it('keeps a target the user typed as a manual override', () => {
    // The v1 number was a human decision; a weigh-in must not silently replace it.
    const { settings } = migrateSettings(structuredClone(V1_STATE), 1)
    expect(settings.proteinTargetMode).toBe('manual')
    expect(settings.manualProteinTargetGrams).toBe(160)
    expect(settings.schemaVersion).toBe(SCHEMA_VERSION)
  })

  it('drops the obsolete flat target field', () => {
    const { settings } = migrateSettings(structuredClone(V1_STATE), 1)
    expect('proteinTargetGrams' in settings).toBe(false)
  })

  it('turns the legacy shaker habit into a real protein portion', () => {
    const { habits } = migrateSettings(structuredClone(V1_STATE), 1)
    const nutrition = habits.find((habit) => habit.category === 'nutrition')!
    expect(nutrition.completionMode).toBe('protein_portion')
    expect(nutrition.title).toBe('1 portion de protéines zéro-cuisson')
  })

  it('leaves other habits alone but gives them a completion mode', () => {
    const { habits } = migrateSettings(structuredClone(V1_STATE), 1)
    const pushups = habits.find((habit) => habit.id === 'a')!
    expect(pushups.title).toBe('5 pompes')
    expect(pushups.completionMode).toBe('toggle')
  })

  it('falls back to auto when v1 had no target at all', () => {
    const clone = structuredClone(V1_STATE)
    const { proteinTargetGrams: _dropped, ...settingsWithoutTarget } = clone.settings
    const { settings } = migrateSettings({ ...clone, settings: settingsWithoutTarget }, 1)
    expect(settings.proteinTargetMode).toBe('auto')
    expect(settings.manualProteinTargetGrams).toBeUndefined()
  })

  it('is a no-op on state already at the current version', () => {
    const current = {
      settings: { ...V1_STATE.settings, schemaVersion: SCHEMA_VERSION, proteinTargetMode: 'auto' },
      habits: V1_STATE.habits,
    }
    expect(migrateSettings(current, SCHEMA_VERSION)).toBe(current)
  })
})
