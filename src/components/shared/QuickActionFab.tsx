import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check, CirclePlus, Dumbbell, Plus, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { activeSession } from '@/db/repositories/workoutRepository'
import { useUiStore } from '@/stores/uiStore'
import { useFloor } from '@/features/floor/useFloor'
import { useProtein } from '@/features/nutrition/useProtein'
import { WeightSheet } from '@/features/weight/WeightSheet'
import { useWeight } from '@/features/weight/useWeight'
import { t } from '@/i18n/fr'

/**
 * The three-taps-max guarantee (PRD §3.1): a core action is reachable from any
 * tab without navigating first.
 *
 * The floor, the protein counter and the weigh-in act in place; logging a set
 * hands off to the workouts screen with its logger already open.
 */
export function QuickActionFab() {
  const open = useUiStore((state) => state.quickActionOpen)
  const setOpen = useUiStore((state) => state.setQuickActionOpen)
  const showToast = useUiStore((state) => state.showToast)
  const requestMicroSet = useUiStore((state) => state.requestMicroSet)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { completeFloor, floorCompleted } = useFloor()
  const protein = useProtein()
  const weight = useWeight()
  const [weighInOpen, setWeighInOpen] = useState(false)
  // Read directly rather than through useWorkouts: the FAB needs one boolean,
  // not the whole workouts state and its live queries.
  const session = useLiveQuery(() => activeSession(), [], null)

  const QUICK_PROTEIN_GRAMS = 30

  const onValidateFloor = async () => {
    const pending = await completeFloor()
    setOpen(false)
    // A portion-based floor habit still needs its source picked on Today.
    if (pending.length > 0) {
      navigate('/')
      showToast(t.nutrition.pickPortion)
      return
    }
    showToast(t.today.floorDone)
  }

  const onAddProtein = async () => {
    const log = await protein.add(QUICK_PROTEIN_GRAMS, 'meal')
    setOpen(false)
    showToast(t.nutrition.addedGrams(QUICK_PROTEIN_GRAMS), {
      label: t.nutrition.undo,
      run: () => protein.remove(log.id),
    })
  }

  const onAddSet = () => {
    // The workouts screen owns the movement list and the overload suggestion, so
    // the quick action asks it to open its logger rather than duplicating both.
    requestMicroSet()
    navigate('/workouts')
  }

  // A weigh-in is a single number: it is logged here rather than sent to Trends,
  // so the quick action stays one tap plus the keypad from any tab.
  const onLogWeight = async (kg: number) => {
    await weight.log(kg)
    setWeighInOpen(false)
    showToast(t.weight.saved(kg))
  }

  // Settings is a place to configure, not to log: no quick action there.
  if (pathname.startsWith('/settings')) return null
  // During a session the screen is already a set of primary actions; the FAB
  // would float a second « log a set » over the one that is right there.
  if (session) return null

  return (
    <>
      <button
        type="button"
        aria-label={t.quickAction.open}
        onClick={() => setOpen(true)}
        className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95"
      >
        <Plus size={26} aria-hidden />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title={t.quickAction.title}>
        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            block
            onClick={onValidateFloor}
            disabled={floorCompleted}
            className="justify-start"
          >
            <Check size={20} aria-hidden />
            {floorCompleted ? t.today.floorDone : t.quickAction.validateFloor}
          </Button>
          <Button
            size="lg"
            block
            variant="secondary"
            className="justify-start"
            onClick={onAddProtein}
          >
            <CirclePlus size={20} aria-hidden />
            {t.quickAction.addProtein}
          </Button>
          <Button size="lg" block variant="secondary" className="justify-start" onClick={onAddSet}>
            <Dumbbell size={20} aria-hidden />
            {t.quickAction.addSet}
          </Button>
          <Button
            size="lg"
            block
            variant="secondary"
            className="justify-start"
            onClick={() => {
              setOpen(false)
              setWeighInOpen(true)
            }}
          >
            <Scale size={20} aria-hidden />
            {t.quickAction.logWeight}
          </Button>
        </div>
      </Sheet>

      <WeightSheet
        open={weighInOpen}
        initialKg={weight.latest?.weightKg ?? null}
        onClose={() => setWeighInOpen(false)}
        onSubmit={onLogWeight}
      />
    </>
  )
}
