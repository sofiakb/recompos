import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { t } from '@/i18n/fr'
import type { FloorHabitDefinition } from '@/types/models'

interface FloorChecklistProps {
  habits: FloorHabitDefinition[]
  completedIds: Set<string>
  onToggle: (habit: FloorHabitDefinition) => void
}

/**
 * The whole floor, always reachable under the hero card.
 *
 * Its job is to make a mistake reversible: the hero card only ever moves
 * forward, so unchecking has to live somewhere.
 */
export function FloorChecklist({ habits, completedIds, onToggle }: FloorChecklistProps) {
  return (
    <section className="flex flex-col gap-1">
      <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
        {t.today.recap}
      </h2>
      <ul className="flex flex-col">
        {habits.map((habit) => {
          const done = completedIds.has(habit.id)
          return (
            <li key={habit.id}>
              <button
                type="button"
                onClick={() => onToggle(habit)}
                aria-pressed={done}
                className="flex min-h-touch w-full items-center gap-3 border-b border-border py-2 text-left transition-colors hover:bg-accent"
              >
                <span
                  className={cn(
                    'flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    done
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/40',
                  )}
                >
                  {done ? <Check size={13} strokeWidth={3} aria-hidden /> : null}
                </span>
                <span
                  className={cn(
                    'min-w-0 flex-1 truncate text-[15px]',
                    done && 'text-muted-foreground line-through',
                  )}
                >
                  {habit.title}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {done ? t.today.stateDone : t.today.stateTodo}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
