import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '@/components/ui/button'
import { t } from '@/i18n/fr'

/**
 * A new service worker never reloads the page on its own: doing so mid-entry
 * would throw away whatever the user was typing (PRD §11).
 */
export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
      <p className="text-sm">{t.pwa.updateAvailable}</p>
      <div className="flex shrink-0 gap-2">
        <Button variant="ghost" onClick={() => setNeedRefresh(false)}>
          {t.pwa.dismiss}
        </Button>
        <Button onClick={() => void updateServiceWorker(true)}>{t.pwa.reload}</Button>
      </div>
    </div>
  )
}
