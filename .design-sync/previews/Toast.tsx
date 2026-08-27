import { Toast, useUiStore } from 'recompos'

/**
 * ONE cell only, deliberately. `Toast` reads the singleton ui store, so two
 * cells side by side would both show whichever message was staged last — two
 * identical cards claiming to be different variants. The undo shape is the
 * superset: message plus action button.
 *
 * The store is seeded at MODULE scope, before React mounts. Seeding inside the
 * component body is too late: `Toast` has already taken its store snapshot for
 * that render pass, and zustand notifying mid-render doesn't schedule another —
 * the card comes out empty. The duration is far longer than the screenshot so
 * the toast never auto-dismisses.
 */
useUiStore.setState({
  toast: {
    id: 1,
    message: 'Repas supprimé',
    durationMs: 10 ** 7,
    action: { label: 'Annuler', run: () => {} },
  },
})

/**
 * The frame's own transform is what keeps the `position: fixed` toast inside the
 * card rather than pinned to the bottom of the cell.
 */
export function WithUndo() {
  return (
    <div
      className="relative h-[200px] w-full overflow-hidden rounded-lg border border-border bg-background"
      style={{ transform: 'translateZ(0)' }}
    >
      <Toast />
    </div>
  )
}
