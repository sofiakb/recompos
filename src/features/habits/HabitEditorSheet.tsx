import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Segmented } from '@/components/ui/segmented'
import { Sheet } from '@/components/ui/sheet'
import { ConsistencyHeatmap } from '@/features/floor/ConsistencyHeatmap'
import { habitHistory } from '@/db/repositories/habitRepository'
import { DAYS_PER_WEEK, HEATMAP_WEEKS } from '@/lib/heatmap'
import { formatLongDate, toLogicalDate } from '@/lib/date'
import { t } from '@/i18n/fr'
import type {
  FloorHabitDefinition,
  HabitCategory,
  HabitCompletionMode,
  HabitKind,
} from '@/types/models'

export type HabitDraft = Pick<
  FloorHabitDefinition,
  'title' | 'triggerAnchor' | 'targetRepsOrAction' | 'category' | 'kind' | 'completionMode'
>

interface HabitEditorSheetProps {
  open: boolean
  /** null creates a new habit, a definition edits it. */
  habit: FloorHabitDefinition | null
  defaultKind: HabitKind
  /** First day the app could have recorded anything, for the history grid. */
  installedOn: string
  onClose: () => void
  onSubmit: (draft: HabitDraft) => void
  /** Absent while creating, and on a habit that is already archived. */
  onArchive?: () => void
  /** Present only on an archived habit. */
  onRestore?: () => void
  /**
   * Set when this is the last habit of the floor. Archiving it would leave no
   * habit to validate, so no day could ever be complete again.
   */
  archiveBlockedReason?: string
}

const HISTORY_WINDOW_DAYS = HEATMAP_WEEKS * DAYS_PER_WEEK

const KIND_OPTIONS = [
  { value: 'floor' as const, label: t.habits.kind.floor },
  { value: 'stack' as const, label: t.habits.kind.stack },
]

const CATEGORY_OPTIONS = [
  { value: 'workout' as const, label: t.habits.category.workout },
  { value: 'nutrition' as const, label: t.habits.category.nutrition },
  { value: 'mobility' as const, label: t.habits.category.mobility },
]

const MODE_OPTIONS = [
  { value: 'toggle' as const, label: t.habits.modeToggle },
  { value: 'protein_portion' as const, label: t.habits.modePortion },
]

function emptyDraft(kind: HabitKind): HabitDraft {
  return {
    title: '',
    triggerAnchor: '',
    targetRepsOrAction: '',
    category: 'workout',
    kind,
    completionMode: 'toggle',
  }
}

export function HabitEditorSheet({
  open,
  habit,
  defaultKind,
  installedOn,
  onClose,
  onSubmit,
  onArchive,
  onRestore,
  archiveBlockedReason,
}: HabitEditorSheetProps) {
  const [draft, setDraft] = useState<HabitDraft>(() => emptyDraft(defaultKind))
  const today = toLogicalDate()
  const habitId = open && habit ? habit.id : null
  const history = useLiveQuery(
    () => (habitId ? habitHistory(habitId, HISTORY_WINDOW_DAYS, today) : Promise.resolve(null)),
    [habitId, today],
    null,
  )

  useEffect(() => {
    if (!open) return
    setDraft(
      habit
        ? {
            title: habit.title,
            triggerAnchor: habit.triggerAnchor ?? '',
            targetRepsOrAction: habit.targetRepsOrAction,
            category: habit.category,
            kind: habit.kind,
            completionMode: habit.completionMode,
          }
        : emptyDraft(defaultKind),
    )
  }, [open, habit, defaultKind])

  const patch = (values: Partial<HabitDraft>) => setDraft((current) => ({ ...current, ...values }))
  const title = draft.title.trim()
  const isValid = title.length > 0

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={habit ? t.habits.editTitle : t.habits.newTitle}
      className="max-h-[88vh] overflow-y-auto"
    >
      <div className="flex flex-col gap-4">
        <Field label={t.habits.fieldTitle}>
          {(id) => (
            <Input
              id={id}
              autoFocus
              value={draft.title}
              placeholder={t.habits.fieldTitlePlaceholder}
              onChange={(event) => patch({ title: event.target.value })}
            />
          )}
        </Field>

        <Field label={t.habits.fieldAction}>
          {(id) => (
            <Input
              id={id}
              value={draft.targetRepsOrAction}
              placeholder={t.habits.fieldActionPlaceholder}
              onChange={(event) => patch({ targetRepsOrAction: event.target.value })}
            />
          )}
        </Field>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">{t.habits.fieldKind}</span>
          <Segmented
            label={t.habits.fieldKind}
            value={draft.kind}
            options={KIND_OPTIONS}
            onChange={(kind) => patch({ kind })}
          />
        </div>

        {draft.kind === 'stack' ? (
          <Field label={t.habits.fieldAnchor} hint={t.habits.fieldAnchorHint}>
            {(id) => (
              <Input
                id={id}
                value={draft.triggerAnchor ?? ''}
                placeholder={t.habits.fieldAnchorPlaceholder}
                onChange={(event) => patch({ triggerAnchor: event.target.value })}
              />
            )}
          </Field>
        ) : null}

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">{t.habits.fieldCategory}</span>
          <Segmented
            label={t.habits.fieldCategory}
            value={draft.category}
            options={CATEGORY_OPTIONS}
            onChange={(category: HabitCategory) => patch({ category })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">{t.habits.fieldMode}</span>
          <Segmented
            label={t.habits.fieldMode}
            value={draft.completionMode}
            options={MODE_OPTIONS}
            onChange={(completionMode: HabitCompletionMode) => patch({ completionMode })}
          />
          {draft.completionMode === 'protein_portion' ? (
            <p className="text-xs text-muted-foreground">{t.habits.modePortionHint}</p>
          ) : null}
        </div>

        {habit ? (
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">{t.habits.history}</h3>
              <p className="text-sm text-muted-foreground">
                {history && history.total > 0
                  ? t.habits.historyTotal(history.total)
                  : t.habits.historyNever}
              </p>
              {history?.firstDate ? (
                <p className="text-xs text-muted-foreground">
                  {t.habits.historySince(formatLongDate(history.firstDate))}
                </p>
              ) : null}
            </div>
            <ConsistencyHeatmap
              completedDates={history?.dates ?? new Set<string>()}
              installedOn={installedOn}
              today={today}
            />

            {onRestore ? (
              <Button variant="outline" block onClick={onRestore}>
                {t.habits.restoreThis}
              </Button>
            ) : onArchive ? (
              <>
                <Button
                  variant="outline"
                  block
                  disabled={Boolean(archiveBlockedReason)}
                  onClick={onArchive}
                >
                  {t.habits.archiveThis}
                </Button>
                {archiveBlockedReason ? (
                  <p className="text-xs text-muted-foreground">{archiveBlockedReason}</p>
                ) : null}
              </>
            ) : null}
          </div>
        ) : null}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button
            className="flex-1"
            disabled={!isValid}
            onClick={() => {
              if (!isValid) return
              const anchor = draft.triggerAnchor?.trim()
              onSubmit({
                ...draft,
                title,
                // An empty action reads better as the title repeated than as a blank line.
                targetRepsOrAction: draft.targetRepsOrAction.trim() || title,
                triggerAnchor: draft.kind === 'stack' && anchor ? anchor : undefined,
              })
            }}
          >
            {t.common.save}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
