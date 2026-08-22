import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FloorCard } from '@/features/floor/FloorCard'
import type { FloorHabitDefinition } from '@/types/models'

const habits: FloorHabitDefinition[] = [
  {
    id: 'a',
    title: '5 pompes',
    targetRepsOrAction: '5 pompes',
    category: 'workout',
    kind: 'floor',
    order: 0,
    createdAt: '2026-08-22T08:00:00.000Z',
    updatedAt: '2026-08-22T08:00:00.000Z',
  },
  {
    id: 'b',
    title: '1 shaker',
    triggerAnchor: 'Après le café',
    targetRepsOrAction: '1 shaker',
    category: 'nutrition',
    kind: 'floor',
    order: 1,
    createdAt: '2026-08-22T08:00:00.000Z',
    updatedAt: '2026-08-22T08:00:00.000Z',
  },
]

function renderCard(overrides: Partial<React.ComponentProps<typeof FloorCard>> = {}) {
  const onToggle = vi.fn()
  render(
    <FloorCard
      title="Plancher du jour"
      description="Non négociable"
      habits={habits}
      completedIds={new Set()}
      onToggle={onToggle}
      {...overrides}
    />,
  )
  return { onToggle }
}

describe('FloorCard', () => {
  it('validates a habit in a single tap', async () => {
    const user = userEvent.setup()
    const { onToggle } = renderCard()

    await user.click(screen.getByRole('button', { name: /5 pompes/ }))

    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith('a')
  })

  it('exposes completion state to assistive tech', () => {
    renderCard({ completedIds: new Set(['a']) })

    expect(screen.getByRole('button', { name: /5 pompes/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /1 shaker/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('shows the anchor next to a stacked habit', () => {
    renderCard()
    expect(screen.getByText('Après le café')).toBeInTheDocument()
  })

  it('swaps to the done wording once the floor is complete, without any shaming copy', () => {
    renderCard({
      completedIds: new Set(['a', 'b']),
      allDone: true,
      doneLabel: 'Plancher validé',
      doneHint: 'La journée compte.',
    })

    expect(screen.getByText('Plancher validé')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Tout valider' })).not.toBeInTheDocument()
  })

  it('offers Tout valider only while the floor is incomplete', async () => {
    const user = userEvent.setup()
    const onCompleteAll = vi.fn()
    renderCard({ onCompleteAll })

    await user.click(screen.getByRole('button', { name: 'Tout valider' }))
    expect(onCompleteAll).toHaveBeenCalledTimes(1)
  })

  it('renders nothing when there is no habit to show', () => {
    const { container } = render(
      <FloorCard
        title="Plancher"
        description=""
        habits={[]}
        completedIds={new Set()}
        onToggle={vi.fn()}
      />,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
