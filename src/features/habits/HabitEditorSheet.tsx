import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Segmented } from '@/components/ui/segmented'
import { Sheet } from '@/components/ui/sheet'
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
  onClose: () => void
  onSubmit: (draft: HabitDraft) => void
}

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
  onClose,
  onSubmit,
}: HabitEditorSheetProps) {
  const [draft, setDraft] = useState<HabitDraft>(() => emptyDraft(defaultKind))

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
