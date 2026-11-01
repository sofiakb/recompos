import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { ScreenHeader } from '@/components/shared/ScreenHeader'
import { buttonVariants } from '@/components/ui/button-variants'
import { TapTarget } from '@/components/ui/tap-target'
import { CoachComposer } from '@/features/coach/CoachComposer'
import { CoachMessages } from '@/features/coach/CoachMessages'
import { ConsentSheet } from '@/features/coach/ConsentSheet'
import { DigestSheet } from '@/features/coach/DigestSheet'
import { useCoach } from '@/features/coach/useCoach'
import { isQuickPromptId, PERSONAS } from '@/lib/coach/personas'
import type { QuickPromptId } from '@/lib/coach/types'
import { t } from '@/i18n/fr'

interface Pending {
  text: string
  id?: QuickPromptId
}

/**
 * The coach tab, as a chat (spec coach §6.1).
 *
 * Asks only when asked: nothing on this screen calls the network by itself,
 * except `?ask=` — which is the user's own tap on another screen, carried here.
 */
export function CoachScreen() {
  const coach = useCoach('nutrition')
  const persona = PERSONAS.nutrition
  const [params, setParams] = useSearchParams()
  const [consentOpen, setConsentOpen] = useState(false)
  const [digestOpen, setDigestOpen] = useState(false)
  // The question that opened the consent sheet, asked as soon as it is accepted.
  const queued = useRef<Pending | null>(null)
  const end = useRef<HTMLDivElement>(null)

  const canSend = coach.online && !coach.pending

  // Kept in a ref so the `?ask=` effect reads today's state without re-running
  // every time that state changes.
  const send = useRef<(pending: Pending) => void>(() => {})
  send.current = (pending: Pending) => {
    if (!coach.hasConsent) {
      queued.current = pending
      setConsentOpen(true)
      return
    }
    void coach.ask(pending.text, pending.id)
  }

  // A tap on « Une idée pour ce soir ? » elsewhere lands here as `?ask=tonight`.
  // Dropped from the URL straight away, so a reload or a back does not ask again.
  const askParam = params.get('ask')
  useEffect(() => {
    if (askParam === null) return
    setParams({}, { replace: true })
    if (!isQuickPromptId(askParam) || !coach.online) return
    const prompt = persona.quickPrompts.find((candidate) => candidate.id === askParam)
    if (prompt) send.current({ text: prompt.question, id: prompt.id })
  }, [askParam, coach.online, persona, setParams])

  // Like any chat, the newest line is the one in view: on arrival, on a new
  // message, and while the coach is typing.
  const lines = coach.thread.length
  useEffect(() => {
    end.current?.scrollIntoView?.({ block: 'end' })
  }, [lines, coach.pending, coach.error])

  const notice = !coach.online
    ? t.coach.offline
    : !coach.hasProvider
      ? t.coach.noProvider
      : coach.error

  return (
    <>
      <ScreenHeader
        title={t.coach.title}
        action={
          <TapTarget
            aria-label={t.coach.seeDigest}
            onClick={() => setDigestOpen(true)}
            className="flex h-touch w-touch shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Eye size={22} aria-hidden />
          </TapTarget>
        }
      />

      <div className="flex flex-col gap-3 px-4 pt-1">
        <CoachMessages thread={coach.thread} pending={coach.pending} notice={notice} />
        {coach.online && !coach.hasProvider ? (
          <Link
            to="/settings/analyse-photo"
            className={buttonVariants({ variant: 'secondary', className: 'self-center' })}
          >
            {t.coach.noProviderCta}
          </Link>
        ) : null}
        {/* The scroll target sits right after the last line, with a margin as
            tall as the pinned composer plus the tab bar under it, so the last
            line stops just above the field instead of behind it. */}
        <div ref={end} className="scroll-mb-[calc(var(--nav-clearance)+9.5rem)]" />
        {/* The page needs that much room below the last line to scroll to it. */}
        <div aria-hidden className="h-20" />
      </div>

      <CoachComposer
        prompts={persona.quickPrompts}
        promptsDisabled={!coach.hasProvider}
        disabled={!canSend}
        onSend={(text, prompt) => send.current({ text, id: prompt?.id })}
      />

      <ConsentSheet
        open={consentOpen}
        onClose={() => {
          queued.current = null
          setConsentOpen(false)
        }}
        onAccept={() => {
          coach.giveConsent()
          setConsentOpen(false)
          const next = queued.current
          queued.current = null
          if (next) void coach.ask(next.text, next.id)
        }}
      />
      <DigestSheet
        open={digestOpen}
        onClose={() => setDigestOpen(false)}
        load={coach.currentDigest}
      />
    </>
  )
}
