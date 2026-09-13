import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { t } from '@/i18n/fr'

interface ScreenHeaderProps {
  title: string
  /** Small uppercase line above the title — the date, on the daily screens. */
  eyebrow?: string
  subtitle?: string
  showSettings?: boolean
}

export function ScreenHeader({
  title,
  eyebrow,
  subtitle,
  showSettings = false,
}: ScreenHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4 px-4 pb-2 pt-[calc(1rem+env(safe-area-inset-top))]">
      <div>
        {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">{title}</h1>
        {subtitle ? <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {showSettings ? (
        <Link
          to="/settings"
          aria-label={t.nav.settings}
          className="flex h-touch w-touch shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Settings size={22} aria-hidden />
        </Link>
      ) : null}
    </header>
  )
}
