import { useCallback } from 'react'
import { hapticTrigger } from 'ios-haptics'
import { useSettingsStore } from '@/stores/settingsStore'

/**
 * Haptics, in the two shapes the platforms allow.
 *
 * Android exposes `navigator.vibrate`, so a confirmation can be fired from
 * anywhere — including after an async write, once the record actually exists.
 * iOS Safari exposes nothing of the sort: the only vibration a web page can
 * reach is the one Safari plays when a `<input type="checkbox" switch>` is
 * toggled, which means it happens on the user's tap and cannot be triggered
 * from code. `ios-haptics` lays such a switch, invisible, over the element that
 * is about to be tapped; `useHaptic` is that, wired as a React ref.
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

/** The overlay is ours to recognise: the library gives it no mark of its own. */
const TRIGGER_ATTRIBUTE = 'data-haptic-trigger'

function existingTrigger(element: HTMLElement): HTMLElement | null {
  return element.querySelector<HTMLElement>(`[${TRIGGER_ATTRIBUTE}]`)
}

/**
 * Lays the switch over `element`, at most once.
 *
 * The library appends a fresh input on every call and React calls a ref again
 * on every remount — StrictMode alone doubles it — so a second overlay would
 * stack on the first for the life of the screen.
 */
function attach(element: HTMLElement): void {
  if (existingTrigger(element)) return
  // The library forces `position: relative` so its overlay has something to
  // anchor to. On an element that already places itself — the fixed quick
  // action, an absolute close button — that inline style wins over the class
  // and drops it back into the flow, so it is put back afterwards. An element
  // already positioned anchors the overlay just as well.
  const positioned = getComputedStyle(element).position !== 'static'
  hapticTrigger(element)
  if (positioned) element.style.position = ''
  const input = element.lastElementChild
  if (!(input instanceof HTMLElement)) return
  input.setAttribute(TRIGGER_ATTRIBUTE, '')
  // Invisible to the reader of the page and to the reader of the accessibility
  // tree alike: it is a vibration, not a control, and it sits inside a button
  // that already says what it does.
  input.setAttribute('aria-hidden', 'true')
  input.tabIndex = -1
}

function detach(element: HTMLElement): void {
  existingTrigger(element)?.remove()
}

/**
 * A ref for any element whose tap deserves a vibration on iOS.
 *
 * The ref holds no state, so one call covers every button in a component —
 * including a list rendered from a `map`, where a hook per row is impossible.
 *
 * Toggling the setting re-runs it because the flag is a dependency: React drops
 * the old ref, which removes the overlay, then applies the new one.
 *
 * @example <button ref={useHaptic()}>…</button>
 */
export function useHaptic<T extends HTMLElement>(): (element: T | null) => void {
  const on = useSettingsStore((state) => state.settings.hapticsEnabled)

  return useCallback(
    (element: T | null) => {
      if (element === null) return
      if (on) attach(element)
      else detach(element)
    },
    [on],
  )
}
