import { useEffect } from 'react'
import { useUiStore } from '@/stores/uiStore'

const DISMISS_AFTER_MS = 2600

export function Toast() {
  const toast = useUiStore((state) => state.toast)
  const dismiss = useUiStore((state) => state.dismissToast)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(dismiss, DISMISS_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [toast, dismiss])

  if (!toast) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4"
    >
      <p className="animate-slide-up rounded-full border border-border bg-card px-4 py-2 text-sm shadow-lg">
        {toast.message}
      </p>
    </div>
  )
}
