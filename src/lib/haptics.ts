import { useCallback } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'

/**
 * Haptics, in the two shapes the platforms allow.
 *
 * Android exposes `navigator.vibrate`, so a confirmation can be fired from
 * anywhere — including after an async write, once the record actually exists.
 * iOS Safari exposes nothing of the sort. The only vibration a web page can
 * reach there is the one Safari plays when a `<input type="checkbox" switch>`
 * is toggled, which happens on the user's tap and cannot be triggered from
 * code: a synthetic `.click()` on the switch toggles it in silence. Measured on
 * an iPhone, not assumed.
 *
 * So a button gets its feedback from `useHaptic` on iOS and from `haptic()` on
 * Android, and the two never both fire: `haptic()` returns early wherever
 * `navigator.vibrate` is missing, which is exactly where the switch works.
 */

/** The single gate — read from the store rather than passed in, so no call site can forget it. */
function enabled(): boolean {
  return useSettingsStore.getState().settings.hapticsEnabled
}

/** Short, non-blocking confirmation on a completed action. No-op where unsupported. */
export function haptic(durationMs = 30): void {
  if (!enabled()) return
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate?.(durationMs)
  }
}

const PART = 'data-haptic'
const POSITIONED = 'data-haptic-positioned'

let sequence = 0

/**
 * Lays the switch on `element`, at most once.
 *
 * The switch itself never sees the finger. `ios-haptics` stretches it over the
 * whole element, and that shipped once: a Safari switch claims the drag it
 * needs to be flicked, so every list in the app stopped scrolling. What the
 * finger touches here is a `<label for>` — inert to a pan, and enough to
 * activate the switch on a tap, because a label forwards a *native* activation
 * where `.click()` only forwards a synthetic one. Both were measured on the
 * device; the label is the only shape that scrolls and vibrates at once.
 */
function attach(element: HTMLElement): void {
  if (element.querySelector(`[${PART}]`)) return

  const id = `haptic-${++sequence}`
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.setAttribute('switch', '')
  input.id = id
  input.tabIndex = -1
  // Invisible to the reader of the page and to the reader of the accessibility
  // tree alike: it is a vibration, not a control, and it sits inside a button
  // that already says what it does.
  input.setAttribute('aria-hidden', 'true')
  input.setAttribute(PART, '')
  // The label forwards the tap to the switch, and the switch's own click would
  // then bubble back into the button the switch sits in — firing every handler
  // twice, logging a meal twice. The tap the app must see is the label's.
  input.addEventListener('click', (event) => event.stopPropagation())
  Object.assign(input.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '0',
    opacity: '0',
    pointerEvents: 'none',
  })

  const label = document.createElement('label')
  label.htmlFor = id
  label.setAttribute('aria-hidden', 'true')
  label.setAttribute(PART, '')
  Object.assign(label.style, { position: 'absolute', inset: '0', cursor: 'pointer' })

  // Only when the element places itself statically: forcing `relative` on a
  // fixed quick action or an absolute close cross would drop it into the flow.
  const position = getComputedStyle(element).position
  if (!position || position === 'static') {
    element.style.position = 'relative'
    element.setAttribute(POSITIONED, '')
  }

  element.append(input, label)
}

function detach(element: HTMLElement): void {
  for (const part of element.querySelectorAll(`[${PART}]`)) part.remove()
  if (element.hasAttribute(POSITIONED)) {
    element.style.position = ''
    element.removeAttribute(POSITIONED)
  }
}

interface HapticOptions {
  /** A dead control must not answer. Also re-runs the ref when it flips. */
  disabled?: boolean
}

/**
 * A ref for any element whose tap deserves a vibration on iOS.
 *
 * The ref holds no state, so one call covers every element in a component —
 * including a list rendered from a `map`, where a hook per row is impossible.
 *
 * Toggling the setting, or disabling the control, re-runs it because both are
 * dependencies: React drops the old ref, which removes the parts, then applies
 * the new one.
 *
 * @example <button ref={useHaptic()}>…</button>
 */
export function useHaptic<T extends HTMLElement>({ disabled = false }: HapticOptions = {}): (
  element: T | null,
) => void {
  const on = useSettingsStore((state) => state.settings.hapticsEnabled)

  return useCallback(
    (element: T | null) => {
      if (element === null) return
      if (on && !disabled) attach(element)
      else detach(element)
    },
    [on, disabled],
  )
}
