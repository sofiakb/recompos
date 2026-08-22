import { useEffect } from 'react'
import { useUiStore } from '@/stores/uiStore'

export function Toast() {
  const toast = useUiStore((state) => state.toast)
  const dismiss = useUiStore((state) => state.dismissToast)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(dismiss, toast.durationMs)
    return () => window.clearTimeout(timer)
  }, [toast, dismiss])

  if (!toast) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4"
    >
      <div className="flex animate-slide-up items-center gap-3 rounded-full border border-border bg-card py-2 pl-4 pr-2 shadow-lg">
        <p className="text-sm">{toast.message}</p>
        {toast.action ? (
          <button
            type="button"
            onClick={async () => {
              await toast.action?.run()
              dismiss()
            }}
            className="min-h-[36px] rounded-full px-3 text-sm font-semibold text-primary transition-colors active:bg-accent"
          >
            {toast.action.label}
          </button>
        ) : null}
      </div>
    </div>
  )
}
