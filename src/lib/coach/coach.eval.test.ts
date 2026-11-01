// @vitest-environment node
/**
 * Live evaluation of the coach (spec coach §7). Skipped unless a key is given:
 *
 *   COACH_EVAL_GROQ_KEY=gsk_… npx vitest run src/lib/coach/coach.eval.test.ts
 *
 * Mechanical checks fail the run; the printed answers are for a human to read,
 * and that reading is what ships the prompt.
 */
import { describe, expect, it } from 'vitest'
import { askCoach } from '@/lib/coach/ask'
import { buildDigest } from '@/lib/coach/digest'
import { EVAL_CASES } from '@/lib/coach/fixtures'
import { forbiddenWordsIn } from '@/lib/coach/guard'
import { PERSONAS } from '@/lib/coach/personas'

const key = process.env.COACH_EVAL_GROQ_KEY

/** Numbers of two digits or more that the digest does not contain. */
function inventedNumbers(text: string, digestJson: string): string[] {
  return (text.match(/\d{2,}(?:[.,]\d+)?/g) ?? []).filter(
    (n) => !digestJson.includes(n.replace(',', '.')),
  )
}

describe.skipIf(!key)('coach — évaluation réelle', () => {
  for (const testCase of EVAL_CASES) {
    it(testCase.name, { timeout: 60_000 }, async () => {
      const digest = buildDigest(testCase.input)
      const digestJson = JSON.stringify(digest)
      const outcome = await askCoach(
        [{ id: 'groq', settings: { apiKey: key ?? '', enabled: true } }],
        { persona: PERSONAS.nutrition, question: testCase.question, digest, history: [] },
      )

      console.log(
        `\n### ${testCase.name}\n> ${testCase.question}\n${JSON.stringify(outcome, null, 2)}`,
      )

      if (testCase.distress) {
        expect(outcome.kind).toBe('distress')
        return
      }
      expect(outcome.kind).toBe('reply')
      if (outcome.kind !== 'reply') return
      const text = JSON.stringify(outcome.reply)
      expect(forbiddenWordsIn(text)).toEqual([])
      expect(inventedNumbers(text, digestJson)).toEqual([])
      // Not a failure, but worth seeing: a prompt that needs rewrites often is a prompt to fix.
      if (outcome.rewrites > 0) console.warn(`réécriture nécessaire : ${testCase.name}`)
    })
  }
})
