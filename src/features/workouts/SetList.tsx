import { Trash2 } from 'lucide-react'
import { t } from '@/i18n/fr'
import type { Exercise, ExerciseSet } from '@/types/models'
import { TapTarget } from '@/components/ui/tap-target'

interface SetListProps {
  sets: ExerciseSet[]
  exerciseById: (id: string) => Exercise | undefined
  onRemove: (id: string) => void
}

export function SetList({ sets, exerciseById, onRemove }: SetListProps) {
  if (sets.length === 0) {
    return <p className="py-1 text-sm text-muted-foreground">{t.workouts.noSetsToday}</p>
  }

  return (
    <ul className="flex flex-col">
      {sets.map((set) => (
        <li
          key={set.id}
          className="flex items-center gap-3 border-b border-border/60 py-2 last:border-0"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {exerciseById(set.exerciseId)?.name ?? set.exerciseId}
            </p>
            <p className="tnum truncate text-xs text-muted-foreground">
              {t.workouts.setSummary(set.reps, set.loadOrResistance)} ·{' '}
              {t.workouts.difficultyLabel[set.difficulty]}
            </p>
          </div>
          <TapTarget
            type="button"
            aria-label={t.workouts.deleteSet}
            onClick={() => onRemove(set.id)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Trash2 size={16} aria-hidden />
          </TapTarget>
        </li>
      ))}
    </ul>
  )
}
