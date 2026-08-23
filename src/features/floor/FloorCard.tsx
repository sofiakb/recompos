import { useEffect, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
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
  // Folding is not a lock: completing the floor frees the screen, and tapping
  // the header opens it again — unchecking a habit has to stay reachable.
  const [expanded, setExpanded] = useState(!allDone)

  useEffect(() => {
    setExpanded(!allDone)
  }, [allDone])

  if (habits.length === 0) return null

  const collapsible = allDone
  const showList = !collapsible || expanded

  return (
    <Card className={cn(allDone && 'border-primary/40')}>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{allDone && doneLabel ? doneLabel : title}</CardTitle>
          {collapsible ? (
            <button
              type="button"
              aria-expanded={expanded}
              aria-label={expanded ? t.today.floorCollapse : t.today.floorExpand}
              onClick={() => setExpanded((current) => !current)}
              // A real control rather than a clickable header: the title is an
              // <h2>, and a button may not contain one.
              className="-my-2 flex min-h-touch shrink-0 items-center gap-1 rounded-md px-2 transition-colors active:bg-accent"
            >
              <ChevronDown
                size={16}
                aria-hidden
                className={cn(
                  'text-muted-foreground transition-transform',
                  expanded && 'rotate-180',
                )}
              />
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check size={15} strokeWidth={3} aria-hidden />
              </span>
            </button>
          ) : null}
        </div>
        <CardDescription>{allDone && doneHint ? doneHint : description}</CardDescription>
      </CardHeader>
      {/* Unmounted rather than hidden: a collapsed list must leave the tab
          order, not just the screen. */}
      {showList ? (
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
      ) : null}
    </Card>
  )
}
