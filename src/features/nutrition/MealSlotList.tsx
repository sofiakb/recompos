import { Link } from 'react-router-dom'
import { AlertTriangle, Loader2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mealTargetKcal } from '@/lib/nutrition'
import { t } from '@/i18n/fr'
import type { SlotGroup, JournalEntry } from '@/features/nutrition/journal'
import type { MealEntry, MealSlot, MealSource, ProteinLog } from '@/types/models'

interface MealSlotListProps {
  groups: SlotGroup[]
  /** The day's target; each meal's share is derived from it, not stored. */
  targetKcal: number
  /** Meal ids whose analysis is in flight right now. */
  analysing: string[]
  onAdd: (slot: MealSlot) => void
  onOpenMeal: (meal: MealEntry) => void
  onOpenProtein: (log: ProteinLog) => void
}

/**
 * What each source is called in the journal.
 *
 * A table rather than a chain of ternaries: it is exhaustive over `MealSource`,
 * so a source added later is a compile error here instead of a row that quietly
 * shows no badge at all. `ai` is deliberately null — a photographed meal is the
 * default, and labelling the default is noise on every row.
 */
const SOURCE_BADGE: Record<MealSource, string | null> = {
  ai: null,
  ai_text: t.meals.textBadge,
  barcode: t.barcode.badge,
  food: t.foods.badge,
  corrected: t.meals.correctedBadge,
  manual: t.meals.manualBadge,
}

/**
 * The table that stated the figures, named rather than hinted at.
 *
 * « Riz blanc, cuit · Ciqual » says where to go and disagree; « aliment » only
 * says it was not a photo. The name is kept in `analysedBy`, the field that
 * already answers « who produced these numbers ».
 */
function badgeFor(meal: MealEntry): string | null {
  if (meal.source !== 'food') return SOURCE_BADGE[meal.source]
  const table = meal.analysedBy
  return table === 'ciqual' || table === 'off' ? t.foods.source[table] : t.foods.badge
}

function subline(group: SlotGroup, target: number): string {
  const kcal = t.nutrition.slotTotals(group.kcal, target)
  // A meal that carried no protein says nothing about protein, rather than « 0 g ».
  return group.proteinG > 0 ? `${kcal} · ${t.nutrition.slotProtein(group.proteinG)}` : kcal
}

/**
 * One line per thing eaten.
 *
 * 48 px tall despite the small type: the handoff draws these as a read-out, but
 * every one of them opens the editor — a wrong reading has to be correctable,
 * and a failed analysis has to be retryable. The touch minimum wins over the
 * compactness.
 */
function EntryRow({
  label,
  value,
  onClick,
  disabled,
}: Readonly<{
  label: React.ReactNode
  value?: string
  onClick: () => void
  disabled?: boolean
}>) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex min-h-touch w-full items-baseline justify-between gap-3 text-left transition-colors hover:bg-accent disabled:opacity-60"
      >
        <span className="min-w-0 flex-1 self-center truncate text-xs">{label}</span>
        {value ? (
          <span className="tnum shrink-0 self-center text-xs text-muted-foreground">{value}</span>
        ) : null}
      </button>
    </li>
  )
}

function MealRow({
  entry,
  analysing,
  onOpenMeal,
}: Readonly<{
  entry: JournalEntry & { kind: 'meal' }
  analysing: string[]
  onOpenMeal: (meal: MealEntry) => void
}>) {
  const { meal } = entry
  const busy = analysing.includes(meal.id) || meal.status === 'analysing'
  const waiting = meal.status === 'pending' && !busy
  const failed = meal.status === 'failed'

  if (busy || waiting || failed) {
    return (
      <EntryRow
        label={
          <span className="flex items-center gap-1.5 text-muted-foreground">
            {busy ? <Loader2 size={14} className="animate-spin" aria-hidden /> : null}
            {failed ? <AlertTriangle size={14} aria-hidden /> : null}
            {progressLabel(busy, waiting, meal.error)}
          </span>
        }
        onClick={() => onOpenMeal(meal)}
        disabled={busy}
      />
    )
  }

  const badge = badgeFor(meal)
  return (
    <EntryRow
      label={badge ? `${meal.label || t.meals.title} · ${badge}` : meal.label || t.meals.title}
      value={t.nutrition.kcalValue(meal.kcal)}
      onClick={() => onOpenMeal(meal)}
    />
  )
}

/** Three states, one line each: nesting them as ternaries reads worse. */
function progressLabel(busy: boolean, waiting: boolean, error: string | undefined): string {
  if (busy) return t.meals.analysing
  if (waiting) return t.meals.pending
  return t.meals.failed(error ?? t.meals.unknownError)
}

/**
 * The day's journal, one section per meal.
 *
 * It used to be a single chronological list, which answered « what did I eat »
 * but not « can I still have that tonight ». Grouping by meal turns the same
 * rows into a budget you can read one line at a time.
 */
export function MealSlotList({
  groups,
  targetKcal,
  analysing,
  onAdd,
  onOpenMeal,
  onOpenProtein,
}: Readonly<MealSlotListProps>) {
  return (
    <>
      <ul className="flex flex-col">
        {groups.map((group) => {
          const target = mealTargetKcal(targetKcal, group.slot)
          const over = group.kcal - target

          return (
            <li key={group.slot} className="border-b border-border">
              {/* The rows below already carry 48 px of touch padding, half of
                  which reads as space under this header. Keeping a full
                  bottom padding on top of it pushed the first thing eaten a
                  third of a line too far from the meal it belongs to. An empty
                  slot has no such row, so it keeps its own. */}
              <div
                className={cn(
                  'flex items-center gap-3 px-4 pt-3.5',
                  group.entries.length > 0 ? 'pb-1' : 'pb-3.5',
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold">{t.meals.slot[group.slot]}</p>
                  <p className="tnum text-[13px] text-muted-foreground">{subline(group, target)}</p>
                </div>
                {/* 32 px of lime inside a 48 px target: the disc is what the
                    handoff drew, the hit area is what the thumb needs. */}
                <button
                  type="button"
                  aria-label={t.nutrition.addToSlot[group.slot]}
                  onClick={() => onAdd(group.slot)}
                  className="-mr-2 flex h-touch w-touch shrink-0 items-center justify-center"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95">
                    <Plus size={18} aria-hidden />
                  </span>
                </button>
              </div>

              {group.entries.length > 0 ? (
                <ul className="flex flex-col px-4 pb-2">
                  {group.entries.map((entry) =>
                    entry.kind === 'meal' ? (
                      <MealRow
                        key={entry.id}
                        entry={entry}
                        analysing={analysing}
                        onOpenMeal={onOpenMeal}
                      />
                    ) : (
                      <EntryRow
                        key={entry.id}
                        label={entry.log.note ?? t.nutrition.source[entry.log.sourceType]}
                        value={`+${entry.log.grams} g`}
                        onClick={() => onOpenProtein(entry.log)}
                      />
                    ),
                  )}
                </ul>
              ) : null}

              {over > 0 ? (
                <p className="px-4 pb-3 text-[13px] text-muted-foreground">
                  {t.nutrition.overMeal(over)}
                </p>
              ) : null}
            </li>
          )
        })}
      </ul>

      <Link
        to="/nutrition/catalogues"
        className="mx-4 mt-4 flex min-h-touch items-center justify-center rounded-lg border border-border text-[15px] font-medium transition-colors hover:bg-accent"
      >
        {t.nutrition.whatToEat}
      </Link>
    </>
  )
}
