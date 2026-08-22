import { useLocation, useNavigate } from 'react-router-dom'
import { Check, CirclePlus, Dumbbell, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { useUiStore } from '@/stores/uiStore'
import { useFloor } from '@/features/floor/useFloor'
import { t } from '@/i18n/fr'

/**
 * The three-taps-max guarantee (PRD §3.1): a core action is reachable from any
 * tab without navigating first.
 *
 * Lot 0 wires the floor action end to end; protein and sets land with their own
 * modules, and route to their tab in the meantime rather than pretending to work.
 */
export function QuickActionFab() {
  const open = useUiStore((state) => state.quickActionOpen)
  const setOpen = useUiStore((state) => state.setQuickActionOpen)
  const showToast = useUiStore((state) => state.showToast)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { completeFloor, floorCompleted } = useFloor()

  const onValidateFloor = async () => {
    await completeFloor()
    setOpen(false)
    showToast(t.today.floorDone)
  }

  const later = (to: string) => {
    setOpen(false)
    showToast(t.today.comingInLot)
    navigate(to)
  }

  // Settings is a place to configure, not to log: no quick action there.
  if (pathname.startsWith('/settings')) return null

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
            onClick={() => later('/nutrition')}
          >
            <CirclePlus size={20} aria-hidden />
            {t.quickAction.addProtein}
          </Button>
          <Button
            size="lg"
            block
            variant="secondary"
            className="justify-start"
            onClick={() => later('/workouts')}
          >
            <Dumbbell size={20} aria-hidden />
            {t.quickAction.addSet}
          </Button>
        </div>
      </Sheet>
    </>
  )
}
