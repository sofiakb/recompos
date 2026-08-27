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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="mx-auto flex max-w-md">
        {TABS.map(({ to, label, Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex min-h-touch flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} aria-hidden />
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
