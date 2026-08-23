import { useEffect } from 'react'
import { AppRouter } from '@/app/router'
import { UpdatePrompt } from '@/components/shared/UpdatePrompt'
import { OnboardingScreen } from '@/screens/OnboardingScreen'
import { db, seedDatabase } from '@/db/dexie'
import { useSettingsStore } from '@/stores/settingsStore'

export function App() {
  const onboardingDone = useSettingsStore((state) => Boolean(state.settings.onboardingCompletedAt))
  const catalogsSeeded = useSettingsStore((state) => Boolean(state.settings.catalogsSeededAt))
  const markCatalogsSeeded = useSettingsStore((state) => state.markCatalogsSeeded)

  useEffect(() => {
    // Runs once: the flag is written straight after, so the effect's own
    // dependency flips and it never seeds twice.
    void seedDatabase(db, catalogsSeeded).then(markCatalogsSeeded)
    // Ask for durable storage early: iOS evicts best-effort IndexedDB after a
    // period without use, which would silently lose months of logs (PRD §15).
    void navigator.storage?.persist?.()
  }, [catalogsSeeded, markCatalogsSeeded])

  return (
    <>
      <UpdatePrompt />
      {onboardingDone ? <AppRouter /> : <OnboardingScreen />}
    </>
  )
}
