import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, CirclePlus, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScreenHeader } from '@/components/shared/ScreenHeader'
import { CircuitPlan } from '@/features/workouts/CircuitPlan'
import { ExercisePickerSheet } from '@/features/workouts/ExercisePickerSheet'
import { RestTimer } from '@/features/workouts/RestTimer'
import { SessionBlocks } from '@/features/workouts/SessionBlocks'
import { SetList } from '@/features/workouts/SetList'
import { SetLoggerSheet, type SetDraft } from '@/features/workouts/SetLoggerSheet'
import { useClock } from '@/features/workouts/useClock'
import { useRestTimer } from '@/features/workouts/useRestTimer'
import { useWorkouts } from '@/features/workouts/useWorkouts'
import { CIRCUIT_BLOCKS } from '@/db/seed'
import { useUiStore } from '@/stores/uiStore'
import { elapsedSeconds, formatDuration } from '@/lib/timer'
import { formatLongDate } from '@/lib/date'
import { t } from '@/i18n/fr'
import type { MovementPattern } from '@/types/models'

type BlockSelection = Record<MovementPattern, string>

function defaultBlocks(): BlockSelection {
  const selection = {} as BlockSelection
  for (const block of CIRCUIT_BLOCKS) selection[block.pattern] = block.defaultExerciseId
  return selection
}

/**
 * Two screens in one, split on whether a session is open.
 *
 * Out of session it answers « what would I do »; in session it answers « what
 * do I do next ». Showing both at once made the running clock compete with the
 * plan for the same space.
 */
export function WorkoutsScreen() {
  const workouts = useWorkouts()
  const timer = useRestTimer()
  const showToast = useUiStore((state) => state.showToast)
  const microSetRequested = useUiStore((state) => state.microSetRequested)
  const clearMicroSet = useUiStore((state) => state.clearMicroSet)

  const [blocks, setBlocks] = useState<BlockSelection>(defaultBlocks)
  const [loggingExerciseId, setLoggingExerciseId] = useState<string | null>(null)
  const [pickerPattern, setPickerPattern] = useState<MovementPattern | null>(null)
  const [freePickerOpen, setFreePickerOpen] = useState(false)

  // The clock only ticks while a session is open; idle screens do no work.
  const now = useClock(workouts.session !== null)
  const elapsed = workouts.session
    ? elapsedSeconds(new Date(workouts.session.startedAt).getTime(), now)
    : 0

  // Arriving from the quick action opens the movement list straight away.
  useEffect(() => {
    if (!microSetRequested) return
    clearMicroSet()
    setFreePickerOpen(true)
  }, [microSetRequested, clearMicroSet])

  const suggestion = useMemo(
    () => (loggingExerciseId ? workouts.suggestionFor(loggingExerciseId) : null),
    [loggingExerciseId, workouts],
  )
  // The suggestion may have moved on to a harder variant, so the sheet logs the
  // movement the suggestion names, not the one that was tapped.
  const loggingExercise = suggestion ? workouts.exerciseById(suggestion.exerciseId) : null
  const progressedFrom = suggestion?.progressedFromExerciseId
    ? workouts.exerciseById(suggestion.progressedFromExerciseId)
    : undefined

  const onSubmitSet = async (draft: SetDraft) => {
    const exercise = workouts.exerciseById(draft.exerciseId)
    await workouts.log(draft)
    setLoggingExerciseId(null)
    showToast(t.workouts.setSaved(draft.reps, exercise?.name ?? ''))
    // Resting is the default after a set; skipping it is one tap away.
    timer.start()
  }

  const onEndSession = async () => {
    const outcome = await workouts.end()
    showToast(
      outcome
        ? t.workouts.sessionEnded(outcome.durationMinutes, outcome.setCount)
        : t.workouts.sessionDiscarded,
    )
  }

  const sets = (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
        {t.workouts.setsToday}
      </h2>
      <SetList
        sets={workouts.todaySets}
        exerciseById={workouts.exerciseById}
        onRemove={workouts.remove}
      />
    </section>
  )

  const inSession = workouts.session !== null

  const body = inSession ? (
    <>
      <header className="flex items-start justify-between gap-4 px-5 pb-2 pt-[calc(1rem+env(safe-area-inset-top))]">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-primary">
            {t.workouts.sessionInProgress}
          </p>
          <p className="tnum text-[52px] font-semibold leading-none tracking-[-0.02em]">
            {formatDuration(elapsed)}
          </p>
        </div>
        <Button variant="outline" onClick={() => void onEndSession()}>
          <Square size={18} aria-hidden />
          {t.workouts.finish}
        </Button>
      </header>

      <div className="flex flex-col gap-6 px-5 pt-2">
        <RestTimer timer={timer} />

        <SessionBlocks
          sessionSets={workouts.sessionSets}
          blockExerciseIds={blocks}
          exerciseById={workouts.exerciseById}
          suggestionFor={workouts.suggestionFor}
          onLog={setLoggingExerciseId}
        />

        <p className="text-xs text-muted-foreground">{t.workouts.suggestionNote}</p>

        {sets}
      </div>
    </>
  ) : (
    <>
      <ScreenHeader eyebrow={formatLongDate(workouts.today)} title={t.nav.workouts} />

      <div className="flex flex-col gap-7 px-5 pt-2">
        <CircuitPlan
          blockExerciseIds={blocks}
          exerciseById={workouts.exerciseById}
          onStart={() => void workouts.start('20min_circuit')}
          onChangeExercise={setPickerPattern}
        />

        {/* Micro-sets lost their card: they are one action, and a card around a
            single button reads as a section with something in it. */}
        <Button size="lg" variant="outline" block onClick={() => setFreePickerOpen(true)}>
          <CirclePlus size={20} aria-hidden />
          {t.workouts.isolatedSet}
        </Button>

        {sets}

        {/* Past sessions live on Progression now — one home per piece of data. */}
        <Link
          to="/trends"
          className="flex min-h-touch items-center gap-3 border-b border-border py-2 transition-colors hover:bg-accent"
        >
          <span className="min-w-0 flex-1 text-[15px]">{t.workouts.pastAndStrength}</span>
          <ChevronRight size={18} className="shrink-0 text-muted-foreground" aria-hidden />
        </Link>
      </div>
    </>
  )

  return (
    <>
      {body}

      <SetLoggerSheet
        open={loggingExercise !== null}
        exercise={loggingExercise ?? null}
        suggestion={suggestion}
        lastSet={loggingExerciseId ? workouts.lastSetFor(loggingExerciseId) : null}
        progressedFromName={progressedFrom?.name}
        onClose={() => setLoggingExerciseId(null)}
        onSubmit={onSubmitSet}
      />

      <ExercisePickerSheet
        open={pickerPattern !== null}
        exercises={workouts.exercises}
        pattern={pickerPattern ?? undefined}
        selectedId={pickerPattern ? blocks[pickerPattern] : undefined}
        onClose={() => setPickerPattern(null)}
        onPick={(exercise) => {
          setBlocks((current) => ({ ...current, [exercise.pattern]: exercise.id }))
          setPickerPattern(null)
        }}
      />

      <ExercisePickerSheet
        open={freePickerOpen}
        exercises={workouts.exercises}
        onClose={() => setFreePickerOpen(false)}
        onPick={(exercise) => {
          setFreePickerOpen(false)
          setLoggingExerciseId(exercise.id)
        }}
      />
    </>
  )
}
