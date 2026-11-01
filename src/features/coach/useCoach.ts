/**
 * Everything the coach screen needs, and nothing it has to know how to do.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  addCoachMessage,
  coachThread,
  pruneCoachMessages,
  recentExchanges,
} from '@/db/repositories/coachRepository'
import { useCalorieTarget } from '@/features/nutrition/useCalorieTarget'
import { useProteinTarget } from '@/features/nutrition/useProteinTarget'
import { askCoach, HISTORY_LINES } from '@/lib/coach/ask'
import { buildDigest } from '@/lib/coach/digest'
import { readDigestRows } from '@/lib/coach/digestQuery'
import { PERSONAS } from '@/lib/coach/personas'
import type { CoachDigest, QuickPromptId } from '@/lib/coach/types'
import { toLogicalDate } from '@/lib/date'
import { configuredProviders, LlmError } from '@/lib/llm/client'
import { useOnline } from '@/lib/online'
import { useSettingsStore } from '@/stores/settingsStore'
import { t } from '@/i18n/fr'
import type { CoachMessage, CoachPersonaId } from '@/types/models'

export interface CoachState {
  thread: CoachMessage[]
  pending: boolean
  error: string | null
  online: boolean
  hasProvider: boolean
  hasConsent: boolean
  giveConsent: () => void
  ask: (question: string, quickPromptId?: QuickPromptId) => Promise<void>
  currentDigest: () => Promise<CoachDigest>
}

export function useCoach(personaId: CoachPersonaId = 'nutrition'): CoachState {
  const persona = PERSONAS[personaId]
  const providers = useSettingsStore((state) => state.settings.visionProviders)
  const consentAt = useSettingsStore((state) => state.settings.coachConsentAt)
  const setCoachConsent = useSettingsStore((state) => state.setCoachConsent)
  const { targetKcal, activityLevel, ageYears, biologicalSex, heightCm } = useCalorieTarget()
  const { targetGrams } = useProteinTarget()
  const online = useOnline()
  const thread = useLiveQuery(() => coachThread(personaId), [personaId], []) ?? []
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // A ref as well as state: two taps inside one render must not both ask.
  const inFlight = useRef(false)

  useEffect(() => {
    void pruneCoachMessages()
  }, [])

  const chain = useMemo(() => configuredProviders(providers), [providers])

  const currentDigest = useCallback(async () => {
    const today = toLogicalDate()
    return buildDigest({
      ...(await readDigestRows(today)),
      today,
      now: new Date(),
      profile: {
        proteinTargetG: targetGrams,
        calorieTargetKcal: targetKcal,
        activityLevel,
        ageYears,
        biologicalSex,
        heightCm,
      },
    })
  }, [targetGrams, targetKcal, activityLevel, ageYears, biologicalSex, heightCm])

  const ask = useCallback(
    async (question: string, quickPromptId?: QuickPromptId) => {
      const text = question.trim()
      if (!text || inFlight.current) return
      inFlight.current = true
      setPending(true)
      setError(null)
      try {
        // History is read before the question is written, so the question is
        // not sent twice — once as history and once as the new turn.
        const history = await recentExchanges(personaId, HISTORY_LINES)
        await addCoachMessage({ persona: personaId, role: 'user', text, quickPromptId })
        const outcome = await askCoach(chain, {
          persona,
          question: text,
          digest: await currentDigest(),
          history,
        })
        if (outcome.kind === 'reply') {
          await addCoachMessage({
            persona: personaId,
            role: 'coach',
            text: outcome.text,
            providerId: outcome.providerId,
          })
        } else {
          await addCoachMessage({
            persona: personaId,
            role: 'coach',
            synthetic: true,
            text:
              outcome.kind === 'distress' ? t.coach.distress[outcome.distress] : t.coach.fallback,
          })
        }
      } catch (caught) {
        setError(caught instanceof LlmError ? caught.message : t.coach.fallback)
      } finally {
        inFlight.current = false
        setPending(false)
      }
    },
    [chain, currentDigest, persona, personaId],
  )

  const giveConsent = useCallback(() => setCoachConsent(true), [setCoachConsent])

  return {
    thread,
    pending,
    error,
    online,
    hasProvider: chain.length > 0,
    hasConsent: Boolean(consentAt),
    giveConsent,
    ask,
    currentDigest,
  }
}
