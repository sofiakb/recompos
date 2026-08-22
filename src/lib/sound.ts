/**
 * A short end-of-rest chime, synthesised rather than shipped.
 *
 * An audio file would be one more asset to cache and one more thing to fail
 * offline; a 180 ms oscillator costs nothing and needs no network.
 */
let context: AudioContext | null = null

function audioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor =
    window.AudioContext ??
    (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  context ??= new Ctor()
  return context
}

export function playChime(enabled = true): void {
  if (!enabled) return
  const ctx = audioContext()
  if (!ctx) return
  // iOS suspends the context until a gesture resumes it; the rest timer is
  // always started by a tap, so this resolves in practice.
  void ctx.resume?.()

  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(880, ctx.currentTime)
  gain.gain.setValueAtTime(0.0001, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18)
  oscillator.connect(gain).connect(ctx.destination)
  oscillator.start()
  oscillator.stop(ctx.currentTime + 0.2)
}
