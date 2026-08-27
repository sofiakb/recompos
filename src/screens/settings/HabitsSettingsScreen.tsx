import { HabitManagerCard } from '@/features/habits/HabitManagerCard'
import { SettingsPage } from '@/screens/settings/SettingsPage'
import { t } from '@/i18n/fr'

export function HabitsSettingsScreen() {
  return (
    <SettingsPage title={t.settings.sections.habits.title} backTo="/settings">
      <HabitManagerCard />
    </SettingsPage>
  )
}
