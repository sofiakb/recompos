import { useEffect, useState } from 'react'
import { Camera, Plus, ScanBarcode, Search, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { BarcodeScanner } from '@/features/meals/BarcodeScanner'
import { QuickPanel } from '@/features/meals/add/QuickPanel'
import { SearchPanel } from '@/features/meals/add/SearchPanel'
import { cn } from '@/lib/utils'
import { t } from '@/i18n/fr'
import type { RecentMeal } from '@/features/meals/useRecentMeals'
import type { MealSlot } from '@/types/models'

export type AddTab = 'search' | 'quick' | 'photo' | 'describe' | 'barcode'

const TABS = [
  { id: 'search', label: t.nutrition.tabSearch, Icon: Search },
  { id: 'quick', label: t.nutrition.tabQuick, Icon: Plus },
  { id: 'photo', label: t.nutrition.tabPhoto, Icon: Camera },
  { id: 'describe', label: t.nutrition.tabDescribe, Icon: Sparkles },
  { id: 'barcode', label: t.nutrition.tabBarcode, Icon: ScanBarcode },
] as const satisfies ReadonlyArray<{ id: AddTab; label: string; Icon: typeof Search }>

interface AddSheetProps {
  /** The meal being added to; `null` closes the sheet. */
  slot: MealSlot | null
  /** Shown under the title, so the budget stays visible while choosing. */
  consumedKcal: number
  targetKcal: number
  /** False while no provider has a key: the two model-backed tabs say so. */
  canAnalyse: boolean
  describing: boolean
  recent: RecentMeal[]
  onClose: () => void
  onPickRecent: (meal: RecentMeal) => void
  onProtein: (grams: number) => void
  onCustomProtein: () => void
  onKcalOnly: (kcal: number) => void
  onOpenCamera: () => void
  onDescribe: (description: string) => void
  onBarcode: (code: string) => void
}

/** The two tabs whose action is anchored at the bottom rather than in the flow. */
const ANCHORED: ReadonlySet<AddTab> = new Set<AddTab>(['photo', 'describe'])

/**
 * Adding something to one meal, by whichever route is fastest right now.
 *
 * Four separate sheets and a row of four buttons became one entry point: the `+`
 * on a meal. The meal is decided before the sheet opens, so no route ever has to
 * ask « which meal was that ? » — that was the question the old screen asked
 * last, when the answer was least available.
 */
export function AddSheet({
  slot,
  consumedKcal,
  targetKcal,
  canAnalyse,
  describing,
  recent,
  onClose,
  onPickRecent,
  onProtein,
  onCustomProtein,
  onKcalOnly,
  onOpenCamera,
  onDescribe,
  onBarcode,
}: Readonly<AddSheetProps>) {
  const [tab, setTab] = useState<AddTab>('search')
  const [query, setQuery] = useState('')
  const [description, setDescription] = useState('')
  const [kcal, setKcal] = useState('')

  const open = slot !== null

  useEffect(() => {
    if (!open) return
    // Back to the fastest route on every opening: whatever was typed last time
    // was for a different meal.
    setTab('search')
    setQuery('')
    setDescription('')
    setKcal('')
  }, [open, slot])

  if (!open) return null

  const header = (
    <>
      <div className="flex items-start gap-3 px-4 pb-3 pt-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-semibold">{t.meals.slot[slot]}</h2>
          <p className="tnum text-[13px] text-muted-foreground">
            {t.nutrition.slotTotals(consumedKcal, targetKcal)}
          </p>
        </div>
        <button
          type="button"
          aria-label={t.common.close}
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent"
        >
          <X size={18} aria-hidden />
        </button>
      </div>

      <div
        role="tablist"
        aria-label={t.nutrition.addTitle(t.meals.slot[slot])}
        className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-4 pb-1"
      >
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              'flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 text-sm',
              tab === id
                ? 'bg-primary font-semibold text-primary-foreground'
                : 'bg-muted font-medium text-muted-foreground',
            )}
          >
            <Icon size={18} aria-hidden />
            {label}
          </button>
        ))}
      </div>
    </>
  )

  return (
    <Sheet open onClose={onClose} tall header={header}>
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-6 pt-5">
        <AddPanel
          tab={tab}
          query={query}
          onQuery={setQuery}
          recent={recent}
          onPickRecent={onPickRecent}
          kcal={kcal}
          onKcal={setKcal}
          onProtein={onProtein}
          onCustomProtein={onCustomProtein}
          onKcalOnly={onKcalOnly}
          description={description}
          onDescription={setDescription}
          onBarcode={onBarcode}
        />
        {!canAnalyse && (tab === 'photo' || tab === 'describe') ? (
          <p className="mt-3 text-xs text-muted-foreground">{t.meals.noProvider}</p>
        ) : null}
      </div>

      {ANCHORED.has(tab) ? (
        <div className="shrink-0 border-t border-border bg-card px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3">
          {tab === 'photo' ? (
            <Button block disabled={!canAnalyse} onClick={onOpenCamera}>
              {t.nutrition.openCamera}
            </Button>
          ) : (
            <Button
              block
              disabled={!canAnalyse || describing || !description.trim()}
              onClick={() => onDescribe(description.trim())}
            >
              {describing ? t.meals.analysing : t.nutrition.estimate}
            </Button>
          )}
        </div>
      ) : null}
    </Sheet>
  )
}

interface AddPanelProps {
  tab: AddTab
  query: string
  onQuery: (value: string) => void
  recent: RecentMeal[]
  onPickRecent: (meal: RecentMeal) => void
  kcal: string
  onKcal: (value: string) => void
  onProtein: (grams: number) => void
  onCustomProtein: () => void
  onKcalOnly: (kcal: number) => void
  description: string
  onDescription: (value: string) => void
  onBarcode: (code: string) => void
}

/** A switch rather than five `&&` lines: exhaustive, and flat to read. */
function AddPanel(props: Readonly<AddPanelProps>) {
  switch (props.tab) {
    case 'search':
      return (
        <SearchPanel
          query={props.query}
          onQuery={props.onQuery}
          recent={props.recent}
          onPick={props.onPickRecent}
        />
      )
    case 'quick':
      return (
        <QuickPanel
          kcal={props.kcal}
          onKcal={props.onKcal}
          onProtein={props.onProtein}
          onCustomProtein={props.onCustomProtein}
          onSubmitKcal={props.onKcalOnly}
        />
      )
    case 'photo':
      return (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-background p-6 text-center">
          <Camera size={28} className="text-muted-foreground" aria-hidden />
          <p className="max-w-[220px] text-pretty text-sm text-muted-foreground">
            {t.nutrition.photoHint}
          </p>
        </div>
      )
    case 'describe':
      return (
        <Textarea
          aria-label={t.meals.describeTitle}
          className="min-h-[120px]"
          placeholder={t.meals.describePlaceholder}
          value={props.description}
          onChange={(event) => props.onDescription(event.target.value)}
        />
      )
    case 'barcode':
      return <BarcodeScanner active onDetected={props.onBarcode} />
  }
}
