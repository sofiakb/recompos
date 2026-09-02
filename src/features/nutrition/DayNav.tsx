import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { addDays, formatLongDate, toLogicalDate, type IsoDate } from '@/lib/date'
import { t } from '@/i18n/fr'
import { TapTarget } from '@/components/ui/tap-target'

interface DayNavProps {
  date: IsoDate
  onChange: (date: IsoDate) => void
}

/**
 * Walking back through the week.
 *
 * Forward stops at today rather than wrapping or disabling itself silently:
 * there is nothing to log in the future, and a button that moves to a day that
 * cannot hold anything is a button that lies.
 */
export function DayNav({ date, onChange }: Readonly<DayNavProps>) {
  const today = toLogicalDate()
  const isToday = date === today

  return (
    <div className="flex gap-2 px-4 pb-2 pt-3">
      <TapTarget
        type="button"
        aria-label={t.nutrition.previousDay}
        onClick={() => onChange(addDays(date, -1))}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent"
      >
        <ChevronLeft size={18} aria-hidden />
      </TapTarget>

      <TapTarget
        type="button"
        // Tapping the label jumps home from wherever you wandered to, which is
        // the only move worth a third button on this row.
        aria-label={isToday ? undefined : t.nutrition.todayTitle}
        disabled={isToday}
        onClick={() => onChange(today)}
        className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-muted px-4 text-[15px] font-semibold disabled:opacity-100"
      >
        <Calendar size={16} aria-hidden />
        {isToday ? t.nutrition.todayTitle : formatLongDate(date)}
      </TapTarget>

      <TapTarget
        type="button"
        aria-label={t.nutrition.nextDay}
        disabled={isToday}
        onClick={() => onChange(addDays(date, 1))}
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent',
          'disabled:cursor-default disabled:bg-muted disabled:text-muted-foreground disabled:opacity-40',
        )}
      >
        <ChevronRight size={18} aria-hidden />
      </TapTarget>
    </div>
  )
}
