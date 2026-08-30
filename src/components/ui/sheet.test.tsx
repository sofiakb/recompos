import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sheet } from '@/components/ui/sheet'

afterEach(() => {
  document.body.style.overflow = ''
})

/**
 * Une feuille gèle la page derrière elle, et doit la rendre en partant.
 *
 * Le compte est tenu globalement parce que deux feuilles se superposent — une
 * ligne par-dessus un repas, une portion par-dessus la feuille d'ajout — et
 * qu'une photographie prise feuille par feuille enregistre « hidden » pour la
 * seconde. Les deux fermées dans le même commit, les nettoyages passaient dans
 * l'ordre de l'arbre : la feuille du dessous rendait le défilement, celle du
 * dessus le reprenait, et la page restait figée sans rien à l'écran pour le
 * dire.
 */
describe('Sheet — le défilement de la page', () => {
  function Stack({ outer, inner }: Readonly<{ outer: boolean; inner: boolean }>) {
    return (
      <>
        {outer ? (
          <Sheet open onClose={vi.fn()} title="Repas">
            <p>repas</p>
          </Sheet>
        ) : null}
        {inner ? (
          <Sheet open onClose={vi.fn()} title="Ligne">
            <p>ligne</p>
          </Sheet>
        ) : null}
      </>
    )
  }

  it('rend le défilement quand deux feuilles se ferment d’un coup', () => {
    const { rerender } = render(<Stack outer inner />)
    expect(document.body.style.overflow).toBe('hidden')

    rerender(<Stack outer={false} inner={false} />)
    expect(document.body.style.overflow).toBe('')
  })

  it('le garde bloqué tant qu’il reste une feuille', () => {
    const { rerender } = render(<Stack outer inner />)
    rerender(<Stack outer inner={false} />)

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('le rend aussi quand la feuille du dessous part la première', () => {
    const { rerender } = render(<Stack outer inner />)
    rerender(<Stack outer={false} inner />)
    expect(document.body.style.overflow).toBe('hidden')

    rerender(<Stack outer={false} inner={false} />)
    expect(document.body.style.overflow).toBe('')
  })
})

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
