import { useState } from 'react'
import { ArchiveRestore, ChevronDown, ChevronUp, History, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HabitEditorSheet, type HabitDraft } from '@/features/habits/HabitEditorSheet'
import { HabitHistorySheet } from '@/features/habits/HabitHistorySheet'
import { selectArchivedHabits, selectHabits, useSettingsStore } from '@/stores/settingsStore'
import { useUiStore } from '@/stores/uiStore'
import { t } from '@/i18n/fr'
import type { FloorHabitDefinition, HabitKind } from '@/types/models'

interface RowProps {
  habit: FloorHabitDefinition
  index: number
  count: number
  /** The floor cannot go empty, or no day could ever be validated again. */
  lockedFromArchiving: boolean
  onEdit: () => void
  onHistory: () => void
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function HabitRow({ habit, index, count, lockedFromArchiving, onEdit, onHistory }: RowProps) {
  const moveHabit = useSettingsStore((state) => state.moveHabit)
  const archiveHabit = useSettingsStore((state) => state.archiveHabit)
  const showToast = useUiStore((state) => state.showToast)

  return (
    <li className="flex items-center gap-1 border-b border-border/60 py-2 last:border-0">
      <div className="flex flex-col">
        <IconButton
          label={t.habits.moveUp}
          disabled={index === 0}
          onClick={() => moveHabit(habit.id, -1)}
        >
          <ChevronUp size={16} aria-hidden />
        </IconButton>
        <IconButton
          label={t.habits.moveDown}
          disabled={index === count - 1}
          onClick={() => moveHabit(habit.id, 1)}
        >
          <ChevronDown size={16} aria-hidden />
        </IconButton>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{habit.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {habit.triggerAnchor ? `${habit.triggerAnchor} — ` : ''}
          {habit.targetRepsOrAction}
        </p>
      </div>

      <IconButton label={t.habits.history} onClick={onHistory}>
        <History size={16} aria-hidden />
      </IconButton>
      <IconButton label={t.habits.edit(habit.title)} onClick={onEdit}>
        <Pencil size={16} aria-hidden />
      </IconButton>
      <IconButton
        label={t.habits.archive}
        disabled={lockedFromArchiving}
        onClick={() => {
          archiveHabit(habit.id)
          showToast(t.habits.archived(habit.title))
        }}
      >
        <Trash2 size={16} aria-hidden />
      </IconButton>
    </li>
  )
}

/** Create, rename, reorder and archive the floor and stacked habits (PRD §6.1). */
export function HabitManagerCard() {
  const habits = useSettingsStore((state) => state.habits)
  const addHabit = useSettingsStore((state) => state.addHabit)
  const updateHabit = useSettingsStore((state) => state.updateHabit)
  const restoreHabit = useSettingsStore((state) => state.restoreHabit)
  const installedOn = useSettingsStore((state) => state.installedOnDate())
  const showToast = useUiStore((state) => state.showToast)

  const [editing, setEditing] = useState<FloorHabitDefinition | null>(null)
  const [editorKind, setEditorKind] = useState<HabitKind>('floor')
  const [editorOpen, setEditorOpen] = useState(false)
  const [historyHabit, setHistoryHabit] = useState<FloorHabitDefinition | null>(null)

  const floor = selectHabits(habits, 'floor')
  const stack = selectHabits(habits, 'stack')
  const archived = selectArchivedHabits(habits)

  const openNew = (kind: HabitKind) => {
    setEditing(null)
    setEditorKind(kind)
    setEditorOpen(true)
  }

  const openEdit = (habit: FloorHabitDefinition) => {
    setEditing(habit)
    setEditorKind(habit.kind)
    setEditorOpen(true)
  }

  const onSubmit = (draft: HabitDraft) => {
    if (editing) {
      updateHabit(editing.id, draft)
      showToast(t.habits.updated)
    } else {
      addHabit(draft)
      showToast(t.habits.created)
    }
    setEditorOpen(false)
  }

  const renderGroup = (
    title: string,
    hint: string,
    group: FloorHabitDefinition[],
    kind: HabitKind,
    addLabel: string,
  ) => (
    <section className="flex flex-col gap-1">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground">{hint}</p>
      {group.length > 0 ? (
        <ul className="flex flex-col">
          {group.map((habit, index) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              index={index}
              count={group.length}
              lockedFromArchiving={kind === 'floor' && group.length === 1}
              onEdit={() => openEdit(habit)}
              onHistory={() => setHistoryHabit(habit)}
            />
          ))}
        </ul>
      ) : (
        <p className="py-2 text-sm text-muted-foreground">{t.habits.empty}</p>
      )}
      {kind === 'floor' && group.length === 1 ? (
        <p className="text-xs text-muted-foreground">{t.habits.lastFloorWarning}</p>
      ) : null}
      <Button variant="outline" className="mt-1 self-start" onClick={() => openNew(kind)}>
        <Plus size={16} aria-hidden />
        {addLabel}
      </Button>
    </section>
  )

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t.habits.title}</CardTitle>
          <CardDescription>{t.settings.habitsCount(floor.length, stack.length)}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {renderGroup(
            t.habits.floorGroup,
            t.habits.floorGroupHint,
            floor,
            'floor',
            t.habits.addToFloor,
          )}
          {renderGroup(
            t.habits.stackGroup,
            t.habits.stackGroupHint,
            stack,
            'stack',
            t.habits.addToStack,
          )}

          {archived.length > 0 ? (
            <section className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">{t.habits.archivedGroup}</h3>
              <p className="text-xs text-muted-foreground">{t.habits.archivedHint}</p>
              <ul className="flex flex-col">
                {archived.map((habit) => (
                  <li
                    key={habit.id}
                    className="flex items-center gap-2 border-b border-border/60 py-2 last:border-0"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                      {habit.title}
                    </span>
                    <IconButton label={t.habits.history} onClick={() => setHistoryHabit(habit)}>
                      <History size={16} aria-hidden />
                    </IconButton>
                    <IconButton
                      label={t.habits.restore}
                      onClick={() => {
                        restoreHabit(habit.id)
                        showToast(t.habits.restored(habit.title))
                      }}
                    >
                      <ArchiveRestore size={16} aria-hidden />
                    </IconButton>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </CardContent>
      </Card>

      <HabitEditorSheet
        open={editorOpen}
        habit={editing}
        defaultKind={editorKind}
        onClose={() => setEditorOpen(false)}
        onSubmit={onSubmit}
      />
      <HabitHistorySheet
        habit={historyHabit}
        installedOn={installedOn}
        onClose={() => setHistoryHabit(null)}
      />
    </>
  )
}
