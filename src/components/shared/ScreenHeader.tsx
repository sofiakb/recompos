import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { t } from '@/i18n/fr'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  showSettings?: boolean
}

export function ScreenHeader({ title, subtitle, showSettings = false }: ScreenHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4 px-4 pb-2 pt-[calc(1rem+env(safe-area-inset-top))]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {showSettings ? (
        <Link
          to="/settings"
          aria-label={t.nav.settings}
          className="h-touch w-touch flex shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Settings size={22} aria-hidden />
        </Link>
      ) : null}
    </header>
  )
}
