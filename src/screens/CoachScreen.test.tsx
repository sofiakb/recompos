import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { db } from '@/db/dexie'
import { CoachScreen } from '@/screens/CoachScreen'
import { useSettingsStore } from '@/stores/settingsStore'
import { toLogicalDate } from '@/lib/date'
import { t } from '@/i18n/fr'

const ANSWER = JSON.stringify({
  constat: 'Tes protéines ont bien tenu cette semaine.',
  suggestion: { titre: 'Un skyr ce soir', detail: 'Il ajoute 15 g sans cuisson.' },
  question: null,
})

function reply(content: string): Response {
  return new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 })
}

/** Testing Library collapses U+00A0 and U+202F to a plain space before matching. */
const plain = (text: string) => text.replaceAll(/[\u00a0\u202f]/gu, ' ')

let fetchMock: ReturnType<typeof vi.fn>

function renderAt(path = '/coach') {
  render(
    <MemoryRouter initialEntries={[path]}>
      <CoachScreen />
    </MemoryRouter>,
  )
  return userEvent.setup()
}

function withKey() {
  useSettingsStore.getState().setVisionProvider('groq', { apiKey: 'gsk_test', enabled: true })
}

function setOnline(value: boolean) {
  Object.defineProperty(window.navigator, 'onLine', { value, configurable: true })
}

beforeEach(async () => {
  await db.coachMessages.clear()
  useSettingsStore.setState(useSettingsStore.getInitialState())
  fetchMock = vi.fn().mockImplementation(() => Promise.resolve(reply(ANSWER)))
  vi.stubGlobal('fetch', fetchMock)
  setOnline(true)
})

afterEach(() => {
  vi.unstubAllGlobals()
  setOnline(true)
})

describe('CoachScreen', () => {
  it("demande l'accord avant la première question, sans rien envoyer", async () => {
    withKey()
    const user = renderAt()
    await user.click(screen.getByRole('button', { name: plain(t.coach.quick.week) }))

    expect(await screen.findByText(t.coach.consentTitle)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("pose la question mise en attente dès que l'accord est donné", async () => {
    withKey()
    const user = renderAt()
    await user.click(screen.getByRole('button', { name: plain(t.coach.quick.week) }))
    await user.click(await screen.findByRole('button', { name: t.coach.consentAccept }))

    expect(
      await screen.findByText('Tes protéines ont bien tenu cette semaine.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Un skyr ce soir')).toBeInTheDocument()
    expect(useSettingsStore.getState().settings.coachConsentAt).toBeDefined()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('répond à la détresse sans réseau, même sans clé', async () => {
    useSettingsStore.getState().setCoachConsent(true)
    const user = renderAt()
    await user.type(
      screen.getByRole('textbox', { name: t.coach.inputLabel }),
      'je vais me faire vomir',
    )
    await user.click(screen.getByRole('button', { name: t.coach.send }))

    expect(await screen.findByText(plain(t.coach.distress.eating))).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('lance la question rapide reçue par ?ask=', async () => {
    withKey()
    useSettingsStore.getState().setCoachConsent(true)
    renderAt('/coach?ask=tonight')

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    const body = JSON.parse(String(fetchMock.mock.calls[0][1].body))
    expect(body.messages.at(-1).content).toContain(t.coach.quick.tonight)
  })

  it('reste lisible hors ligne, sans laisser poser de question', async () => {
    await db.coachMessages.add({
      id: 'old',
      persona: 'nutrition',
      role: 'user',
      text: 'Ma question d’hier',
      timestamp: new Date().toISOString(),
      date: toLogicalDate(),
    })
    setOnline(false)
    withKey()
    useSettingsStore.getState().setCoachConsent(true)
    renderAt()

    expect(screen.getByText(t.coach.offline)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: plain(t.coach.quick.week) })).toBeDisabled()
    expect(await screen.findByText('Ma question d’hier')).toBeInTheDocument()
  })

  it("renvoie vers les réglages quand aucun service n'est configuré", () => {
    renderAt()
    expect(screen.getByRole('button', { name: plain(t.coach.quick.week) })).toBeDisabled()
    expect(screen.getByRole('link', { name: t.coach.noProviderCta })).toHaveAttribute(
      'href',
      '/settings/analyse-photo',
    )
  })
})
