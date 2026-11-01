import { CoachReplyCard } from '@/features/coach/CoachReplyCard'
import type { CoachMessage } from '@/types/models'
import { t } from '@/i18n/fr'

interface CoachThreadProps {
  thread: CoachMessage[]
  pending: boolean
}

/**
 * The last seven days, newest on top (spec coach §6.1): the answer just asked
 * for is the one being looked for, and it lands under the thumb.
 */
export function CoachThread({ thread, pending }: Readonly<CoachThreadProps>) {
  const newestFirst = thread.slice().reverse()

  return (
    <section className="flex flex-col gap-3" aria-live="polite">
      {pending ? (
        <p className="rounded-lg border border-border/70 px-4 py-3.5 text-sm text-muted-foreground">
          {t.coach.thinking}
        </p>
      ) : null}
      {newestFirst.length === 0 && !pending ? (
        <p className="text-sm text-muted-foreground">{t.coach.empty}</p>
      ) : null}
      {newestFirst.map((message) => {
        if (message.role === 'user') {
          return (
            <p
              key={message.id}
              className="max-w-[85%] self-end rounded-lg bg-primary/15 px-3.5 py-2.5 text-[15px]"
            >
              <span className="sr-only">{t.coach.you} : </span>
              {message.text}
            </p>
          )
        }
        if (message.reply) return <CoachReplyCard key={message.id} reply={message.reply} />
        return (
          <p
            key={message.id}
            className="lit-surface rounded-lg border border-border/70 px-4 py-3.5 text-[15px]"
          >
            {message.text}
          </p>
        )
      })}
    </section>
  )
}
