import { useEffect, useRef, useState } from 'react'
import { NavLink, useMatch } from 'react-router-dom'
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

/** Below this, the page counts as « at the top » and the bar always stands open. */
const TOP_ZONE_PX = 24
/** Movement under this is a thumb resting, not a direction. */
const DIRECTION_THRESHOLD_PX = 8

/**
 * Collapses while reading down, opens again on the way back up.
 *
 * Direction rather than depth: a bar that hides past a fixed offset stays
 * hidden through a long screen, and the way back to another tab is then a
 * scroll to the top. Reading down is the only moment the tabs are certainly
 * not wanted.
 */
function useCollapseOnScroll(): [boolean, (collapsed: boolean) => void] {
  const [collapsed, setCollapsed] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY
    let frame = 0

    const read = () => {
      frame = 0
      const y = window.scrollY
      const moved = y - lastY.current
      if (y <= TOP_ZONE_PX) setCollapsed(false)
      else if (moved > DIRECTION_THRESHOLD_PX) setCollapsed(true)
      else if (moved < -DIRECTION_THRESHOLD_PX) setCollapsed(false)
      // Only a real direction moves the anchor, so a slow drag still adds up to
      // one instead of being eaten a pixel at a time.
      if (Math.abs(moved) > DIRECTION_THRESHOLD_PX) lastY.current = y
    }

    const onScroll = () => {
      // One read per frame: scroll fires far faster than the bar can animate.
      if (frame === 0) frame = window.requestAnimationFrame(read)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [])

  return [collapsed, setCollapsed]
}

interface TabProps {
  to: string
  label: string
  Icon: typeof Home
  end: boolean
  collapsed: boolean
}

/**
 * One tab of the row.
 *
 * A component rather than a branch of the map: the `li` is the flex item the
 * capsule clips and orders, so the row has to know which one is active — and
 * `useMatch` is a hook, which a loop body cannot call.
 */
function Tab({ to, label, Icon, end, collapsed }: Readonly<TabProps>) {
  const active = useMatch({ path: to, end }) !== null

  return (
    <li
      className={cn(
        'transition-opacity duration-200',
        // Collapsed, the active tab takes the one visible slot and the rest is
        // clipped by the capsule rather than unmounted: the links stay in the
        // document, so the tab key and a screen reader still reach every tab.
        collapsed ? (active ? 'order-first flex-none' : 'flex-none opacity-0') : 'flex-1',
      )}
    >
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          cn(
            // The chip has to be concentric with the capsule holding it, or the
            // two curves collide at the ends of the row: the capsule's inner
            // edge has a 28px radius, minus 4px of padding leaves 24 — exactly
            // half of the 48px chip, so the chip is a pill. Any smaller radius
            // (a squircle, say) eats into the capsule's own corner.
            'flex min-h-touch flex-col items-center justify-center gap-0.5 rounded-full px-1 py-1 text-[11px] font-medium transition-[color,background-color,box-shadow] duration-200',
            collapsed && 'w-12',
            isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground',
          )
        }
      >
        {({ isActive }) => (
          <>
            <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} aria-hidden />
            {/* Collapsed, the label leaves the layout but not the accessibility
                tree: the link keeps its name. */}
            <span className={cn('max-w-full truncate', collapsed && 'sr-only')}>{label}</span>
          </>
        )}
      </NavLink>
    </li>
  )
}

/**
 * A capsule floating above the bottom edge, not a bar welded to it.
 *
 * Detaching it is what lets the page keep going underneath: the glass shows
 * the list scrolling past on both sides, so the app reads as one surface with
 * a control on top rather than as two stacked panels. The active tab is a lit
 * pill wrapping the icon *and* its label — one shape says where you are,
 * instead of a colour the label has to repeat.
 *
 * Reading down, it collapses to the active icon alone and gives the screen
 * back; anything that asks for it — scrolling up, a tap, a keyboard focus —
 * opens it again.
 */
export function BottomNav() {
  const [collapsed, setCollapsed] = useCollapseOnScroll()

  return (
    <nav
      aria-label="Navigation principale"
      data-collapsed={collapsed}
      className="dock pointer-events-none fixed inset-x-0 z-40 px-4 [--dock:var(--nav-inset)]"
      // A tap anywhere on the bar opens it: the collapsed chip is the tab you
      // are already on, so the tap costs nothing if it also navigates.
      onPointerDown={() => setCollapsed(false)}
      // Keyboard focus never comes with a scroll, so it has to open the bar
      // itself — otherwise tabbing lands on links clipped out of the capsule.
      onFocus={() => setCollapsed(false)}
    >
      <ul
        className={cn(
          'pointer-events-auto flex items-center gap-1 overflow-hidden rounded-full border border-border/70 bg-card/55 p-1 shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.06),0_10px_30px_-12px_hsl(0_0%_0%/0.9)] backdrop-blur-2xl backdrop-saturate-150 transition-[max-width] duration-300 ease-out',
          // max-width rather than width: open, the bar keeps sizing itself from
          // the column it sits in, and only the ceiling is animated.
          //
          // 58px is the height the capsule already has — the 48px touch target
          // plus 4px of padding and 1px of border on each side. Anything less
          // and `border-box` takes the difference out of the chip, which then
          // gets clipped on one side: at 56px the collapsed bar was a 56×58
          // oval with its icon a pixel off centre.
          collapsed ? 'mr-auto max-w-[3.625rem]' : 'mx-auto max-w-md',
        )}
      >
        {TABS.map((tab) => (
          <Tab key={tab.to} {...tab} collapsed={collapsed} />
        ))}
      </ul>
    </nav>
  )
}
