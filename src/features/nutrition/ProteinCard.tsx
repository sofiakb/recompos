import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { t } from '@/i18n/fr'
import type { ProteinState } from '@/features/nutrition/useProtein'
import type { ProteinTargetState } from '@/features/nutrition/useProteinTarget'

interface ProteinCardProps {
  protein: ProteinState
  target: ProteinTargetState
}

export function ProteinCard({ protein, target }: ProteinCardProps) {
  return (
    <Card>
      <CardHeader>
        <Link
          to="/nutrition"
          className="flex items-start justify-between gap-2 rounded-md transition-colors active:bg-accent"
        >
          <span className="flex flex-col">
            <CardTitle>{t.today.proteinTitle}</CardTitle>
            <span className="tnum text-sm text-muted-foreground">
              {t.today.proteinOf(protein.totalGrams, protein.targetGrams)}
            </span>
          </span>
          <ChevronRight size={20} className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Progress
          value={protein.totalGrams}
          max={protein.targetGrams}
          label={t.today.proteinTitle}
          className="h-2.5"
        />
        <p className="text-xs text-muted-foreground">
          {target.mode === 'auto' && target.smoothedWeightKg !== null
            ? t.nutrition.targetFromWeight(target.smoothedWeightKg, target.gramsPerKg)
            : null}
          {target.mode === 'manual' ? t.nutrition.targetManual : null}
          {target.isFallback ? t.nutrition.targetNoWeight : null}
        </p>
        {protein.logs.length > 0 ? (
          <ul className="mt-1 flex flex-col gap-1">
            {protein.logs.map((log) => (
              <li
                key={log.id}
                className="tnum flex items-center justify-between gap-3 text-xs text-muted-foreground"
              >
                <span>{log.note ?? t.nutrition.source[log.sourceType]}</span>
                <span>+{log.grams} g</span>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  )
}
