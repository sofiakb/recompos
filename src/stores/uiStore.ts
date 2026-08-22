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
  toast: Toast | null
  showToast: (message: string, action?: ToastAction, durationMs?: number) => void
  dismissToast: () => void
}

let toastId = 0

export const useUiStore = create<UiState>((set) => ({
  quickActionOpen: false,
  setQuickActionOpen: (open) => set({ quickActionOpen: open }),
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
