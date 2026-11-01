import type { CoachMessage } from '@/types/models'

/**
 * Splits a thread (oldest first) into exchanges: a question and what answered it.
 *
 * The screen reads exchanges newest first but each one top to bottom — an
 * answer above its own question reads backwards.
 */
export function exchangesOf(thread: CoachMessage[]): CoachMessage[][] {
  const groups: CoachMessage[][] = []
  for (const message of thread) {
    const current = groups.at(-1)
    if (message.role === 'user' || !current) groups.push([message])
    else current.push(message)
  }
  return groups
}
