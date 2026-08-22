import { useCallback, useEffect, useRef, useState } from 'react'
import { useClock } from '@/features/workouts/useClock'
import { remainingSeconds } from '@/lib/timer'
import { playChime } from '@/lib/sound'
import { haptic } from '@/lib/utils'
import { useSettingsStore } from '@/stores/settingsStore'

export const REST_EXTENSION_SECONDS = 30

export interface RestTimerState {
  running: boolean
  remaining: number
  durationSeconds: number
  start: (seconds?: number) => void
  stop: () => void
  extend: () => void
}

/**
 * Rest countdown (PRD §6.3).
 *
 * The end signal fires once, from a ref rather than from state, so a re-render
 * caused by anything else cannot ring the chime a second time.
 */
export function useRestTimer(): RestTimerState {
  const defaultSeconds = useSettingsStore((state) => state.settings.restTimerDefaultSeconds)
  const soundEnabled = useSettingsStore((state) => state.settings.soundEnabled)
  const hapticsEnabled = useSettingsStore((state) => state.settings.hapticsEnabled)

  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [durationSeconds, setDurationSeconds] = useState<number>(defaultSeconds)
  const signalled = useRef(false)

  const now = useClock(startedAt !== null)
  const remaining = startedAt === null ? 0 : remainingSeconds(startedAt, durationSeconds, now)

  useEffect(() => {
    if (startedAt === null || remaining > 0 || signalled.current) return
    signalled.current = true
    playChime(soundEnabled)
    if (hapticsEnabled) haptic(120)
  }, [startedAt, remaining, soundEnabled, hapticsEnabled])

  const start = useCallback(
    (seconds?: number) => {
      signalled.current = false
      setDurationSeconds(seconds ?? defaultSeconds)
      setStartedAt(Date.now())
    },
    [defaultSeconds],
  )

  const stop = useCallback(() => {
    signalled.current = false
    setStartedAt(null)
  }, [])

  const extend = useCallback(() => {
    signalled.current = false
    setDurationSeconds((current) => current + REST_EXTENSION_SECONDS)
    // Restart the clock when the timer had already run out, so "+30 s" means
    // thirty more seconds from now rather than thirty seconds already spent.
    setStartedAt((current) =>
      current !== null && remainingSeconds(current, durationSeconds, Date.now()) === 0
        ? Date.now()
        : current,
    )
  }, [durationSeconds])

  return { running: startedAt !== null, remaining, durationSeconds, start, stop, extend }
}
