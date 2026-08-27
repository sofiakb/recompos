import { QuickActionFab } from 'recompos'

/**
 * The floating action button is `position: fixed` above the bottom nav; the
 * frame's own transform makes it the containing block. Closed state only —
 * opening the sheet is an interaction a static screenshot cannot reach.
 */
export function Closed() {
  return (
    <div
      className="relative h-[220px] w-full overflow-hidden rounded-lg border border-border bg-background"
      style={{ transform: 'translateZ(0)' }}
    >
      <p className="p-4 text-sm text-muted-foreground">Contenu de l’écran</p>
      <QuickActionFab />
    </div>
  )
}
