import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalorieTargetEditor } from '@/features/meals/CalorieTargetEditor'
import { ProteinTargetEditor } from '@/features/nutrition/ProteinTargetEditor'
import { useProteinTarget } from '@/features/nutrition/useProteinTarget'
import { SubPage } from '@/components/shared/SubPage'
import { t } from '@/i18n/fr'

/** Protein, calories and the body profile they are computed from. */
export function GoalsSettingsScreen() {
  const target = useProteinTarget()

  return (
    <SubPage title={t.settings.sections.goals.title} backTo="/settings">
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.proteinTarget}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProteinTargetEditor target={target} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.meals.targetTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <CalorieTargetEditor />
        </CardContent>
      </Card>
    </SubPage>
  )
}
