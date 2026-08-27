interface TrendSectionProps {
  title: string
  hint?: string
  /** Right-hand figure on the title line — a delta, usually. */
  aside?: React.ReactNode
  children: React.ReactNode
}

/**
 * One measure per section, flat on the page.
 *
 * Progression used to be six cards of equal weight, which made « how am I
 * doing » a scroll through six boxes rather than a read.
 */
export function TrendSection({ title, hint, aside, children }: TrendSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          {title}
        </h2>
        {aside ? (
          <span className="tnum shrink-0 text-sm text-muted-foreground">{aside}</span>
        ) : null}
      </div>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </section>
  )
}
