import type { CoachReply } from '@/lib/coach/types'
import { t } from '@/i18n/fr'

/**
 * The inside of a coach bubble: observation, then the one idea, then the
 * question — the order the prompt asks for.
 */
export function CoachReplyCard({ reply }: Readonly<{ reply: CoachReply }>) {
  return (
    <span className="flex flex-col gap-2.5">
      <span>{reply.constat}</span>
      {reply.suggestion ? (
        <span className="flex flex-col rounded-xl bg-primary/10 px-3 py-2.5">
          <span className="eyebrow mb-1 text-primary">{t.coach.suggestionLabel}</span>
          <span className="font-semibold">{reply.suggestion.titre}</span>
          <span className="text-sm text-muted-foreground">{reply.suggestion.detail}</span>
        </span>
      ) : null}
      {reply.question ? <span>{reply.question}</span> : null}
    </span>
  )
}
