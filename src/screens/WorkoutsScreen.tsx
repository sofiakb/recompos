import { Dumbbell } from 'lucide-react'
import { ScreenHeader } from '@/components/shared/ScreenHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { t } from '@/i18n/fr'

export function WorkoutsScreen() {
  return (
    <>
      <ScreenHeader title={t.nav.workouts} />
      <EmptyState Icon={Dumbbell} title={t.empty.workouts} hint={t.empty.workoutsHint} />
    </>
  )
}
