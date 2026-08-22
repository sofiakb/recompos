import { useEffect, useMemo, useState } from 'react'
import { CirclePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScreenHeader } from '@/components/shared/ScreenHeader'
import { CircuitCard } from '@/features/workouts/CircuitCard'
import { ExercisePickerSheet } from '@/features/workouts/ExercisePickerSheet'
import { RestTimer } from '@/features/workouts/RestTimer'
import { SetList } from '@/features/workouts/SetList'
import { SetLoggerSheet, type SetDraft } from '@/features/workouts/SetLoggerSheet'
import { useRestTimer } from '@/features/workouts/useRestTimer'
import { useWorkouts } from '@/features/workouts/useWorkouts'
import { CIRCUIT_BLOCKS } from '@/db/seed'
import { useUiStore } from '@/stores/uiStore'
import { formatLongDate } from '@/lib/date'
import { t } from '@/i18n/fr'
import type { MovementPattern } from '@/types/models'

type BlockSelection = Record<MovementPattern, string>

function defaultBlocks(): BlockSelection {
  const selection = {} as BlockSelection
  for (const block of CIRCUIT_BLOCKS) selection[block.pattern] = block.defaultExerciseId
  return selection
}

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

  return (
    <>
      <ScreenHeader title={t.nav.workouts} subtitle={formatLongDate(workouts.today)} />

      <RestTimer timer={timer} />

      <div className="flex flex-col gap-3 px-4">
        <CircuitCard
          session={workouts.session}
          sessionSets={workouts.sessionSets}
          blockExerciseIds={blocks}
          exerciseById={workouts.exerciseById}
          onStart={() => workouts.start('20min_circuit')}
          onEnd={onEndSession}
          onLog={setLoggingExerciseId}
          onChangeExercise={setPickerPattern}
        />

        <Card>
          <CardHeader>
            <CardTitle>{t.workouts.microSets}</CardTitle>
            <CardDescription>{t.workouts.microSetsHint}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" block onClick={() => setFreePickerOpen(true)}>
              <CirclePlus size={18} aria-hidden />
              {t.workouts.logSet}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.workouts.setsToday}</CardTitle>
          </CardHeader>
          <CardContent>
            <SetList
              sets={workouts.todaySets}
              exerciseById={workouts.exerciseById}
              onRemove={workouts.remove}
            />
          </CardContent>
        </Card>

        <Card className="mb-2">
          <CardHeader>
            <CardTitle>{t.workouts.history}</CardTitle>
          </CardHeader>
          <CardContent>
            {workouts.history.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.workouts.noHistory}</p>
            ) : (
              <ul className="flex flex-col">
                {workouts.history.map((session) => (
                  <li
                    key={session.id}
                    className="flex items-center justify-between gap-3 border-b border-border/60 py-2 text-sm last:border-0"
                  >
                    <span className="min-w-0 flex-1 truncate text-muted-foreground">
                      {formatLongDate(session.date)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.workouts.sessionType[session.type]}
                    </span>
                    <span className="tnum font-medium">{session.durationMinutes ?? 0} min</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

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
