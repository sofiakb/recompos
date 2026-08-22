import { Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart } from '@/components/charts/LineChart'
import type { WaistState } from '@/features/trends/useWaist'
import { parseIsoDate } from '@/lib/date'
import { t } from '@/i18n/fr'

interface WaistCardProps {
  waist: WaistState
  onLog: () => void
}

function shortDate(date: string): string {
  return parseIsoDate(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function trendLabel(change: number | null): string | null {
  if (change === null) return null
  if (change === 0) return t.waist.trendFlat
  return change < 0 ? t.waist.trendDown(Math.abs(change)) : t.waist.trendUp(change)
}

export function WaistCard({ waist, onLog }: WaistCardProps) {
  const trend = trendLabel(waist.totalChangeCm)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.waist.title}</CardTitle>
        <CardDescription>{t.waist.hint}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {waist.latest ? (
          <div className="flex items-baseline justify-between">
            <span className="tnum text-3xl font-semibold">{waist.latest.waistCm} cm</span>
            {trend ? <span className="text-sm text-muted-foreground">{trend}</span> : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t.waist.empty}</p>
        )}

        {waist.seriesCm.length > 1 ? (
          <LineChart
            ariaLabel={t.waist.title}
            points={waist.seriesCm.map((value, index) => ({
              label: shortDate(waist.seriesDates[index]),
              value,
            }))}
            overlay={waist.smoothedCm}
            formatValue={(value) => `${Math.round(value)}`}
          />
        ) : null}

        <Button variant="outline" block onClick={onLog}>
          <Ruler size={18} aria-hidden />
          {t.waist.logCta}
        </Button>
      </CardContent>
    </Card>
  )
}
