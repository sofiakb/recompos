import { NavLink } from 'react-router-dom'
import { Dumbbell, Home, Salad, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { t } from '@/i18n/fr'

// Ordered by how often a day touches them: the plan, then eating, then moving,
// then the long view (handoff de refonte, docs/design).
const TABS = [
  { to: '/', label: t.nav.today, Icon: Home, end: true },
  { to: '/nutrition', label: t.nav.nutrition, Icon: Salad, end: false },
  { to: '/workouts', label: t.nav.workouts, Icon: Dumbbell, end: false },
  { to: '/trends', label: t.nav.trends, Icon: TrendingUp, end: false },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
    >
      <ul className="mx-auto flex max-w-md">
        {TABS.map(({ to, label, Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex min-h-touch flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'flex h-7 w-12 items-center justify-center rounded-full transition-colors duration-200',
                      // A lit pill behind the active icon: the tab bar reads at
                      // a glance without the label having to carry it.
                      isActive && 'bg-primary/12 ring-1 ring-inset ring-primary/25',
                    )}
                  >
                    <Icon size={21} strokeWidth={isActive ? 2.4 : 1.8} aria-hidden />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
