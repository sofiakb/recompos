import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DayTotals } from '@/features/nutrition/DayTotals'
import { t } from '@/i18n/fr'

/** Testing Library collapses U+00A0 and U+202F to a plain space before matching. */
const plain = (text: string) => text.replaceAll(/[\u00a0\u202f]/gu, ' ')

const TOTALS = { kcal: 1247, proteinG: 78, carbsG: 120, fatG: 40 }
const TARGETS = { kcal: 1850, proteinG: 140, carbsG: 175, fatG: 65 }
const EXPLAIN = { kcal: 'Cible 1 850 kcal', protein: 'Protéines calculées sur 78,2 kg' }

function renderTotals(overrides: Partial<Parameters<typeof DayTotals>[0]> = {}) {
  return render(
    <DayTotals
      dateLabel="vendredi 28 août"
      logged={{ days: 6, outOf: 7 }}
      totals={TOTALS}
      targets={TARGETS}
      explain={EXPLAIN}
      {...overrides}
    />,
  )
}

describe('DayTotals', () => {
  it('leads with what is left, flanked by what went in', () => {
    renderTotals()

    expect(screen.getByText('603')).toBeTruthy()
    expect(screen.getByText(t.nutrition.remainingCaption)).toBeTruthy()
    expect(screen.getByText('1 247')).toBeTruthy()
    expect(screen.getByText('78')).toBeTruthy()
  })

  it('counts the overshoot instead of showing a negative or a zero', () => {
    // Going over is information, not a failure: the figure keeps counting and
    // only the caption changes side.
    renderTotals({ totals: { ...TOTALS, kcal: 1945 } })

    expect(screen.getByText('95')).toBeTruthy()
    expect(screen.getByText(t.nutrition.overCaption)).toBeTruthy()
  })

  it('caps the ring rather than filling a second lap', () => {
    renderTotals({ totals: { ...TOTALS, kcal: 3700 } })

    const ring = screen.getByRole('progressbar', { name: t.nutrition.kcalRing(3700, 1850) })
    expect(ring.getAttribute('aria-valuenow')).toBe('100')
  })

  it('opens the macros into three rings and the reasoning behind the targets', async () => {
    const user = userEvent.setup()
    renderTotals()

    expect(screen.queryByText(EXPLAIN.kcal)).toBeNull()
    await user.click(screen.getByRole('button', { name: new RegExp(t.nutrition.macrosDetail) }))

    expect(screen.getByText(EXPLAIN.kcal)).toBeTruthy()
    expect(screen.getByText(EXPLAIN.protein)).toBeTruthy()
    expect(screen.getByText('/ 175 g')).toBeTruthy()
  })

  it('drops the denominator when a macro has no target to divide by', async () => {
    const user = userEvent.setup()
    renderTotals({ targets: { ...TARGETS, carbsG: 0, fatG: 0 } })
    await user.click(screen.getByRole('button', { name: new RegExp(t.nutrition.macrosDetail) }))

    // An invented target would look exactly as authoritative as a real one.
    expect(screen.queryByText('/ 0 g')).toBeNull()
    expect(screen.getByText('/ 140 g')).toBeTruthy()
  })

  it('counts the days written down, rather than a percentage of nothing named', () => {
    // « 57 % » in a header made of kcal reads as a share of the day; « 6 / 7 j »
    // is countable against the day arrows right below it.
    renderTotals()

    expect(screen.getByText(plain(t.nutrition.loggedDaysLabel(6, 7)))).toBeTruthy()
    expect(screen.getByText(plain(t.nutrition.loggedDaysPill(6, 7)))).toBeTruthy()
  })

  it('hides the pill on a day the history cannot answer for', () => {
    // Before the install there is no window to count over, and a « 0 / 7 j »
    // there would read as seven days missed.
    renderTotals({ logged: null })

    expect(screen.queryByText(plain(t.nutrition.loggedDaysPill(6, 7)))).toBeNull()
  })
})
