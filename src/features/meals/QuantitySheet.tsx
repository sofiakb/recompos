import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Minus, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import {
  amountOf,
  convertUnit,
  isPortions,
  isWeighed,
  portionChips,
  quantityChips,
  rescale,
  stepQuantity,
  type Macros,
} from '@/lib/portion'
import { t } from '@/i18n/fr'
import type { MealItem } from '@/types/models'
import { TapTarget } from '@/components/ui/tap-target'

interface QuantitySheetProps {
  open: boolean
  /** The line as it stands. The sheet opens on it and hands back a new one. */
  item: MealItem
  /** Where the line comes from — « Ligne du déjeuner · estimée depuis la photo ». */
  subtitle?: string
  /** What the source table left out, when it left something out. */
  note?: string
  saveLabel: string
  onClose: () => void
  onSave: (item: MealItem) => void
  /** Absent while adding: there is nothing yet to take away. */
  onRemove?: () => void
  /** Pinning the line as a favourite, where that means anything. */
  star?: { pinned: boolean; onToggle: () => void }
}

/** Key, the word under the figure, and the longer one a screen reader gets. */
const MACROS = [
  ['kcal', t.nutrition.kcalUnit, t.meals.itemKcal],
  ['proteinG', t.nutrition.macroLabel.proteinG, t.meals.itemProtein],
  ['carbsG', t.nutrition.macroLabel.carbsG, t.meals.itemCarbs],
  ['fatG', t.nutrition.macroLabel.fatG, t.meals.itemFat],
] as const satisfies ReadonlyArray<readonly [keyof Macros, string, string]>

function macrosOf(item: MealItem): Macros {
  return { kcal: item.kcal, proteinG: item.proteinG, carbsG: item.carbsG, fatG: item.fatG }
}

function sameMacros(a: Macros, b: Macros): boolean {
  return (
    a.kcal === b.kcal && a.proteinG === b.proteinG && a.carbsG === b.carbsG && a.fatG === b.fatG
  )
}

function toNumber(text: string): number {
  const parsed = Number(text.replace(',', '.'))
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : 0
}

/**
 * How much of it — the one question no nutrition table answers, and the one
 * correction anybody makes twice.
 *
 * A single sheet for both sides of it: a food being added owes a portion, and a
 * line already eaten is being re-read (« c'était 200 g, pas 300 »). Both are a
 * quantity with macros hanging off it, so both get the stepper, the shortcuts
 * and the same live read-out. Typing the four figures by hand is still there,
 * folded away, because it is the rare case rather than the default one.
 */
