import { Scale, TrendingDown, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WeightSparkline } from '@/features/weight/WeightSparkline'
import { formatLongDate } from '@/lib/date'
import { t } from '@/i18n/fr'
import type { WeightState } from '@/features/weight/useWeight'

interface WeightCardProps {
  weight: WeightState
  onLog: () => void
}

export function WeightCard({ weight, onLog }: WeightCardProps) {
  const series = [...weight.entries].reverse().map((entry) => entry.weightKg as number)
  const TrendIcon = (weight.trendKg ?? 0) < 0 ? TrendingDown : TrendingUp

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.weight.title}</CardTitle>
        <CardDescription>
          {weight.hasWeight ? t.weight.smoothedHint : t.weight.emptyHint}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {weight.hasWeight ? (
          <>
            <div className="flex items-end justify-between gap-3">
              <p className="tnum">
                <span className="text-3xl font-semibold">{weight.smoothedKg}</span>
                <span className="ml-1 text-sm text-muted-foreground">kg</span>
              </p>
              {weight.trendKg !== null && weight.trendKg !== 0 ? (
                <p className="tnum flex items-center gap-1 text-sm text-muted-foreground">
                  <TrendIcon size={16} aria-hidden />
                  {weight.trendKg > 0 ? '+' : ''}
                  {weight.trendKg} kg
                </p>
              ) : null}
            </div>

            <WeightSparkline values={series} className="h-8 w-full" />

            <p className="text-xs text-muted-foreground">
              {t.weight.lastEntry(formatLongDate(weight.latest!.date), weight.latest!.weightKg!)}
            </p>
          </>
        ) : null}

        <Button variant={weight.hasWeight ? 'outline' : 'primary'} block onClick={onLog}>
          <Scale size={18} aria-hidden />
          {t.weight.logCta}
        </Button>
      </CardContent>
    </Card>
  )
}
