/** Ephemeral UI state. Deliberately not persisted. */
import { create } from 'zustand'

export interface ToastAction {
  label: string
  run: () => void | Promise<void>
}

export interface Toast {
  id: number
  message: string
  action?: ToastAction
  /** Undo toasts stay long enough to be reachable with one hand. */
  durationMs: number
}

const DEFAULT_TOAST_MS = 2600
export const UNDO_TOAST_MS = 10_000

interface UiState {
  quickActionOpen: boolean
  setQuickActionOpen: (open: boolean) => void
  /**
   * Set by the quick-action sheet so the workouts screen opens its set logger on
   * arrival. A flag rather than router state: it survives the tab being already
   * mounted, which router state does not.
   */
  microSetRequested: boolean
  requestMicroSet: () => void
  clearMicroSet: () => void
  toast: Toast | null
  showToast: (message: string, action?: ToastAction, durationMs?: number) => void
  dismissToast: () => void
  /**
   * Temporary: shows what the browser reports about the viewport, so a layout
   * that only misbehaves on a real phone can be read there instead of guessed
   * at from screenshots. Ephemeral on purpose — it cannot be left on.
   */
  viewportProbe: boolean
  toggleViewportProbe: (on: boolean) => void
}

let toastId = 0

/**
 * The probe's switch, kept in `sessionStorage` rather than in the store alone.
 *
 * iOS reloads a PWA it has pushed out of memory, and a diagnostic that switches
 * itself off between two screenshots is worse than none. Session storage dies
 * with the tab, so it still cannot be left on for good. Never throws: private
 * mode and blocked storage both answer with an exception here.
 */
const PROBE_KEY = 'recompos:viewport-probe'

function readProbeFlag(): boolean {
  try {
    return sessionStorage.getItem(PROBE_KEY) === '1'
  } catch {
    return false
  }
}

function writeProbeFlag(on: boolean): void {
  try {
    if (on) sessionStorage.setItem(PROBE_KEY, '1')
    else sessionStorage.removeItem(PROBE_KEY)
  } catch {
    // A switch that cannot be remembered still works for this session.
  }
}

export const useUiStore = create<UiState>((set) => ({
  quickActionOpen: false,
  setQuickActionOpen: (open) => set({ quickActionOpen: open }),
  viewportProbe: readProbeFlag(),
  toggleViewportProbe: (on) => {
    writeProbeFlag(on)
    set({ viewportProbe: on })
  },
  microSetRequested: false,
  requestMicroSet: () => set({ microSetRequested: true, quickActionOpen: false }),
  clearMicroSet: () => set({ microSetRequested: false }),
  toast: null,
  showToast: (message, action, durationMs) =>
    set({
      toast: {
        id: ++toastId,
        message,
        action,
        durationMs: durationMs ?? (action ? UNDO_TOAST_MS : DEFAULT_TOAST_MS),
      },
    }),
  dismissToast: () => set({ toast: null }),
}))
