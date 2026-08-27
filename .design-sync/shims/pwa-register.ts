/**
 * design-sync shim for Vite's `virtual:pwa-register/react`, which only exists
 * inside a Vite build. Outside the app, UpdatePrompt still needs a hook shape
 * to bundle against.
 *
 * There is no service worker behind a preview, so the "an update is waiting"
 * state is driven by a global flag a preview can set before it renders —
 * otherwise the banner is permanently `null` and its card is blank.
 */
import { useState } from 'react'

declare global {
  interface Window {
    __DS_PWA_NEED_REFRESH__?: boolean
  }
}

export function useRegisterSW(): {
  needRefresh: [boolean, (v: boolean) => void]
  offlineReady: [boolean, (v: boolean) => void]
  updateServiceWorker: (reload?: boolean) => Promise<void>
} {
  const needRefresh = useState(
    typeof window !== 'undefined' && window.__DS_PWA_NEED_REFRESH__ === true,
  )
  const offlineReady = useState(false)
  return {
    needRefresh: needRefresh as [boolean, (v: boolean) => void],
    offlineReady: offlineReady as [boolean, (v: boolean) => void],
    updateServiceWorker: async () => {},
  }
}
