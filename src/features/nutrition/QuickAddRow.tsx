import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { t } from '@/i18n/fr'

export const QUICK_AMOUNTS = [20, 30, 40] as const

interface QuickAddRowProps {
  onAdd: (grams: number) => void
  onCustom: () => void
}

/** The 1-tap path: three common portions plus a free amount (PRD §6.2). */
export function QuickAddRow({ onAdd, onCustom }: QuickAddRowProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {QUICK_AMOUNTS.map((grams) => (
        <Button key={grams} size="lg" onClick={() => onAdd(grams)} className="tnum flex-col gap-0">
          <span className="text-base font-semibold">+{grams}</span>
          <span className="text-[11px] font-normal opacity-80">g</span>
        </Button>
      ))}
      <Button size="lg" variant="secondary" onClick={onCustom} aria-label={t.nutrition.custom}>
        <Plus size={20} aria-hidden />
      </Button>
    </div>
  )
}
