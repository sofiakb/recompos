import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MealPhotoRetention } from '@/features/meals/MealPhotoRetention'
import { VisionSettingsCard } from '@/features/vision/VisionSettingsCard'
import { SettingsPage } from '@/screens/settings/SettingsPage'
import { t } from '@/i18n/fr'

/**
 * Retention sits here, next to what produces the photos, rather than under the
 * meal settings it used to share a screen with (handoff de refonte).
 */
export function VisionSettingsScreen() {
  return (
    <SettingsPage title={t.settings.sections.vision.title} backTo="/settings">
      <VisionSettingsCard />

      <Card>
        <CardHeader>
          <CardTitle>{t.meals.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <MealPhotoRetention />
        </CardContent>
      </Card>
    </SettingsPage>
  )
}
