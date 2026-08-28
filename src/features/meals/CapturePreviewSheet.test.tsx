import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CapturePreviewSheet } from '@/features/meals/CapturePreviewSheet'

function setup(pending = false) {
  const onConfirm = vi.fn()
  const onCancel = vi.fn()
  render(
    <CapturePreviewSheet
      open
      pending={pending}
      previewUrl="blob:fake"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />,
  )
  return { onConfirm, onCancel, user: userEvent.setup() }
}

describe('CapturePreviewSheet', () => {
  it('analyse sans précision', async () => {
    const { onConfirm, user } = setup()
    await user.click(screen.getByRole('button', { name: 'Analyser' }))
    expect(onConfirm).toHaveBeenCalledWith('')
  })

  it('analyse avec la précision saisie', async () => {
    const { onConfirm, user } = setup()
    await user.type(screen.getByRole('textbox'), 'le riz est complet')
    await user.click(screen.getByRole('button', { name: 'Analyser' }))
    expect(onConfirm).toHaveBeenCalledWith('le riz est complet')
  })

  it("montre l'aperçu de la photo qui va partir", () => {
    setup()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'blob:fake')
  })

  it('annule sans analyser', async () => {
    const { onCancel, onConfirm, user } = setup()
    await user.click(screen.getByRole('button', { name: 'Annuler' }))
    expect(onCancel).toHaveBeenCalled()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it("désactive l'analyse pendant qu'elle tourne", () => {
    setup(true)
    expect(screen.getByRole('button', { name: 'Analyse en cours…' })).toBeDisabled()
  })
})
