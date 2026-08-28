import { forwardRef, useCallback, useLayoutEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Shared skin, without a height: `min-h-touch` used to live here, and
 * tailwind-merge cannot fold a named scale value into an arbitrary one, so
 * every `min-h-[…]` a textarea asked for lost to it silently. Each field
 * states its own height now.
 */
const field =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50'

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(field, 'min-h-touch', className)} {...props} />
  ),
)
Input.displayName = 'Input'

/**
 * Grows with what is typed, rather than hiding it behind a scrollbar.
 *
 * These boxes take sentences dictated one-handed — a dish, a correction to an
 * estimate — and on a phone there is no resize handle to drag: iOS ignores
 * `resize` entirely. A fixed height meant the first lines scrolled out of sight
 * exactly when the person wanted to re-read them before submitting.
 */
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, onInput, value, ...props }, ref) => {
  const node = useRef<HTMLTextAreaElement | null>(null)

  const fit = useCallback(() => {
    const element = node.current
    if (!element) return
    // Back to `auto` first, so shrinking is measured as well as growing.
    element.style.height = 'auto'
    // jsdom reports 0 here; leaving `auto` in place keeps the min-height.
    if (element.scrollHeight === 0) return
    // `scrollHeight` is the content box, `height` the border box: the two rules
    // differ by the border, and forgetting it clips the last line by a hair.
    const borders = element.offsetHeight - element.clientHeight
    element.style.height = `${element.scrollHeight + borders}px`
  }, [])

  // Layout, not effect: the box is already the right size on the first paint.
  useLayoutEffect(fit, [fit, value])

  return (
    <textarea
      ref={(element) => {
        node.current = element
        if (typeof ref === 'function') ref(element)
        else if (ref) ref.current = element
      }}
      value={value}
      onInput={(event) => {
        fit()
        onInput?.(event)
      }}
      className={cn(field, 'min-h-[80px] resize-none overflow-hidden', className)}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'
