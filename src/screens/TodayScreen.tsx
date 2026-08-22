import { useState } from 'react'
import { Dumbbell, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScreenHeader } from '@/components/shared/ScreenHeader'
import { ConsistencyStrip } from '@/features/floor/ConsistencyStrip'
import { FloorCard } from '@/features/floor/FloorCard'
import { useFloor } from '@/features/floor/useFloor'
import { ProteinCard } from '@/features/nutrition/ProteinCard'
import { ProteinPortionSheet } from '@/features/nutrition/ProteinPortionSheet'
import { useProtein } from '@/features/nutrition/useProtein'
import { useProteinTarget } from '@/features/nutrition/useProteinTarget'
import { WeightSheet } from '@/features/weight/WeightSheet'
import { useWeight } from '@/features/weight/useWeight'
import { useUiStore } from '@/stores/uiStore'
import { formatLongDate } from '@/lib/date'
import { t } from '@/i18n/fr'
import type { FloorHabitDefinition, ZeroCookItem } from '@/types/models'

export function TodayScreen() {
  const floor = useFloor()
  const protein = useProtein()
  const target = useProteinTarget()
  const weight = useWeight()
  const showToast = useUiStore((state) => state.showToast)

  // The habit waiting for its portion to be picked, if any.
  const [portionHabit, setPortionHabit] = useState<FloorHabitDefinition | null>(null)
  const [weighInOpen, setWeighInOpen] = useState(false)

  const onToggle = async (habit: FloorHabitDefinition) => {
    const outcome = await floor.toggle(habit)
    if (outcome === 'needs_portion') setPortionHabit(habit)
  }

  const onCompleteAll = async () => {
    const pending = await floor.completeFloor()
    if (pending.length > 0) setPortionHabit(pending[0])
  }

  const onPickPortion = async (item: ZeroCookItem) => {
    if (!portionHabit) return
    await floor.completeWithPortion(portionHabit, item)
    setPortionHabit(null)
    showToast(t.nutrition.addedGrams(item.proteinPerServingGrams))
  }

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
          onToggle={onToggle}
          onCompleteAll={onCompleteAll}
          allDone={floor.floorCompleted}
          doneLabel={t.today.floorDone}
          doneHint={t.today.floorDoneHint}
        />

        <ConsistencyStrip score7={floor.score7} score30={floor.score30} />

        <ProteinCard protein={protein} target={target} />

        {weight.isDue ? (
          <Card>
            <CardHeader>
              <CardTitle>{t.today.weighInDue}</CardTitle>
              <CardDescription>{t.today.weighInDueHint}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" block onClick={() => setWeighInOpen(true)}>
                <Scale size={18} aria-hidden />
                {t.weight.logCta}
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <FloorCard
          title={t.today.stackTitle}
          description={t.today.stackSubtitle}
          habits={floor.stackHabits}
          completedIds={floor.completedIds}
          onToggle={onToggle}
        />

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

      <ProteinPortionSheet
        open={portionHabit !== null}
        onClose={() => setPortionHabit(null)}
        onPick={onPickPortion}
      />
      <WeightSheet
        open={weighInOpen}
        initialKg={weight.latest?.weightKg ?? null}
        onClose={() => setWeighInOpen(false)}
        onSubmit={async (kg) => {
          await weight.log(kg)
          setWeighInOpen(false)
          showToast(t.weight.saved(kg))
        }}
      />
    </>
  )
}
