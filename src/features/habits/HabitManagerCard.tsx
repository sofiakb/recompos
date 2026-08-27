import { useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { HabitEditorSheet, type HabitDraft } from '@/features/habits/HabitEditorSheet'
import { HabitRow } from '@/features/habits/HabitRow'
import { selectArchivedHabits, selectHabits, useSettingsStore } from '@/stores/settingsStore'
import { useUiStore } from '@/stores/uiStore'
import { t } from '@/i18n/fr'
import type { FloorHabitDefinition, HabitKind } from '@/types/models'

/** Create, rename, reorder and archive the floor and stacked habits (PRD §6.1). */
export function HabitManagerCard() {
  const habits = useSettingsStore((state) => state.habits)
  const addHabit = useSettingsStore((state) => state.addHabit)
  const updateHabit = useSettingsStore((state) => state.updateHabit)
  const archiveHabit = useSettingsStore((state) => state.archiveHabit)
  const restoreHabit = useSettingsStore((state) => state.restoreHabit)
  const installedOn = useSettingsStore((state) => state.installedOnDate())
  const showToast = useUiStore((state) => state.showToast)

  const [editing, setEditing] = useState<FloorHabitDefinition | null>(null)
  const [editorKind, setEditorKind] = useState<HabitKind>('floor')
  const [editorOpen, setEditorOpen] = useState(false)

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

  const editingIsArchived = editing !== null && Boolean(editing.archivedAt)
  // The floor cannot go empty, or no day could ever be validated again.
  const lastFloorHabit = editing !== null && editing.kind === 'floor' && floor.length === 1

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
              onEdit={() => openEdit(habit)}
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
        {/* No header: the sub-page already carries the title, and the rubric row
            that opened it already carried the count. */}
        <CardContent className="flex flex-col gap-5 pt-4">
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
                    className="flex items-center gap-1 border-b border-border/60 py-2 last:border-0"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                      {habit.title}
                    </span>
                    {/* One target here too: the sheet holds both its history and
                        the way back out of the archive. */}
                    <button
                      type="button"
                      aria-label={t.habits.edit(habit.title)}
                      onClick={() => openEdit(habit)}
                      className="flex h-touch w-touch shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Pencil size={18} aria-hidden />
                    </button>
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
        installedOn={installedOn}
        onClose={() => setEditorOpen(false)}
        onSubmit={onSubmit}
        onArchive={
          editing && !editingIsArchived
            ? () => {
                archiveHabit(editing.id)
                showToast(t.habits.archived(editing.title))
                setEditorOpen(false)
              }
            : undefined
        }
        onRestore={
          editing && editingIsArchived
            ? () => {
                restoreHabit(editing.id)
                showToast(t.habits.restored(editing.title))
                setEditorOpen(false)
              }
            : undefined
        }
        archiveBlockedReason={lastFloorHabit ? t.habits.lastFloorWarning : undefined}
      />
    </>
  )
}
