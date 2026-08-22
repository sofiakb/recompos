import { useLiveQuery } from 'dexie-react-hooks'
import { Sheet } from '@/components/ui/sheet'
import { ConsistencyHeatmap } from '@/features/floor/ConsistencyHeatmap'
import { habitHistory } from '@/db/repositories/habitRepository'
import { DAYS_PER_WEEK, HEATMAP_WEEKS } from '@/lib/heatmap'
import { formatLongDate, toLogicalDate } from '@/lib/date'
import { t } from '@/i18n/fr'
import type { FloorHabitDefinition } from '@/types/models'

interface HabitHistorySheetProps {
  habit: FloorHabitDefinition | null
  installedOn: string
  onClose: () => void
}

const WINDOW_DAYS = HEATMAP_WEEKS * DAYS_PER_WEEK

export function HabitHistorySheet({ habit, installedOn, onClose }: HabitHistorySheetProps) {
  const today = toLogicalDate()
  const habitId = habit?.id ?? null
  const history = useLiveQuery(
    () => (habitId ? habitHistory(habitId, WINDOW_DAYS, today) : Promise.resolve(null)),
    [habitId, today],
    null,
  )

  return (
    <Sheet open={habit !== null} onClose={onClose} title={habit?.title ?? t.habits.history}>
      <div className="flex flex-col gap-3">
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
        <ConsistencyHeatmap
          completedDates={history?.dates ?? new Set<string>()}
          installedOn={installedOn}
          today={today}
        />
      </div>
    </Sheet>
  )
}
