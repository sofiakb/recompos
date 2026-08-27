import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NowCard } from '@/features/today/NowCard'
import { t } from '@/i18n/fr'
import type { FloorHabitDefinition } from '@/types/models'

const HABIT: FloorHabitDefinition = {
  id: 'a',
  title: '5 pompes',
  targetRepsOrAction: '5 pompes',
  category: 'workout',
  kind: 'floor',
  completionMode: 'toggle',
  order: 0,
  createdAt: '2026-08-27T08:00:00.000Z',
  updatedAt: '2026-08-27T08:00:00.000Z',
}

describe('NowCard', () => {
  it('shows one habit, not the whole floor', async () => {
    const onDone = vi.fn()
    const user = userEvent.setup()
    render(<NowCard habit={HABIT} onDone={onDone} onLater={() => {}} />)

    expect(screen.getByRole('heading')).toHaveTextContent('5 pompes')
    await user.click(screen.getByRole('button', { name: t.today.markDone }))
    expect(onDone).toHaveBeenCalledOnce()
  })

  it('hides « Plus tard » when there is nowhere to postpone to', () => {
    render(<NowCard habit={HABIT} onDone={() => {}} />)

    // A button that does nothing is worse than no button.
    expect(screen.queryByRole('button', { name: t.today.later })).not.toBeInTheDocument()
  })

  it('goes quiet instead of disappearing once the floor is done', () => {
    render(<NowCard habit={null} onDone={() => {}} />)

    expect(screen.getByRole('heading')).toHaveTextContent(t.today.dayValidated)
    expect(screen.getByText(t.today.floorDoneHint)).toBeInTheDocument()
    // Nothing left to press: the day is counted.
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })
})
