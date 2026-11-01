/**
 * What the coach may not say, and what it should not try to answer
 * (spec coach §4.5, §5.3).
 *
 * Both lists are regexes on purpose: they run before and after a network call,
 * offline, in a millisecond, and a test can say exactly what they catch. They
 * are a net under the prompt, not a replacement for it — the prompt is what
 * makes a bad sentence rare; this is what makes it invisible.
 *
 * No lookbehind anywhere: Safari before 16.4 refuses the whole module over one.
 * The left word boundary is a group instead, and the word is read from it.
 */
import type { DistressKind } from '@/lib/coach/types'

/** A whole word, accents included — `\b` does not know that « é » is a letter. */
function word(stem: string): RegExp {
  return new RegExp(`(?:^|[^\\p{L}])(${stem})(?![\\p{L}])`, 'iu')
}

const FORBIDDEN: RegExp[] = [
  word('craqu(?:er|é|ée|és|ées|age|ages|e|es|ent|ais|ait)'),
  word('trich(?:er|é|ée|e|es|ent|erie|eries)'),
  word('écarts?'),
  word('coupables?'),
  word('culpabilit(?:é|és)'),
  word('culpabilis(?:er|e|es|ent|ant|é|ée)'),
  word('rattrap(?:er|e|es|ent|é|ée|age)'),
  word('compens(?:er|e|es|ent|é|ée|ation|ations)'),
  word('mauvais(?:e|es)? aliments?'),
  word('interdit(?:e|s|es)?'),
  word('péchés?'),
  word('il faut'),
  word('tu dois'),
  word('rat(?:é|ée|és|ées)'),
  word('échecs?'),
]

/**
 * Sentences that use a forbidden word to say the opposite. Removed before the
 * scan — « rien à compenser » is exactly what the coach should say.
 */
const ALLOWED: RegExp[] = [
  /sans\s+(?:te\s+)?culpabili\p{L}*/giu,
  /(?:rien|pas\s+besoin|inutile|aucune?\s+raison)\s+(?:de\s+|d['’]|à\s+)?(?:te\s+)?(?:compenser|rattraper|culpabiliser)/giu,
]

export function forbiddenWordsIn(text: string): string[] {
  let scrubbed = text
  for (const allowed of ALLOWED) scrubbed = scrubbed.replace(allowed, ' ')
  const found: string[] = []
  for (const pattern of FORBIDDEN) {
    const match = pattern.exec(scrubbed)
    if (match?.[1]) found.push(match[1])
  }
  return found
}

const CRISIS: RegExp[] = [
  /suicid\p{L}*/iu,
  /envie\s+de\s+mourir/iu,
  /envie\s+d['’]en\s+finir/iu,
  /me\s+tuer/iu,
]

const EATING: RegExp[] = [
  /(?:me\s+)?faire\s+vomir/iu,
  /vomi(?:r|s|ssements?)\s+(?:après|exprès|volontairement)/iu,
  /laxatifs?/iu,
  /(?:ne\s+plus|arrêter\s+de)\s+manger/iu,
  /me\s+punir/iu,
  /je\s+me\s+(?:dégoûte|déteste|hais)/iu,
  /jeûn\p{L}*\s+(?:depuis\s+)?\d+\s+jours/iu,
]

/** Crisis first: it changes which resources the answer gives. */
export function distressIn(text: string): DistressKind | null {
  if (CRISIS.some((pattern) => pattern.test(text))) return 'crisis'
  if (EATING.some((pattern) => pattern.test(text))) return 'eating'
  return null
}
