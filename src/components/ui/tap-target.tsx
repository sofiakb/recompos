import { forwardRef } from 'react'

export type TapTargetProps = React.ButtonHTMLAttributes<HTMLButtonElement>

/**
 * The app's tap target. A plain `<button>` today.
 *
 * It was introduced to carry the iOS haptic, which can only be had by laying a
 * `<input type="checkbox" switch>` over the element and letting Safari play its
 * own feedback when the finger toggles it. That overlay covers the whole
 * button, and a Safari switch claims the drag gesture it needs to be flicked —
 * so on every full-width button in a scrollable list, which is most of this
 * app, the page stopped scrolling. A vibration is not worth an app you cannot
 * scroll.
 *
 * The seam stays: `useHaptic` in `@/lib/haptics` still works, and if the
 * overlay is ever made to let a vertical pan through, this is the one file that
 * has to change. `haptic()` is untouched and still fires on Android.
 */
export const TapTarget = forwardRef<HTMLButtonElement, TapTargetProps>(
  ({ type = 'button', ...props }, ref) => <button ref={ref} type={type} {...props} />,
)
TapTarget.displayName = 'TapTarget'
