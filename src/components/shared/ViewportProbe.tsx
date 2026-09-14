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
  innerHeight: number
  innerWidth: number
  /** 1 unless the page is zoomed — which would shrink the viewport in CSS px. */
  scale: number | null
  dpr: number
  screenHeight: number
  /** The html box. Short of `innerHeight` means the window shrank under it. */
  clientHeight: number
  visualHeight: number | null
  scrollHeight: number
  scrolls: boolean
  safeTop: number
  safeBottom: number
  /** What the docked elements measure from — has to be the full screen everywhere. */
  vh: number
  navGap: number | null
}

/** `env()` and `vh` have no JS accessor: a witness element is the only way to read one. */
function readHeight(height: string): number {
  const probe = document.createElement('div')
  probe.style.cssText = `position:fixed;height:${height};visibility:hidden`
  document.body.appendChild(probe)
  const value = Math.round(probe.getBoundingClientRect().height)
  probe.remove()
  return value
}

function readSafeArea(side: 'top' | 'bottom'): number {
  return readHeight(`env(safe-area-inset-${side})`)
}

function read(): Readings {
  const nav = document.querySelector('nav[aria-label="Navigation principale"]')
  const navRect = nav?.getBoundingClientRect() ?? null

  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    scale: window.visualViewport ? Math.round(window.visualViewport.scale * 1000) / 1000 : null,
    dpr: window.devicePixelRatio,
    screenHeight: window.screen.height,
    clientHeight: document.documentElement.clientHeight,
    visualHeight: window.visualViewport ? Math.round(window.visualViewport.height) : null,
    scrollHeight: document.documentElement.scrollHeight,
    scrolls: document.documentElement.scrollHeight > window.innerHeight + 1,
    safeTop: readSafeArea('top'),
    safeBottom: readSafeArea('bottom'),
    vh: readHeight('100vh'),
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
    // The three that tell a zoomed page from a shrunken window apart: under
    // zoom the width and the ratio move with the height; under a resize they
    // do not.
    ['innerH', String(readings.innerHeight)],
    ['innerW', String(readings.innerWidth)],
    ['scale', String(readings.scale)],
    ['dpr', String(readings.dpr)],
    ['screenH', String(readings.screenHeight)],
    ['clientH', String(readings.clientHeight)],
    ['visualH', String(readings.visualHeight)],
    ['scrollH', String(readings.scrollHeight)],
    ['scrolls', String(readings.scrolls)],
    ['safeTop', String(readings.safeTop)],
    ['safeBottom', String(readings.safeBottom)],
    ['100vh', String(readings.vh)],
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
