import { AlertTriangle, Loader2 } from 'lucide-react'
import { t } from '@/i18n/fr'
import type { JournalEntry } from '@/features/nutrition/journal'
import type { MealEntry, ProteinLog } from '@/types/models'

interface DayJournalProps {
  entries: JournalEntry[]
  /** Meal ids whose analysis is in flight right now. */
  analysing: string[]
  onOpenProtein: (log: ProteinLog) => void
  onOpenMeal: (meal: MealEntry) => void
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function Row({
  timestamp,
  title,
  meta,
  value,
  onClick,
  disabled,
}: {
  timestamp: string
  title: React.ReactNode
  meta?: React.ReactNode
  value?: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex min-h-[56px] w-full items-center gap-3 border-b border-border py-2 text-left transition-colors hover:bg-accent disabled:opacity-60"
      >
        <span className="tnum w-11 shrink-0 text-xs text-muted-foreground">
          {formatTime(timestamp)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-medium">{title}</span>
          {meta ? (
            <span className="block truncate text-xs text-muted-foreground">{meta}</span>
          ) : null}
        </span>
        {value ? <span className="tnum shrink-0 text-sm font-semibold">{value}</span> : null}
      </button>
    </li>
  )
}

/**
 * One list for the whole day, protein entries and meals interleaved.
 *
 * They used to sit in two separate cards, which made « what did I eat today »
 * a question you answered by reading two lists and merging them yourself.
 */
export function DayJournal({ entries, analysing, onOpenProtein, onOpenMeal }: DayJournalProps) {
  if (entries.length === 0) {
    return <p className="py-2 text-sm text-muted-foreground">{t.nutrition.journalEmpty}</p>
  }

  return (
    <ul className="flex flex-col">
      {entries.map((entry) => {
        if (entry.kind === 'protein') {
          const { log } = entry
          const named = Boolean(log.note)
          return (
            <Row
              key={entry.id}
              timestamp={entry.timestamp}
              title={log.note ?? t.nutrition.source[log.sourceType]}
              // The source already titles the row when there is no note.
              meta={named ? t.nutrition.source[log.sourceType] : undefined}
              value={`+${log.grams} g`}
              onClick={() => onOpenProtein(log)}
            />
          )
        }

        const { meal } = entry
        const busy = analysing.includes(meal.id) || meal.status === 'analysing'
        const waiting = meal.status === 'pending' && !busy
        const failed = meal.status === 'failed'

        if (busy || waiting || failed) {
          return (
            <Row
              key={entry.id}
              timestamp={entry.timestamp}
              title={
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  {busy ? <Loader2 size={14} className="animate-spin" aria-hidden /> : null}
                  {failed ? <AlertTriangle size={14} aria-hidden /> : null}
                  {busy
                    ? t.meals.analysing
                    : waiting
                      ? t.meals.pending
                      : t.meals.failed(meal.error ?? t.meals.unknownError)}
                </span>
              }
              meta={t.meals.slot[meal.slot]}
              onClick={() => onOpenMeal(meal)}
              disabled={busy}
            />
          )
        }

        const badge =
          meal.source === 'corrected'
            ? t.meals.correctedBadge
            : meal.source === 'manual'
              ? t.meals.manualBadge
              : meal.source === 'ai_text'
                ? t.meals.textBadge
                : meal.source === 'barcode'
                  ? t.barcode.badge
                  : null

        return (
          <Row
            key={entry.id}
            timestamp={entry.timestamp}
            title={meal.label || t.meals.title}
            meta={[t.meals.slot[meal.slot], `${meal.kcal} kcal`, badge].filter(Boolean).join(' · ')}
            value={meal.proteinG > 0 ? `+${meal.proteinG} g` : undefined}
            onClick={() => onOpenMeal(meal)}
          />
        )
      })}
    </ul>
  )
}
