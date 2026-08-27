import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { t } from '@/i18n/fr'

interface SettingsPageProps {
  title: string
  /** Where the back arrow goes. The rubric list returns home, a rubric returns to it. */
  backTo: string
  children: React.ReactNode
}

/**
 * The frame every settings screen shares: a back arrow and a title, then a
 * column of cards. Sub-pages exist so a rubric holds one subject at a time
 * instead of eleven cards competing on one scroll (handoff de refonte).
 */
export function SettingsPage({ title, backTo, children }: SettingsPageProps) {
  return (
    <>
      <header className="flex items-center gap-2 px-2 pb-2 pt-[calc(1rem+env(safe-area-inset-top))]">
        <Link
          to={backTo}
          aria-label={t.onboarding.back}
          className="flex h-touch w-touch items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft size={22} aria-hidden />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </header>

      <div className="flex flex-col gap-3 px-4">{children}</div>
    </>
  )
}
