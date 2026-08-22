import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

/**
 * Bottom sheet, hand-rolled rather than pulled from Radix: it is the only
 * overlay V1 needs, and the shell budget (PRD §4) does not have room to spare.
 */
export function Sheet({ open, onClose, title, children, className }: SheetProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Fermer"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full animate-slide-up rounded-t-2xl border-t border-border bg-card p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]',
          className,
        )}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted" />
        {title ? <h2 className="mb-3 text-base font-semibold">{title}</h2> : null}
        {children}
      </div>
    </div>
  )
}
