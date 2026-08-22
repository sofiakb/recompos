/** Ephemeral UI state. Deliberately not persisted. */
import { create } from 'zustand'

interface UiState {
  quickActionOpen: boolean
  setQuickActionOpen: (open: boolean) => void
  toast: { id: number; message: string } | null
  showToast: (message: string) => void
  dismissToast: () => void
}

let toastId = 0

export const useUiStore = create<UiState>((set) => ({
  quickActionOpen: false,
  setQuickActionOpen: (open) => set({ quickActionOpen: open }),
  toast: null,
  showToast: (message) => set({ toast: { id: ++toastId, message } }),
  dismissToast: () => set({ toast: null }),
}))
