import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DayNav } from '@/features/nutrition/DayNav'
import { addDays, toLogicalDate } from '@/lib/date'
import { t } from '@/i18n/fr'

describe('DayNav', () => {
  it('walks back a day', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const today = toLogicalDate()
    render(<DayNav date={today} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: t.nutrition.previousDay }))

    expect(onChange).toHaveBeenCalledWith(addDays(today, -1))
  })

  it('refuses to move into a future that cannot hold anything', () => {
    render(<DayNav date={toLogicalDate()} onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: t.nutrition.nextDay }).hasAttribute('disabled')).toBe(
      true,
    )
  })

  it('names the day it is showing, and jumps home from it', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const today = toLogicalDate()
    const past = addDays(today, -3)
    render(<DayNav date={past} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: t.nutrition.todayTitle }))

    expect(onChange).toHaveBeenCalledWith(today)
  })
})
