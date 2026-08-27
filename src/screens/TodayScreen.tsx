import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScreenHeader } from '@/components/shared/ScreenHeader'
import { useFloor } from '@/features/floor/useFloor'
import { FloorChecklist } from '@/features/today/FloorChecklist'
import { FloorCounter } from '@/features/today/FloorCounter'
import { NowCard } from '@/features/today/NowCard'
import { StackChips } from '@/features/today/StackChips'
import { SummaryRow } from '@/features/today/SummaryRow'
import { canPostpone, nextFloorHabit, pendingHabits } from '@/features/today/queue'
import { ProteinPortionSheet } from '@/features/nutrition/ProteinPortionSheet'
import { useProtein } from '@/features/nutrition/useProtein'
import { useWorkouts } from '@/features/workouts/useWorkouts'
import { useUiStore } from '@/stores/uiStore'
import { formatLongDate } from '@/lib/date'
import { t } from '@/i18n/fr'
import type { FloorHabitDefinition, ZeroCookItem } from '@/types/models'

/**
 * Answers, in this order: what is left to do, where the protein stands, how
 * consistent the last week was.
 *
 * Everything else it used to carry — the weigh-in card, the two consistency
 * scores, the protein log — now lives on the screen that owns it. What is left
 * here is a read and a link (handoff de refonte, décision n°18).
 */
export function TodayScreen() {
  const floor = useFloor()
  const protein = useProtein()
  const workouts = useWorkouts()
  const navigate = useNavigate()
  const showToast = useUiStore((state) => state.showToast)

  // The habit waiting for its portion to be picked, if any.
  const [portionHabit, setPortionHabit] = useState<FloorHabitDefinition | null>(null)
  // Purely local, and deliberately not persisted: postponing writes nothing,
  // and a new day should start with a clean queue.
  const [postponedIds, setPostponedIds] = useState<Set<string>>(new Set())

  const pending = useMemo(
    () => pendingHabits(floor.floorHabits, floor.completedIds),
    [floor.floorHabits, floor.completedIds],
  )
  const nextHabit = nextFloorHabit(floor.floorHabits, floor.completedIds, postponedIds)
  const doneCount = floor.floorHabits.length - pending.length

  const onStartWorkout = async () => {
    // Starting from here means landing on the workouts tab with the clock
    // already running, not on a screen asking to start again.
    if (!workouts.session) await workouts.start('20min_circuit')
    navigate('/workouts')
  }

  const onToggle = async (habit: FloorHabitDefinition) => {
    const outcome = await floor.toggle(habit)
    if (outcome === 'needs_portion') setPortionHabit(habit)
  }

  const onLater = () => {
    if (!nextHabit) return
    setPostponedIds((current) => {
      const next = new Set(current)
      next.add(nextHabit.id)
      return next
    })
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
        eyebrow={formatLongDate(floor.today)}
        title={t.today.dayMilestone(floor.dayNumber)}
        showSettings
      />

      <div className="flex flex-col gap-7 px-5 pt-2">
        <FloorCounter
          done={doneCount}
          total={floor.floorHabits.length}
          states={floor.floorHabits.map((habit) => floor.completedIds.has(habit.id))}
        />

        <NowCard
          habit={nextHabit}
          onDone={() => {
            if (nextHabit) void onToggle(nextHabit)
          }}
          onLater={canPostpone(floor.floorHabits, floor.completedIds) ? onLater : undefined}
        />

        <FloorChecklist
          habits={floor.floorHabits}
          completedIds={floor.completedIds}
          onToggle={(habit) => void onToggle(habit)}
        />

        <StackChips
          habits={floor.stackHabits}
          completedIds={floor.completedIds}
          onToggle={(habit) => void onToggle(habit)}
        />

        <section className="flex flex-col">
          <SummaryRow
            to="/nutrition"
            label={t.today.proteinTitle}
            value={String(protein.totalGrams)}
            valueSuffix={` / ${protein.targetGrams} g`}
            progress={{ value: protein.totalGrams, max: protein.targetGrams }}
          />
          <SummaryRow
            to="/trends"
            label={t.today.consistencyTitle}
            value={t.today.consistencySummary(floor.score7.percent)}
          />
        </section>

        <Button size="lg" variant="secondary" block onClick={() => void onStartWorkout()}>
          <Dumbbell size={20} aria-hidden />
          {workouts.session ? t.today.resumeWorkout : t.today.startCircuitLong}
        </Button>
      </div>

      <ProteinPortionSheet
        open={portionHabit !== null}
        onClose={() => setPortionHabit(null)}
        onPick={onPickPortion}
      />
    </>
  )
}
