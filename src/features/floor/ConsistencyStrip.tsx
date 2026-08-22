import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { t } from '@/i18n/fr'
import type { ConsistencyScore } from '@/lib/consistency'

interface ConsistencyStripProps {
  score7: ConsistencyScore
  score30: ConsistencyScore
}

function Score({ label, score }: { label: string; score: ConsistencyScore }) {
  return (
    <div className="flex-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="tnum text-lg font-semibold">{score.percent}%</span>
      </div>
      <Progress value={score.percent} label={label} className="mt-1.5 h-1.5" />
      <p className="mt-1 text-[11px] text-muted-foreground">{t.consistency.band[score.band]}</p>
    </div>
  )
}

/**
 * Rolling percentages, never a streak — a missed week bends the number instead
 * of resetting it (PRD §6.1).
 */
export function ConsistencyStrip({ score7, score30 }: ConsistencyStripProps) {
  return (
    <Card className="flex gap-6 p-4">
      <Score label={t.consistency.rolling7} score={score7} />
      <Score label={t.consistency.rolling30} score={score30} />
    </Card>
  )
}
