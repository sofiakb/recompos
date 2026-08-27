import { HabitManagerCard } from '@/features/habits/HabitManagerCard'
import { SubPage } from '@/components/shared/SubPage'
import { t } from '@/i18n/fr'

export function HabitsSettingsScreen() {
  return (
    <SubPage title={t.settings.sections.habits.title} backTo="/settings">
      <HabitManagerCard />
    </SubPage>
  )
}
