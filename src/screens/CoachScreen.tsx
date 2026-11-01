import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ScreenHeader } from '@/components/shared/ScreenHeader'
import { buttonVariants } from '@/components/ui/button-variants'
import { TapTarget } from '@/components/ui/tap-target'
import { CoachInput } from '@/features/coach/CoachInput'
import { CoachThread } from '@/features/coach/CoachThread'
import { ConsentSheet } from '@/features/coach/ConsentSheet'
import { DigestSheet } from '@/features/coach/DigestSheet'
import { QuickPrompts } from '@/features/coach/QuickPrompts'
import { useCoach } from '@/features/coach/useCoach'
import { isQuickPromptId, PERSONAS } from '@/lib/coach/personas'
import type { QuickPromptId } from '@/lib/coach/types'
import { t } from '@/i18n/fr'

interface Pending {
  text: string
  id?: QuickPromptId
}

/**
 * The coach tab (spec coach §6.1).
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

  return (
    <>
      <ScreenHeader title={t.coach.title} subtitle={t.coach.intro} />

      <div className="flex flex-col gap-5 px-5 pt-2">
        {coach.online ? null : <p className="text-sm text-muted-foreground">{t.coach.offline}</p>}

        {coach.online && !coach.hasProvider ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">{t.coach.noProvider}</p>
            <Link
              to="/settings/analyse-photo"
              className={buttonVariants({ variant: 'secondary', size: 'default' })}
            >
              {t.coach.noProviderCta}
            </Link>
          </div>
        ) : null}

        <QuickPrompts
          prompts={persona.quickPrompts}
          disabled={!canSend}
          onPick={(prompt) => send.current({ text: prompt.question, id: prompt.id })}
        />
        {/* Usable without a provider: the distress guard answers without the
            model, and that answer must stay reachable. */}
        <CoachInput disabled={!canSend} onSend={(text) => send.current({ text })} />

        {coach.error ? (
          <p role="alert" className="text-sm text-destructive">
            {coach.error}
          </p>
        ) : null}

        <TapTarget
          className="min-h-touch self-start text-sm text-muted-foreground underline underline-offset-4"
          onClick={() => setDigestOpen(true)}
        >
          {t.coach.seeDigest}
        </TapTarget>

        <CoachThread thread={coach.thread} pending={coach.pending} />
      </div>

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
