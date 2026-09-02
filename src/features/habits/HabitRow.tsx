import { useRef } from 'react'
import { ChevronsUpDown, Pencil } from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'
import { t } from '@/i18n/fr'
import type { FloorHabitDefinition } from '@/types/models'
import { TapTarget } from '@/components/ui/tap-target'

interface HabitRowProps {
  habit: FloorHabitDefinition
  index: number
  count: number
  onEdit: () => void
}

/**
 * A habit in the settings list.
 *
 * Two targets, both 48px: the handle on the left and the pencil on the right.
 * The row used to carry five 36px buttons across 390px of phone — under the
 * minimum the rest of the app respects, and the first thing the handoff de
 * refonte flagged. History and archiving moved into the editor sheet.
 */
export function HabitRow({ habit, index, count, onEdit }: HabitRowProps) {
  const moveHabit = useSettingsStore((state) => state.moveHabit)
  const rowRef = useRef<HTMLLIElement>(null)
  // Where the pointer sat when the last swap happened, and how far it must
  // travel for the next one. Null whenever no drag is in flight.
  const drag = useRef<{ y: number; height: number } | null>(null)

  const move = (direction: -1 | 1) => {
    if (direction === -1 && index === 0) return false
    if (direction === 1 && index === count - 1) return false
    moveHabit(habit.id, direction)
    return true
  }

  return (
    <li
      ref={rowRef}
      className="flex items-center gap-1 border-b border-border/60 py-2 last:border-0"
    >
      {/* The only plain button left in the app: `TapTarget` lays an invisible
          switch over its element for the iOS haptic, and that overlay would
          swallow the pointer events this handle is made of. */}
      <button
        type="button"
        aria-label={t.habits.reorder}
        title={t.habits.reorderHint}
        // touch-none: without it the browser claims the gesture and scrolls the
        // page instead of letting the drag through.
        className="flex h-touch w-touch shrink-0 touch-none items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onPointerDown={(event) => {
          drag.current = { y: event.clientY, height: rowRef.current?.offsetHeight ?? 56 }
          // Capture keeps the moves coming once the finger leaves the handle.
          // Optional: where it is missing the drag degrades to the handle's own
          // area rather than throwing on the very first touch.
          event.currentTarget.setPointerCapture?.(event.pointerId)
        }}
        onPointerMove={(event) => {
          const state = drag.current
          if (!state) return
          const travelled = event.clientY - state.y
          if (Math.abs(travelled) < state.height) return
          const direction = travelled > 0 ? 1 : -1
          // Only advance the anchor when something actually moved, or a drag
          // past the end of the list would bank up swaps that fire on the way
          // back.
          if (move(direction)) state.y += direction * state.height
        }}
        onPointerUp={(event) => {
          drag.current = null
          event.currentTarget.releasePointerCapture?.(event.pointerId)
        }}
        onPointerCancel={() => {
          drag.current = null
        }}
        onKeyDown={(event) => {
          // A drag-only handle is unreachable by keyboard and by assistive tech.
          if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
          event.preventDefault()
          move(event.key === 'ArrowUp' ? -1 : 1)
        }}
      >
        <ChevronsUpDown size={18} aria-hidden />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{habit.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {habit.triggerAnchor ? `${habit.triggerAnchor} — ` : ''}
          {habit.targetRepsOrAction}
        </p>
      </div>

      <TapTarget
        type="button"
        aria-label={t.habits.edit(habit.title)}
        onClick={onEdit}
        className="flex h-touch w-touch shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Pencil size={18} aria-hidden />
      </TapTarget>
    </li>
  )
}
