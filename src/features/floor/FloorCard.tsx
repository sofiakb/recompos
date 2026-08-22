import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { t } from '@/i18n/fr'
import type { FloorHabitDefinition } from '@/types/models'

interface FloorCardProps {
  title: string
  description: string
  habits: FloorHabitDefinition[]
  completedIds: Set<string>
  onToggle: (habit: FloorHabitDefinition) => void
  onCompleteAll?: () => void
  allDone?: boolean
  doneLabel?: string
  doneHint?: string
}

export function FloorCard({
  title,
  description,
  habits,
  completedIds,
  onToggle,
  onCompleteAll,
  allDone = false,
  doneLabel,
  doneHint,
}: FloorCardProps) {
  if (habits.length === 0) return null

  return (
    <Card className={cn(allDone && 'border-primary/40')}>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{allDone && doneLabel ? doneLabel : title}</CardTitle>
          {allDone ? (
            <span className="flex h-6 w-6 shrink-0 animate-pop-in items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check size={15} strokeWidth={3} aria-hidden />
            </span>
          ) : null}
        </div>
        <CardDescription>{allDone && doneHint ? doneHint : description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <ul className="flex flex-col">
          {habits.map((habit) => {
            const done = completedIds.has(habit.id)
            return (
              <li key={habit.id}>
                <button
                  type="button"
                  aria-pressed={done}
                  onClick={() => onToggle(habit)}
                  className="flex min-h-touch w-full items-center gap-3 rounded-md py-2 text-left transition-colors active:bg-accent"
                >
                  <span
                    aria-hidden
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                      done
                        ? 'animate-pop-in border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/40',
                    )}
                  >
                    {done ? <Check size={16} strokeWidth={3} /> : null}
                  </span>
                  <span className="flex flex-col">
                    <span
                      className={cn(
                        'text-sm font-medium transition-colors',
                        done && 'text-muted-foreground line-through',
                      )}
                    >
                      {habit.title}
                    </span>
                    {habit.triggerAnchor ? (
                      <span className="text-xs text-muted-foreground">{habit.triggerAnchor}</span>
                    ) : null}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {onCompleteAll && !allDone ? (
          <Button variant="outline" block onClick={onCompleteAll} className="mt-2">
            {t.today.validateAll}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
