/**
 * Timer arithmetic (PRD §6.3).
 *
 * Everything is derived from a start timestamp rather than accumulated by an
 * interval: a locked screen throttles or suspends `setInterval`, and a rest
 * timer that quietly loses 20 seconds is worse than no timer at all.
 */
/** The two presets offered as buttons; any duration in range can be typed. */
export const REST_PRESETS = [60, 90] as const
export const MIN_REST_SECONDS = 15
export const MAX_REST_SECONDS = 600

export function clampRestSeconds(seconds: number): number {
  if (!Number.isFinite(seconds)) return REST_PRESETS[0]
  return Math.min(MAX_REST_SECONDS, Math.max(MIN_REST_SECONDS, Math.round(seconds)))
}

export function elapsedSeconds(startedAtMs: number, nowMs: number): number {
  return Math.max(0, Math.floor((nowMs - startedAtMs) / 1000))
}

export function remainingSeconds(
  startedAtMs: number,
  durationSeconds: number,
  nowMs: number,
): number {
  return Math.max(0, durationSeconds - elapsedSeconds(startedAtMs, nowMs))
}

export function isElapsed(startedAtMs: number, durationSeconds: number, nowMs: number): boolean {
  return remainingSeconds(startedAtMs, durationSeconds, nowMs) === 0
}

/** `m:ss` for a rest timer, `h:mm:ss` only once an hour is on the clock. */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  const pad = (n: number) => (n < 10 ? `0${n}` : String(n))
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`
}

/** Whole minutes between two instants, for a session's stored duration. */
export function minutesBetween(startIso: string, endIso: string): number {
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime()
  return Math.max(0, Math.round(ms / 60_000))
}
