import { useEffect, useState } from 'react'

/**
 * A ticking `Date.now()`.
 *
 * Every duration in the workouts module is derived from this rather than
 * accumulated, so a throttled or suspended interval costs precision on screen
 * but never on the number itself. Coming back from the background forces a tick
 * so the display catches up immediately instead of on the next interval.
 */
export function useClock(active: boolean, intervalMs = 500): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!active) return
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    const onVisible = () => {
      if (document.visibilityState === 'visible') setNow(Date.now())
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [active, intervalMs])

  return now
}
