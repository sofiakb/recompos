import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sheet } from '@/components/ui/sheet'

describe('Sheet', () => {
  it('se ferme sur Échap', async () => {
    const onClose = vi.fn()
    render(
      <Sheet open onClose={onClose} title="Repas">
        <p>contenu</p>
      </Sheet>,
    )
    await userEvent.setup().keyboard('{Escape}')

    expect(onClose).toHaveBeenCalled()
  })

  /**
   * Deux feuilles empilées : la ligne ouverte par-dessus le repas. Échap ne
   * doit fermer que celle du dessus, sinon corriger une portion fait perdre le
   * repas qu’on était en train de lire.
   */
  it('ne laisse répondre que la feuille du dessus', async () => {
    const closeBack = vi.fn()
    const closeFront = vi.fn()
    render(
      <Sheet open onClose={closeBack} title="Repas">
        <p>repas</p>
        <Sheet open onClose={closeFront} title="Ligne">
          <p>ligne</p>
        </Sheet>
      </Sheet>,
    )
    await userEvent.setup().keyboard('{Escape}')

    expect(closeFront).toHaveBeenCalled()
    expect(closeBack).not.toHaveBeenCalled()
  })

  it('ferme au clic sur le fond', async () => {
    const onClose = vi.fn()
    render(
      <Sheet open onClose={onClose} title="Repas">
        <p>contenu</p>
      </Sheet>,
    )
    await userEvent.setup().click(screen.getByRole('button', { name: 'Fermer' }))

    expect(onClose).toHaveBeenCalled()
  })
})
