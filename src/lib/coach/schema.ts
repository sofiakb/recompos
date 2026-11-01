/**
 * What the coach is allowed to hand back. `parseCoachReply` is the only door:
 * nothing a model returns reaches the screen or the database without it.
 */
import { extractJson } from '@/lib/vision/schema'
import type { CoachReply } from '@/lib/coach/types'

export const LIMITS = { constat: 400, titre: 60, detail: 280, question: 200 } as const

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export function parseCoachReply(raw: string): CoachReply | null {
  const parsed = extractJson(raw)
  if (!parsed || typeof parsed !== 'object') return null
  const record = parsed as Record<string, unknown>

  // `reponse` is what the prompt asks for; `constat` is what it asked for
  // before décision n°33, and what a cached conversation may still produce.
  const constat = text(record.reponse ?? record.constat, LIMITS.constat)
  if (!constat) return null

  const suggestion =
    record.suggestion && typeof record.suggestion === 'object'
      ? (record.suggestion as Record<string, unknown>)
      : null
  const titre = text(suggestion?.titre, LIMITS.titre)
  const detail = text(suggestion?.detail, LIMITS.detail)
  const question = text(record.question, LIMITS.question)

  return {
    constat,
    // Half a suggestion is not a suggestion: a title with no action reads as
    // an order with the reason missing.
    suggestion: titre && detail ? { titre, detail } : null,
    question: question || null,
  }
}
