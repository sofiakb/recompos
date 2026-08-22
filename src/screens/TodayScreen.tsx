import { Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScreenHeader } from '@/components/shared/ScreenHeader'
import { ConsistencyStrip } from '@/features/floor/ConsistencyStrip'
import { FloorCard } from '@/features/floor/FloorCard'
import { useFloor } from '@/features/floor/useFloor'
import { useSettingsStore } from '@/stores/settingsStore'
import { useUiStore } from '@/stores/uiStore'
import { formatLongDate } from '@/lib/date'
import { t } from '@/i18n/fr'

export function TodayScreen() {
  const floor = useFloor()
  const proteinTarget = useSettingsStore((state) => state.settings.proteinTargetGrams)
  const showToast = useUiStore((state) => state.showToast)

  // Lot 2 replaces this with the live daily aggregate.
  const proteinToday = 0

  return (
    <>
      <ScreenHeader
        title={t.today.dayMilestone(floor.dayNumber)}
        subtitle={formatLongDate(floor.today)}
        showSettings
      />

      <div className="flex flex-col gap-3 px-4">
        <FloorCard
          title={t.today.floorTitle}
          description={t.today.floorSubtitle}
          habits={floor.floorHabits}
          completedIds={floor.completedIds}
          onToggle={floor.toggle}
          onCompleteAll={floor.completeFloor}
          allDone={floor.floorCompleted}
          doneLabel={t.today.floorDone}
          doneHint={t.today.floorDoneHint}
        />

        <ConsistencyStrip score7={floor.score7} score30={floor.score30} />

        <FloorCard
          title={t.today.stackTitle}
          description={t.today.stackSubtitle}
          habits={floor.stackHabits}
          completedIds={floor.completedIds}
          onToggle={floor.toggle}
        />

        <Card>
          <CardHeader>
            <CardTitle>{t.today.proteinTitle}</CardTitle>
            <span className="tnum text-sm text-muted-foreground">
              {t.today.proteinOf(proteinToday, proteinTarget)}
            </span>
          </CardHeader>
          <CardContent>
            <Progress
              value={proteinToday}
              max={proteinTarget}
              label={t.today.proteinTitle}
              className="h-2.5"
            />
            <p className="mt-2 text-xs text-muted-foreground">{t.today.comingInLot}</p>
          </CardContent>
        </Card>

        <Button
          size="lg"
          variant="secondary"
          block
          onClick={() => showToast(t.today.comingInLot)}
          className="mb-2"
        >
          <Dumbbell size={20} aria-hidden />
          {t.today.startWorkout}
        </Button>
      </div>
    </>
  )
}
