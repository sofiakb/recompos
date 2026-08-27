import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FloorChecklist } from '@/features/today/FloorChecklist'
import type { FloorHabitDefinition } from '@/types/models'

function habit(id: string, title: string, order: number): FloorHabitDefinition {
  return {
    id,
    title,
    targetRepsOrAction: title,
    category: 'workout',
    kind: 'floor',
    completionMode: 'toggle',
    order,
    createdAt: '2026-08-27T08:00:00.000Z',
    updatedAt: '2026-08-27T08:00:00.000Z',
  }
}

const HABITS = [habit('a', '5 pompes', 0), habit('b', '1 shaker', 1)]

describe('FloorChecklist', () => {
  it('marks what is done in a way assistive tech can read', () => {
    render(<FloorChecklist habits={HABITS} completedIds={new Set(['a'])} onToggle={() => {}} />)

    expect(screen.getByRole('button', { name: /5 pompes/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /1 shaker/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('lets a completed habit be unchecked', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()
    render(<FloorChecklist habits={HABITS} completedIds={new Set(['a'])} onToggle={onToggle} />)

    // The hero card only moves forward, so undo has to live here.
    await user.click(screen.getByRole('button', { name: /5 pompes/ }))
    expect(onToggle).toHaveBeenCalledWith(HABITS[0])
  })

  it('keeps every row at the 48px touch minimum', () => {
    render(<FloorChecklist habits={HABITS} completedIds={new Set()} onToggle={() => {}} />)

    for (const row of screen.getAllByRole('button')) {
      expect(row.className).toContain('min-h-touch')
    }
  })
})
