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

/**
 * A capsule floating above the bottom edge, not a bar welded to it.
 *
 * Detaching it is what lets the page keep going underneath: the blurred glass
 * shows the list scrolling past on both sides, so the app reads as one surface
 * with a control on top rather than as two stacked panels. The active tab is a
 * lit pill wrapping the icon *and* its label — one shape says where you are,
 * instead of a colour the label has to repeat.
 */
export function BottomNav() {
  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 px-4"
    >
      <ul className="mx-auto flex max-w-md items-center gap-1 rounded-full border border-border/70 bg-card/55 p-1 shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.06),0_10px_30px_-12px_hsl(0_0%_0%/0.9)] backdrop-blur-2xl backdrop-saturate-150">
        {TABS.map(({ to, label, Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  // A squircle rather than a capsule: the chip is wider than it is tall, and
                  // a full pill around a two-line stack reads as a button, not as a place.
                  'flex min-h-touch flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1 text-[11px] font-medium transition-[color,background-color,box-shadow] duration-200',
                  isActive
                    ? 'bg-primary/12 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]'
                    : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} aria-hidden />
                  <span className="max-w-full truncate">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