export function QuantitySheet({
  open,
  item,
  subtitle,
  note,
  saveLabel,
  onClose,
  onSave,
  onRemove,
  star,
}: Readonly<QuantitySheetProps>) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [macros, setMacros] = useState<Macros>(macrosOf(item))
  const [manualOpen, setManualOpen] = useState(false)
  /**
   * What one portion weighs, once anything has said so.
   *
   * The product may have declared it; otherwise the first switch to portions
   * settles it — whatever is on the line at that moment *is* one portion. The
   * app never guesses a serving, it only remembers the one it was given.
   */
  const [serving, setServing] = useState(item.servingGrams)
  /**
   * The quantity these macros were stated for, kept aside so every press
   * rescales from it rather than from the last result: stepping 150 g up to
   * 200 g in five presses would otherwise round the figures away one press at a
   * time. Corrected by hand, the macros stop matching `applied` and the basis
   * retires itself.
   */
  const basis = useRef<{ quantity: string; portion: Macros; applied: Macros } | null>(null)

  useEffect(() => {
    if (!open) return
    setQuantity(item.quantity)
    setMacros(macrosOf(item))
    setManualOpen(false)
    setServing(item.servingGrams)
    basis.current = null
  }, [open, item])

  const changeQuantity = (next: string) => {
    const held = basis.current
    const from =
      held && sameMacros(held.applied, macros)
        ? held
        : { quantity, portion: macros, applied: macros }
    const scaled = rescale({ quantity: from.quantity, ...from.portion }, next)
    basis.current = { quantity: from.quantity, portion: from.portion, applied: scaled ?? macros }
    setQuantity(next)
    if (scaled) setMacros(scaled)
  }

  const counting = isPortions(quantity)
  const chips = counting ? portionChips() : quantityChips(quantity)
  // Offered on anything weighed, and on anything already counted in portions.
  // « 1 cuisse » is already a count of its own and has nothing to gain.
  const canSwitch = counting || isWeighed(quantity)

  /**
   * Reads the same amount in the other unit. Nothing is eaten or un-eaten by
   * changing how it is counted, so the macros stay exactly where they are.
   */
  const switchUnit = (to: 'grams' | 'portions') => {
    const grams = to === 'portions' && serving === undefined ? amountOfGrams(quantity) : serving
    if (grams === undefined) return
    const next = convertUnit(quantity, grams, to)
    if (!next) return
    setServing(grams)
    setQuantity(next)
    basis.current = null
  }

  const header = (
    <>
      <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted" />
      <div className="mb-4 flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-[19px] font-semibold tracking-[-0.01em]">{item.name}</h2>
          {subtitle ? <p className="text-[13px] text-muted-foreground">{subtitle}</p> : null}
        </div>
        {star ? (
          <TapTarget
            type="button"
            aria-pressed={star.pinned}
            aria-label={star.pinned ? t.favorites.remove(item.name) : t.favorites.add(item.name)}
            onClick={star.onToggle}
            className="-mr-1 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Star
              size={20}
              aria-hidden
              className={star.pinned ? 'fill-foreground text-foreground' : undefined}
            />
          </TapTarget>
        ) : null}
      </div>
    </>
  )

  return (
    <Sheet open={open} onClose={onClose} title={item.name} header={header}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
              {t.meals.quantityLabel}
            </p>
            {canSwitch ? (
              <div className="flex shrink-0 gap-1 rounded-full bg-muted p-1">
                <UnitTab
                  label={t.meals.inGrams}
                  active={!counting}
                  onPick={() => switchUnit('grams')}
                />
                <UnitTab
                  label={t.meals.inPortions}
                  active={counting}
                  onPick={() => switchUnit('portions')}
                />
              </div>
            ) : null}
          </div>
          <div className="flex items-stretch gap-2">
            <StepButton
              label={t.meals.quantityDown}
              onPress={() => changeQuantity(stepQuantity(quantity, -1))}
            >
              <Minus size={20} aria-hidden />
            </StepButton>
            <Input
              className="tnum h-[52px] flex-1 rounded-2xl text-center text-[26px] font-semibold"
              inputMode="numeric"
              aria-label={t.meals.quantityLabel}
              value={quantity}
              placeholder={t.meals.quantityPlaceholder}
              onChange={(event) => changeQuantity(event.target.value)}
            />
            <StepButton
              label={t.meals.quantityUp}
              onPress={() => changeQuantity(stepQuantity(quantity, 1))}
            >
              <Plus size={20} aria-hidden />
            </StepButton>
          </div>

          {chips.length > 0 ? (
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {chips.map((chip) => (
                <TapTarget
                  key={chip}
                  type="button"
                  onClick={() => changeQuantity(chip)}
                  className={cn(
                    'tnum flex min-h-10 shrink-0 items-center rounded-full px-3.5 text-sm transition-colors',
                    quantity === chip
                      ? 'bg-primary font-semibold text-primary-foreground'
                      : 'border border-border text-muted-foreground hover:bg-accent',
                  )}
                >
                  {chip}
                </TapTarget>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-lg border border-border bg-background p-3.5">
          <div className="grid grid-cols-4 gap-2.5">
            {MACROS.map(([key, short]) => (
              <div key={key} className="text-center">
                <p
                  className={cn('tnum text-xl font-semibold', key === 'proteinG' && 'text-primary')}
                >
                  {macros[key]}
                </p>
                <p className="text-[12px] text-muted-foreground">{short}</p>
              </div>
            ))}
          </div>
          {/* A « Calories seules » line has no quantity to recompute from, and
              « Recalculé pour  » ending on nothing is worse than saying nothing. */}
          {quantity.trim() ? (
            <p className="mt-2 text-center text-[12px] text-muted-foreground">
              {t.meals.recomputedFor(quantity.trim())}
            </p>
          ) : null}
        </div>

        {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}

        <div className="border-t border-border">
          <TapTarget
            type="button"
            aria-expanded={manualOpen}
            onClick={() => setManualOpen((current) => !current)}
            className="flex min-h-touch w-full items-center gap-2 text-left text-sm transition-colors hover:bg-accent"
          >
            <Pencil size={17} className="text-muted-foreground" aria-hidden />
            <span className="flex-1">{t.meals.manualMacros}</span>
            <ChevronDown
              size={18}
              aria-hidden
              className={cn(
                'text-muted-foreground transition-transform',
                manualOpen && 'rotate-180',
              )}
            />
          </TapTarget>

          {manualOpen ? (
            <div className="grid grid-cols-4 gap-2 pb-1">
              {MACROS.map(([key, short, long]) => (
                <label key={key} className="flex flex-col gap-1">
                  <span className="text-[11px] text-muted-foreground">{short}</span>
                  <Input
                    className="tnum px-2 text-center"
                    inputMode="numeric"
                    aria-label={long}
                    value={String(macros[key])}
                    onChange={(event) =>
                      setMacros((current) => ({ ...current, [key]: toNumber(event.target.value) }))
                    }
                  />
                </label>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex gap-2.5">
          {onRemove ? (
            <TapTarget
              type="button"
              aria-label={t.meals.removeItem(item.name)}
              onClick={onRemove}
              className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-lg border border-border text-destructive transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Trash2 size={19} aria-hidden />
            </TapTarget>
          ) : null}
          <Button
            size="lg"
            className="flex-1"
            onClick={() => onSave(applied(item, quantity, macros, serving))}
          >
            {saveLabel}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}

/** The line as the sheet leaves it: same food, the quantity and macros asked for. */
function applied(
  item: MealItem,
  quantity: string,
  macros: Macros,
  servingGrams: number | undefined,
): MealItem {
  return { ...item, quantity: quantity.trim(), ...macros, servingGrams }
}

/** The number of grams a weighed quantity states, or nothing. */
function amountOfGrams(quantity: string): number | undefined {
  if (!isWeighed(quantity)) return undefined
  const amount = amountOf(quantity)
  return amount !== null && amount > 0 ? amount : undefined
}

function UnitTab({
  label,
  active,
  onPick,
}: Readonly<{ label: string; active: boolean; onPick: () => void }>) {
  return (
    <TapTarget
      type="button"
      aria-pressed={active}
      onClick={onPick}
      className={cn(
        'rounded-full px-3 py-1.5 text-[13px] transition-colors',
        active ? 'bg-card font-semibold text-foreground' : 'text-muted-foreground',
      )}
    >
      {label}
    </TapTarget>
  )
}

function StepButton({
  label,
  onPress,
  children,
}: Readonly<{ label: string; onPress: () => void; children: React.ReactNode }>) {
  return (
    <TapTarget
      type="button"
      aria-label={label}
      onClick={onPress}
      className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-border bg-muted transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </TapTarget>
  )
}
