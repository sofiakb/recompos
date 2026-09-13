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
 *
 * The label carries the same weight as the figure: they are one sentence read
 * left to right (« Protéines — 0 / 135 g »), not a caption over a value. Muted
 * and small, the label turned the row into a grey slab with a number parked in
 * the corner.
 */
export function SummaryRow({ to, label, value, valueSuffix, progress }: SummaryRowProps) {
  return (
    <Link
      to={to}
      className="lit-surface flex flex-col justify-center gap-2.5 rounded-lg border border-border/70 px-4 py-3.5 transition-[filter] hover:brightness-125"
    >
      <span className="flex items-center gap-3">
        <span className="flex-1 text-[15px] font-medium">{label}</span>
        <span className="figure text-[15px] font-semibold">
          {value}
          {valueSuffix ? (
            <span className="font-normal text-muted-foreground">{valueSuffix}</span>
          ) : null}
        </span>
        <ChevronRight size={16} className="shrink-0 text-muted-foreground/70" aria-hidden />
      </span>
      {/*
        A 3px track rather than 1px: at 1px an empty bar was a hairline that
        read as a stray rule under the text, and a full one was barely a bar.
      */}
      {progress ? (
        <Progress value={progress.value} max={progress.max} label={label} className="h-[3px]" />
      ) : null}
    </Link>
  )
}
