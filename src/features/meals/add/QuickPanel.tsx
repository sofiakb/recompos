import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QUICK_AMOUNTS } from '@/features/nutrition/quickAmounts'
import { MAX_MEAL_KCAL } from '@/lib/nutrition'
import { t } from '@/i18n/fr'

interface QuickPanelProps {
  kcal: string
  onKcal: (value: string) => void
  onProtein: (grams: number) => void
  onCustomProtein: () => void
  onSubmitKcal: (kcal: number) => void
}

/**
 * A dose of protein, or a number of calories, with nothing to describe.
 *
 * The 1-tap path the app was built around (PRD §6.2). It moved inside the add
 * sheet with everything else, but it is still the shortest route in the app and
 * still lands on the meal whose `+` was tapped.
 */
export function QuickPanel({
  kcal,
  onKcal,
  onProtein,
  onCustomProtein,
  onSubmitKcal,
}: Readonly<QuickPanelProps>) {
  const parsed = Number(kcal)
  const valid = Number.isFinite(parsed) && parsed > 0 && parsed <= MAX_MEAL_KCAL

  return (
    <div className="flex flex-col gap-5">
      <p className="text-[13px] text-muted-foreground">{t.nutrition.quickIntro}</p>

      <div className="grid grid-cols-4 gap-2">
        {QUICK_AMOUNTS.map((grams) => (
          <Button
            key={grams}
            onClick={() => onProtein(grams)}
            className="tnum min-h-16 flex-col gap-0"
          >
            <span className="text-[17px] font-semibold">+{grams}</span>
            <span className="text-[11px] font-normal opacity-80">g</span>
          </Button>
        ))}
        <Button
          variant="secondary"
          className="min-h-16"
          onClick={onCustomProtein}
          aria-label={t.nutrition.custom}
        >
          <Plus size={22} aria-hidden />
        </Button>
      </div>

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          {t.nutrition.kcalOnly}
        </h3>
        <Input
          inputMode="numeric"
          className="tnum"
          aria-label={t.nutrition.kcalPlaceholder}
          placeholder={t.nutrition.kcalPlaceholder}
          value={kcal}
          onChange={(event) => onKcal(event.target.value.replace(/\D/g, ''))}
        />
        <Button block disabled={!valid} onClick={() => onSubmitKcal(parsed)}>
          {t.nutrition.addKcal}
        </Button>
      </section>
    </div>
  )
}
