import { BottomNav } from 'recompos'

/**
 * The bar is `position: fixed`. A frame with its own transform becomes the
 * containing block for it, so the card shows the bar sitting at the bottom of a
 * phone-shaped screen instead of pinned to the edge of the cell.
 */
export function Default() {
  return (
    <div
      className="relative h-[200px] w-full overflow-hidden rounded-lg border border-border bg-background"
      style={{ transform: 'translateZ(0)' }}
    >
      <p className="p-4 text-sm text-muted-foreground">Contenu de l’écran</p>
      <BottomNav />
    </div>
  )
}
