import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExercisePickerSheet } from '@/features/workouts/ExercisePickerSheet'
import { RestTimerSetting } from '@/features/workouts/RestTimerSetting'
import { useWorkouts } from '@/features/workouts/useWorkouts'
import { SubPage } from '@/components/shared/SubPage'
import { t } from '@/i18n/fr'

export function WorkoutsSettingsScreen() {
  const workouts = useWorkouts()
  const [catalogueOpen, setCatalogueOpen] = useState(false)

  return (
    <SubPage title={t.settings.sections.workouts.title} backTo="/settings">
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.restTimer}</CardTitle>
        </CardHeader>
        <CardContent>
          <RestTimerSetting />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <button
            type="button"
            onClick={() => setCatalogueOpen(true)}
            className="flex min-h-touch w-full items-center gap-3 rounded-lg text-left transition-colors hover:bg-accent"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-base font-medium">{t.settings.exercises}</span>
              <span className="block text-xs text-muted-foreground">
                {t.settings.exercisesHint}
              </span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-muted-foreground" aria-hidden />
          </button>
        </CardContent>
      </Card>

      {/* No onPick: the catalogue is opened here to edit it, not to choose from it. */}
      <ExercisePickerSheet
        open={catalogueOpen}
        exercises={workouts.exercises}
        title={t.settings.exercises}
        onClose={() => setCatalogueOpen(false)}
      />
    </SubPage>
  )
}
