import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MealPhoto } from '@/features/meals/MealPhoto'
import { t } from '@/i18n/fr'
import type { MealEntry } from '@/types/models'

interface MealRowProps {
  meal: MealEntry
  analysing: boolean
  photoUrlFor: (id: string) => Promise<string | null>
  onOpen: (meal: MealEntry) => void
  onRetry: (id: string) => void
}

export function MealRow({ meal, analysing, photoUrlFor, onOpen, onRetry }: MealRowProps) {
  const busy = analysing || meal.status === 'analysing'
  const failed = meal.status === 'failed'
  const waiting = meal.status === 'pending' && !busy

  return (
    <li className="flex items-center gap-3 border-b border-border/60 py-2 last:border-0">
      {meal.photoId ? (
        <MealPhoto
          mealId={meal.id}
          alt={meal.label || t.meals.title}
          load={photoUrlFor}
          className="h-12 w-12 shrink-0"
        />
      ) : null}

      <button
        type="button"
        onClick={() => onOpen(meal)}
        disabled={busy}
        className="min-h-touch min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      >
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {t.meals.slot[meal.slot]}
          {meal.source === 'corrected' ? <span>· {t.meals.correctedBadge}</span> : null}
          {meal.source === 'manual' ? <span>· {t.meals.manualBadge}</span> : null}
        </p>
        {busy ? (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Loader2 size={14} className="animate-spin" aria-hidden />
            {t.meals.analysing}
          </p>
        ) : waiting ? (
          <p className="text-sm text-muted-foreground">{t.meals.pending}</p>
        ) : failed ? (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <AlertTriangle size={14} aria-hidden />
            {t.meals.failed(meal.error ?? t.meals.unknownError)}
          </p>
        ) : (
          <>
            <p className="truncate text-sm font-medium">{meal.label}</p>
            <p className="tnum text-xs text-muted-foreground">
              {t.meals.macros(meal.proteinG, meal.carbsG, meal.fatG)}
            </p>
          </>
        )}
      </button>

      {failed || waiting ? (
        <Button
          variant="secondary"
          aria-label={t.meals.retry}
          onClick={() => onRetry(meal.id)}
          disabled={busy}
        >
          <RefreshCw size={16} aria-hidden />
        </Button>
      ) : meal.status === 'done' ? (
        <span className="tnum shrink-0 text-sm font-semibold">{t.meals.kcal(meal.kcal)}</span>
      ) : null}
    </li>
  )
}
