import { CoachReplyCard } from '@/features/coach/CoachReplyCard'
import { addDays, formatShortDate, toLogicalDate } from '@/lib/date'
import { cn } from '@/lib/utils'
import type { CoachMessage } from '@/types/models'
import { t } from '@/i18n/fr'

function dayLabel(date: string, today: string): string {
  if (date === today) return t.coach.today
  if (date === addDays(today, -1)) return t.coach.yesterday
  return formatShortDate(date)
}

/** One side of the conversation: the user on the right, the coach on the left. */
function Bubble({ mine, children }: Readonly<{ mine: boolean; children: React.ReactNode }>) {
  return (
    <div
      className={cn(
        'max-w-[85%] px-3.5 py-2.5 text-[15px] leading-relaxed',
        'whitespace-pre-line',
        mine
          ? 'self-end rounded-2xl rounded-br-md bg-primary/20'
          : 'lit-surface self-start rounded-2xl rounded-bl-md border border-border/70',
      )}
    >
      {children}
    </div>
  )
}

interface CoachMessagesProps {
  thread: CoachMessage[]
  pending: boolean
  /** Shown as a quiet line at the end of the conversation, e.g. a failed call. */
  notice?: string | null
}

/**
 * The conversation, oldest first, like any chat: the last thing said is at the
 * bottom, right above the field to answer it.
 */
export function CoachMessages({ thread, pending, notice }: Readonly<CoachMessagesProps>) {
  const today = toLogicalDate()

  return (
    <div role="log" aria-label={t.coach.messagesLabel} className="flex flex-col gap-2.5">
      {/* Not stored: a greeting is how a chat says what it is for. */}
      <Bubble mine={false}>{t.coach.greeting}</Bubble>

      {thread.map((message, index) => {
        const newDay = index === 0 || thread[index - 1].date !== message.date
        return (
          <div key={message.id} className="flex flex-col gap-2.5">
            {newDay ? (
              <p className="eyebrow mt-3 self-center text-muted-foreground">
                {dayLabel(message.date, today)}
              </p>
            ) : null}
            <Bubble mine={message.role === 'user'}>
              {message.role === 'user' ? (
                <span className="sr-only">{t.coach.you} : </span>
              ) : (
                <span className="sr-only">{t.coach.coachName} : </span>
              )}
              {message.reply ? <CoachReplyCard reply={message.reply} /> : message.text}
            </Bubble>
          </div>
        )
      })}

      {pending ? (
        <Bubble mine={false}>
          <span className="sr-only">{t.coach.thinking}</span>
          <span aria-hidden className="flex gap-1 py-1.5">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </span>
        </Bubble>
      ) : null}

      {notice ? (
        <p role="alert" className="mt-1 self-center text-center text-sm text-muted-foreground">
          {notice}
        </p>
      ) : null}
    </div>
  )
}
