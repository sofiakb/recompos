import { useEffect } from 'react'
import { AppRouter } from '@/app/router'
import { UpdatePrompt } from '@/components/shared/UpdatePrompt'
import { OnboardingScreen } from '@/screens/OnboardingScreen'
import { seedDatabase } from '@/db/dexie'
import { useSettingsStore } from '@/stores/settingsStore'

export function App() {
  const onboardingDone = useSettingsStore((state) => Boolean(state.settings.onboardingCompletedAt))

  useEffect(() => {
    void seedDatabase()
    // Ask for durable storage early: iOS evicts best-effort IndexedDB after a
    // period without use, which would silently lose months of logs (PRD §15).
    void navigator.storage?.persist?.()
  }, [])

  return (
    <>
      <UpdatePrompt />
      {onboardingDone ? <AppRouter /> : <OnboardingScreen />}
    </>
  )
}
