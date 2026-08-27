import { UpdatePrompt } from 'recompos'

// The shim behind `virtual:pwa-register/react` reads this flag, so the banner
// renders the way it would after a real service-worker update.
if (typeof window !== 'undefined') window.__DS_PWA_NEED_REFRESH__ = true

/**
 * The banner is `position: fixed` to the top of the screen; the frame's own
 * transform makes it the containing block so the banner stays in the card.
 */
export function Default() {
  return (
    <div
      className="relative h-[200px] w-full overflow-hidden rounded-lg border border-border bg-background"
      style={{ transform: 'translateZ(0)' }}
    >
      <p className="px-4 pt-28 text-sm text-muted-foreground">Contenu de l’écran</p>
      <UpdatePrompt />
    </div>
  )
}
