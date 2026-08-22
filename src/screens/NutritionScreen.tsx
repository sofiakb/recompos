import { Salad } from 'lucide-react'
import { ScreenHeader } from '@/components/shared/ScreenHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { t } from '@/i18n/fr'

export function NutritionScreen() {
  return (
    <>
      <ScreenHeader title={t.nav.nutrition} />
      <EmptyState Icon={Salad} title={t.empty.nutrition} hint={t.empty.nutritionHint} />
    </>
  )
}
