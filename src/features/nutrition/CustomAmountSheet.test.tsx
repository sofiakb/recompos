import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CustomAmountSheet } from '@/features/nutrition/CustomAmountSheet'

function setup() {
  const onSubmit = vi.fn()
  render(<CustomAmountSheet open onClose={vi.fn()} onSubmit={onSubmit} />)
  return { onSubmit, user: userEvent.setup() }
}

describe('CustomAmountSheet', () => {
  it('builds an amount from the keypad and submits it', async () => {
    const { onSubmit, user } = setup()
    await user.click(screen.getByRole('button', { name: '4' }))
    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: 'Ajouter 45 g' }))

    expect(onSubmit).toHaveBeenCalledWith(45)
  })

  it('refuses to submit zero', async () => {
    setup()
    expect(screen.getByRole('button', { name: /Ajouter/ })).toBeDisabled()
  })

  it('deletes the last digit', async () => {
    const { onSubmit, user } = setup()
    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'Effacer un chiffre' }))
    await user.click(screen.getByRole('button', { name: 'Ajouter 1 g' }))

    expect(onSubmit).toHaveBeenCalledWith(1)
  })

  it('ignores keystrokes that would exceed the sane maximum', async () => {
    const { user } = setup()
    for (const key of ['9', '9', '9']) {
      await user.click(screen.getByRole('button', { name: key }))
    }
    // 99 is kept, the third 9 would make 999 and is dropped.
    expect(screen.getByRole('button', { name: 'Ajouter 99 g' })).toBeEnabled()
  })

  it('drops leading zeros', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: '0' }))
    await user.click(screen.getByRole('button', { name: '5' }))
    expect(screen.getByRole('button', { name: 'Ajouter 5 g' })).toBeEnabled()
  })
})
