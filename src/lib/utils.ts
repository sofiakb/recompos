import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Stable ids without pulling in a uuid dependency. */
export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

let lastIssuedMs = 0

/**
 * An ISO timestamp that never repeats within this tab.
 *
 * Two writes in the same millisecond are ordinary — two sets in a circuit, an
 * undo followed by a re-add — and identical timestamps make every
 * `sort by timestamp` in the app non-deterministic. Ties are broken by nudging
 * forward a millisecond, so the ordering is stable and the drift is bounded by
 * the size of the burst.
 */
export function nowIso(): string {
  const now = Date.now()
  lastIssuedMs = now > lastIssuedMs ? now : lastIssuedMs + 1
  return new Date(lastIssuedMs).toISOString()
}

/** Short, non-blocking confirmation on a completed action. No-op where unsupported. */
export function haptic(durationMs = 30): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate?.(durationMs)
  }
}
