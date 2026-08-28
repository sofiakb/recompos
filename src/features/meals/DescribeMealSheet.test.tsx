import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DescribeMealSheet } from '@/features/meals/DescribeMealSheet'

function setup(pending = false) {
  const onSubmit = vi.fn()
  render(<DescribeMealSheet open pending={pending} onClose={vi.fn()} onSubmit={onSubmit} />)
  return { onSubmit, user: userEvent.setup() }
}

describe('DescribeMealSheet', () => {
  it('refuse de soumettre une description vide', () => {
    setup()
    expect(screen.getByRole('button', { name: 'Analyser' })).toBeDisabled()
  })

  it('transmet la description saisie', async () => {
    const { onSubmit, user } = setup()
    await user.type(screen.getByRole('textbox'), '200 g de poulet')
    await user.click(screen.getByRole('button', { name: 'Analyser' }))
    expect(onSubmit).toHaveBeenCalledWith('200 g de poulet')
  })

  it('coupe les espaces autour', async () => {
    const { onSubmit, user } = setup()
    await user.type(screen.getByRole('textbox'), '  une pomme  ')
    await user.click(screen.getByRole('button', { name: 'Analyser' }))
    expect(onSubmit).toHaveBeenCalledWith('une pomme')
  })

  it("désactive le bouton pendant l'analyse", () => {
    setup(true)
    expect(screen.getByRole('button', { name: 'Analyse en cours…' })).toBeDisabled()
  })
})
