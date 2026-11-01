/**
 * Who the coach speaks as (spec coach §4.2).
 *
 * One persona today. The sports coach will be a second entry here with its own
 * prompt, questions and digest — and the screen shows a picker only once there
 * is something to pick.
 */
import { NUTRITION_SYSTEM_PROMPT } from '@/lib/coach/prompt'
import type { QuickPromptId } from '@/lib/coach/types'
import type { CoachPersonaId } from '@/types/models'
import { t } from '@/i18n/fr'

export interface QuickPrompt {
  id: QuickPromptId
  /** Shown on the chip, and sent as the user's line. */
  question: string
}

export interface CoachPersona {
  id: CoachPersonaId
  label: string
  systemPrompt: string
  quickPrompts: QuickPrompt[]
}

const QUICK_IDS = ['tonight', 'week', 'big_meal', 'protein'] as const satisfies QuickPromptId[]

export const PERSONAS: Record<CoachPersonaId, CoachPersona> = {
  nutrition: {
    id: 'nutrition',
    label: t.coach.personas.nutrition,
    systemPrompt: NUTRITION_SYSTEM_PROMPT,
    quickPrompts: QUICK_IDS.map((id) => ({ id, question: t.coach.quick[id] })),
  },
}

export function isQuickPromptId(value: string | null): value is QuickPromptId {
  return (QUICK_IDS as readonly string[]).includes(value ?? '')
}
