import type { CoachReply } from '@/lib/coach/types'
import { t } from '@/i18n/fr'

/** Observation, then the one idea, then the question — the order the prompt asks for. */
export function CoachReplyCard({ reply }: Readonly<{ reply: CoachReply }>) {
  return (
    <article className="lit-surface flex flex-col gap-3 rounded-lg border border-border/70 px-4 py-3.5">
      <p className="text-[15px] leading-relaxed">{reply.constat}</p>
      {reply.suggestion ? (
        <div className="rounded-md bg-primary/10 px-3 py-2.5">
          <p className="eyebrow mb-1 text-primary">{t.coach.suggestionLabel}</p>
          <p className="font-semibold">{reply.suggestion.titre}</p>
          <p className="text-sm text-muted-foreground">{reply.suggestion.detail}</p>
        </div>
      ) : null}
      {reply.question ? (
        <p className="text-sm italic text-muted-foreground">{reply.question}</p>
      ) : null}
    </article>
  )
}
