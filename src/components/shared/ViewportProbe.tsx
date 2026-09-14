import { useEffect, useState } from 'react'
import { useUiStore } from '@/stores/uiStore'

/**
 * Temporary. What the phone actually reports about its own viewport.
 *
 * The nav capsule rests at three different heights depending on the screen —
 * 30, 44 and 90px off the bottom edge, measured on screenshots — and nothing in
 * the app's CSS varies between those screens. Chromium reproduces none of it,
 * so the numbers have to be read where the fault is. Delete this file, its
 * toggle and its store flag once the cause is known.
 */
interface Readings {
  standalone: boolean
  innerHeight: number
  visualHeight: number | null
  visualOffsetTop: number | null
  scrollY: number
  scrollHeight: number
  scrolls: boolean
  safeBottom: number
  navGap: number | null
}

function read(): Readings {
  // `env()` has no JS accessor: a probe element is the only way to see the
  // number the engine resolved.
  const probe = document.createElement('div')
  probe.style.cssText = 'position:fixed;height:env(safe-area-inset-bottom);visibility:hidden'
  document.body.appendChild(probe)
  const safeBottom = Math.round(probe.getBoundingClientRect().height)
  probe.remove()

  const nav = document.querySelector('nav[aria-label="Navigation principale"]')
  const navRect = nav?.getBoundingClientRect() ?? null

  return {
    standalone: window.matchMedia('(display-mode: standalone)').matches,
    innerHeight: window.innerHeight,
    visualHeight: window.visualViewport ? Math.round(window.visualViewport.height) : null,
    visualOffsetTop: window.visualViewport ? Math.round(window.visualViewport.offsetTop) : null,
    scrollY: Math.round(window.scrollY),
    scrollHeight: document.documentElement.scrollHeight,
    scrolls: document.documentElement.scrollHeight > window.innerHeight + 1,
    safeBottom,
    navGap: navRect ? Math.round(window.innerHeight - navRect.bottom) : null,
  }
}

export function ViewportProbe() {
  const on = useUiStore((state) => state.viewportProbe)
  const [readings, setReadings] = useState<Readings | null>(null)

  useEffect(() => {
    if (!on) return
    const update = () => setReadings(read())
    update()
    // Every event that could move a fixed element, plus a slow tick for the
    // ones that move it without firing anything at all.
    const timer = window.setInterval(update, 500)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    window.visualViewport?.addEventListener('resize', update)
    window.visualViewport?.addEventListener('scroll', update)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('scroll', update)
    }
  }, [on])

  if (!on || !readings) return null

  const rows: Array<[string, string]> = [
    ['standalone', String(readings.standalone)],
    ['innerH', String(readings.innerHeight)],
    ['visualH', String(readings.visualHeight)],
    ['visualTop', String(readings.visualOffsetTop)],
    ['scrollY', String(readings.scrollY)],
    ['scrollH', String(readings.scrollHeight)],
    ['scrolls', String(readings.scrolls)],
    ['safeBottom', String(readings.safeBottom)],
    ['navGap', String(readings.navGap)],
  ]

  return (
    <div
      className="tnum pointer-events-none fixed inset-x-2 bottom-[calc(var(--nav-clearance)+0.5rem)] z-50 rounded-lg border border-primary/40 bg-black/85 p-2 text-[11px] leading-tight text-primary"
      aria-hidden
    >
      <div className="grid grid-cols-3 gap-x-3 gap-y-0.5">
        {rows.map(([key, value]) => (
          <span key={key}>
            {key} <span className="text-foreground">{value}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
