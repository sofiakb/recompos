import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SetLoggerSheet } from '@/features/workouts/SetLoggerSheet'
import { suggestNextSet } from '@/lib/overload'
import type { Exercise, ExerciseSet } from '@/types/models'

const PUSHUP: Exercise = {
  id: 'pushup',
  name: 'Pompes',
  pattern: 'push',
  defaultRepRange: [8, 15],
  isCustom: false,
}

const LAST: ExerciseSet = {
  id: 's1',
  exerciseId: 'pushup',
  reps: 10,
  loadOrResistance: 'Poids du corps',
  difficulty: 'easy',
  date: '2026-08-22',
  timestamp: '2026-08-22T10:00:00.000Z',
}

function setup(lastSet: ExerciseSet | null = LAST, progressedFromName?: string) {
  const onSubmit = vi.fn()
  render(
    <SetLoggerSheet
      open
      exercise={PUSHUP}
      suggestion={suggestNextSet(PUSHUP, lastSet)}
      lastSet={lastSet}
      progressedFromName={progressedFromName}
      onClose={vi.fn()}
      onSubmit={onSubmit}
    />,
  )
  return { onSubmit, user: userEvent.setup() }
}

describe('SetLoggerSheet', () => {
  it('pre-fills the suggested reps', () => {
    setup()
    // Last set was 10 reps and easy, so the suggestion is 12.
    expect(screen.getByLabelText('Répétitions')).toHaveValue('12')
  })

  it('shows what the last set was', () => {
    setup()
    expect(screen.getByText(/10 reps, Poids du corps/)).toBeInTheDocument()
  })

  it('says so on a first time instead of inventing a history', () => {
    setup(null)
    expect(screen.getByText('Première fois sur ce mouvement.')).toBeInTheDocument()
    expect(screen.getByLabelText('Répétitions')).toHaveValue('8')
  })

  it('submits the reps, load and difficulty', async () => {
    const { onSubmit, user } = setup()
    await user.click(screen.getByRole('radio', { name: 'Difficile' }))
    await user.click(screen.getByRole('button', { name: 'Enregistrer la série' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({
      exerciseId: 'pushup',
      reps: 12,
      loadOrResistance: 'Poids du corps',
      difficulty: 'hard',
    })
  })

  it('lets the suggestion be overridden', async () => {
    const { onSubmit, user } = setup()
    await user.click(screen.getByRole('button', { name: '-1' }))
    await user.click(screen.getByRole('button', { name: 'Enregistrer la série' }))

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ reps: 11 }))
  })

  it('never lets the reps fall below one', async () => {
    const { user } = setup(null)
    const minus = screen.getByRole('button', { name: '-1' })
    for (let i = 0; i < 12; i++) await user.click(minus)
    expect(screen.getByLabelText('Répétitions')).toHaveValue('1')
  })

  it('announces a progression when the suggestion moved on', () => {
    setup(LAST, 'Pompes inclinées')
    expect(screen.getByText(/on passe à Pompes/)).toBeInTheDocument()
  })

  it('defaults the difficulty to « Cible »', async () => {
    const { onSubmit, user } = setup()
    await user.click(screen.getByRole('button', { name: 'Enregistrer la série' }))
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ difficulty: 'target' }))
  })
})
