import { cva } from 'class-variance-authority'

/**
 * Buttons are pills. The primary one carries the accent gradient and its halo —
 * on a near-black page it is the only lit surface, which is what makes "the one
 * thing to do next" readable without any other emphasis.
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-[transform,background-color,box-shadow,opacity] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  {
    variants: {
      variant: {
        primary: 'lit-accent lit-glow text-primary-foreground hover:brightness-[1.06]',
        secondary:
          'lit-surface text-secondary-foreground hover:brightness-125 border border-border/70',
        outline: 'border border-border bg-transparent hover:bg-accent',
        ghost: 'bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        // 48px is the PRD's minimum touch target; nothing tappable goes below it.
        default: 'min-h-touch px-5 py-3',
        lg: 'min-h-[56px] px-6 text-base',
        icon: 'h-touch w-touch',
      },
      block: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'default', block: false },
  },
)
