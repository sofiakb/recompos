import { CoachReplyCard } from '@/features/coach/CoachReplyCard'
import type { CoachMessage } from '@/types/models'
import { t } from '@/i18n/fr'

function Line({ message }: Readonly<{ message: CoachMessage }>) {
  if (message.role === 'user') {
    return (
      <p className="max-w-[85%] self-end rounded-lg bg-primary/15 px-3.5 py-2.5 text-[15px]">
        <span className="sr-only">{t.coach.you} : </span>
        {message.text}
      </p>
    )
  }
  if (message.reply) return <CoachReplyCard reply={message.reply} />
  return (
    <p className="lit-surface rounded-lg border border-border/70 px-4 py-3.5 text-[15px]">
      {message.text}
    </p>
  )
}

interface CoachExchangesProps {
  /** Newest first; each exchange top to bottom. */
  exchanges: CoachMessage[][]
  pending?: boolean
}

/** One or more exchanges: the question, then its answer — or the wait for it. */
export function CoachExchanges({ exchanges, pending = false }: Readonly<CoachExchangesProps>) {
  return (
    <div className="flex flex-col gap-5">
      {exchanges.map((exchange, index) => (
        <div key={exchange[0].id} className="flex flex-col gap-3">
          {exchange.map((message) => (
            <Line key={message.id} message={message} />
          ))}
          {pending && index === 0 && exchange.every((m) => m.role === 'user') ? (
            <p className="rounded-lg border border-border/70 px-4 py-3.5 text-sm text-muted-foreground">
              {t.coach.thinking}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  )
}
