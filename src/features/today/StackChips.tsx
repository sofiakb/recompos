import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { t } from '@/i18n/fr'
import type { FloorHabitDefinition } from '@/types/models'
import { TapTarget } from '@/components/ui/tap-target'

interface StackChipsProps {
  habits: FloorHabitDefinition[]
  completedIds: Set<string>
  onToggle: (habit: FloorHabitDefinition) => void
}

/**
 * Stacked habits as chips: bonus, and visibly lighter than the floor.
 *
 * They used to get a card of the same weight as the floor, which made the
 * optional look mandatory.
 */
export function StackChips({ habits, completedIds, onToggle }: StackChipsProps) {
  if (habits.length === 0) return null

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
        {t.today.stackTitle}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {habits.map((habit) => {
          const done = completedIds.has(habit.id)
          return (
            <li key={habit.id}>
              <TapTarget
                type="button"
                onClick={() => onToggle(habit)}
                aria-pressed={done}
                className={cn(
                  'flex min-h-touch items-center gap-2 rounded-full border px-4 text-sm transition-colors',
                  done
                    ? 'border-primary/35 bg-primary/[0.08] text-foreground'
                    : 'border-border text-muted-foreground hover:bg-accent',
                )}
              >
                {done ? <Check size={14} className="text-primary" aria-hidden /> : null}
                {habit.title}
              </TapTarget>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
