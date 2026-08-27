import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Progress } from '@/components/ui/progress'

interface SummaryRowProps {
  to: string
  label: string
  /** Right-hand figure. A second, muted half reads as the denominator. */
  value: string
  valueSuffix?: string
  progress?: { value: number; max: number }
}

/**
 * A number owned by another screen, shown here read-only.
 *
 * Today used to carry the protein log and the consistency scores in full,
 * which meant two screens could disagree. These rows only read and link.
 */
export function SummaryRow({ to, label, value, valueSuffix, progress }: SummaryRowProps) {
  return (
    <Link
      to={to}
      className="flex min-h-[56px] flex-col justify-center gap-2 border-b border-border py-2 transition-colors hover:bg-accent"
    >
      <span className="flex items-center gap-3">
        <span className="flex-1 text-sm text-muted-foreground">{label}</span>
        <span className="tnum text-[15px] font-semibold">
          {value}
          {valueSuffix ? (
            <span className="font-normal text-muted-foreground">{valueSuffix}</span>
          ) : null}
        </span>
        <ChevronRight size={18} className="shrink-0 text-muted-foreground" aria-hidden />
      </span>
      {progress ? (
        <Progress value={progress.value} max={progress.max} label={label} className="h-1" />
      ) : null}
    </Link>
  )
}
