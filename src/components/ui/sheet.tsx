import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  /** Replaces the grabber and the title, for a sheet with its own header row. */
  header?: React.ReactNode
  /**
   * Anchors the panel below the status bar instead of hugging its content.
   *
   * For a sheet that holds a whole workflow rather than one question: the height
   * stops jumping as the content changes, and the children own their scrolling.
   */
  tall?: boolean
  children: React.ReactNode
  className?: string
}

/**
 * How many sheets are up, and what the page could do before the first one.
 *
 * Counted rather than snapshotted per sheet: two sheets open together — a line
 * over a meal, a portion over the add sheet — and the second one's snapshot is
 * already « hidden ». Closing both in the same commit then ran the cleanups in
 * tree order, so the *outer* one gave the page back its scroll and the inner one
 * took it away again. The page stayed frozen with nothing on screen to explain
 * it, until a navigation remounted everything.
 */
let openSheets = 0
let pageOverflow = ''

/**
 * Bottom sheet, hand-rolled rather than pulled from Radix: it is the only
 * overlay V1 needs, and the shell budget (PRD §4) does not have room to spare.
 */
export function Sheet({
  open,
  onClose,
  title,
  header,
  tall = false,
  children,
  className,
}: Readonly<SheetProps>) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      // Only the sheet on top answers. Sheets stack by DOM order — no portal,
      // one z-index — so the last dialog in the document is the one being
      // looked at, and Escape closing everything underneath it as well would
      // lose the meal a line was being corrected in.
      const dialogs = [...document.querySelectorAll('[role="dialog"]')]
      if (panel.current && dialogs.indexOf(panel.current) === dialogs.length - 1) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Its own effect, on `open` alone: `onClose` is an arrow rebuilt at every
  // render, and locking the page is not something to redo forty times a second.
  useEffect(() => {
    if (!open) return
    if (openSheets === 0) pageOverflow = document.body.style.overflow
    openSheets += 1
    document.body.style.overflow = 'hidden'
    return () => {
      openSheets -= 1
      // The last one out gives the page back, whichever order they left in.
      if (openSheets === 0) document.body.style.overflow = pageOverflow
    }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={panel}
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
          'animate-slide-up border-t border-border bg-card',
          tall
            ? 'absolute inset-x-0 bottom-0 top-16 flex flex-col rounded-t-3xl'
            : 'relative w-full rounded-t-2xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]',
          className,
        )}
      >
        {header ?? (
          <>
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted" />
            {title ? <h2 className="mb-3 text-base font-semibold">{title}</h2> : null}
          </>
        )}
        {children}
      </div>
    </div>
  )
}
