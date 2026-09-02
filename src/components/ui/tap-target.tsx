import { forwardRef, useCallback } from 'react'
import { useHaptic } from '@/lib/haptics'

export type TapTargetProps = React.ButtonHTMLAttributes<HTMLButtonElement>

/**
 * A bare `<button>` that carries the haptic. No styling, no variants.
 *
 * `Button` covers the app's styled buttons, but most taps are not those: a
 * checklist row, a chip, a close cross, a delete icon. They stay plain elements
 * with their own classes — and on iOS the vibration has to be laid on the
 * element *before* the tap (see `@/lib/haptics`), which a call in the handler
 * cannot do. So the element itself becomes the thing that carries it.
 *
 * Every tap target in the app is one of these, `Button` included. A plain
 * `<button>` in the tree means the haptic was forgotten — with one deliberate
 * exception, the drag handle in `HabitRow`, whose pointer events are its whole
 * purpose and which nothing should sit on top of.
 */
export const TapTarget = forwardRef<HTMLButtonElement, TapTargetProps>(
  ({ type = 'button', disabled, ...props }, ref) => {
    const hapticRef = useHaptic<HTMLButtonElement>({ disabled })

    // Both refs want the same node, and only one `ref` attribute exists.
    const setRef = useCallback(
      (node: HTMLButtonElement | null) => {
        hapticRef(node)
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [hapticRef, ref],
    )

    return <button ref={setRef} type={type} disabled={disabled} {...props} />
  },
)
TapTarget.displayName = 'TapTarget'
