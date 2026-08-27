import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { t } from '@/i18n/fr'

interface SubPageProps {
  title: string
  /** Where the back arrow goes. The rubric list returns home, a rubric returns to it. */
  backTo: string
  children: React.ReactNode
}

/**
 * The frame every sub-page shares: a back arrow and a title, then a column of
 * cards. Sub-pages exist so a screen holds one subject at a time instead of
 * stacking unrelated cards on a single scroll (handoff de refonte).
 *
 * They sit outside the four tabs, so the back arrow is the only way up — the
 * nav bar has no entry for them.
 */
export function SubPage({ title, backTo, children }: SubPageProps) {
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
