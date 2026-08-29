import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuantitySheet } from '@/features/meals/QuantitySheet'
import { t } from '@/i18n/fr'
import type { MealItem } from '@/types/models'

const PENNE: MealItem = {
  name: 'penne',
  quantity: '150 g',
  kcal: 195,
  proteinG: 8,
  carbsG: 38,
  fatG: 1,
}

function setup(item: MealItem = PENNE, extra: { onRemove?: () => void } = {}) {
  const onSave = vi.fn()
  render(
    <QuantitySheet
      open
      item={item}
      saveLabel={t.common.save}
      onClose={vi.fn()}
      onSave={onSave}
      {...extra}
    />,
  )
  return { onSave, user: userEvent.setup() }
}

/** The four figures as the read-out shows them, in order. */
function readout(): string[] {
  return screen.getAllByText(/^\d+$/).map((node) => node.textContent ?? '')
}

describe('QuantitySheet', () => {
  it('recalcule les macros quand la quantité grandit', async () => {
    const { user } = setup()
    const field = screen.getByLabelText(t.meals.quantityLabel)
    await user.clear(field)
    await user.type(field, '200 g')

    expect(readout()).toEqual(['260', '11', '51', '1'])
  })

  it('avance de dix en dix, et repart toujours de la portion d’origine', async () => {
    const { user } = setup()
    const up = screen.getByLabelText(t.meals.quantityUp)
    // Cinq pas de 10 g : 150 → 200. Recalculer de proche en proche
    // arrondirait les protéines vers le bas à chaque pas et finirait à 10 g.
    for (let press = 0; press < 5; press += 1) await user.click(up)

    expect(screen.getByLabelText(t.meals.quantityLabel)).toHaveValue('200 g')
    expect(readout()).toEqual(['260', '11', '51', '1'])
  })

  it('rend la ligne avec la quantité et les macros demandées', async () => {
    const { onSave, user } = setup()
    await user.click(screen.getByLabelText(t.meals.quantityUp))
    await user.click(screen.getByRole('button', { name: t.common.save }))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'penne', quantity: '160 g', kcal: 208 }),
    )
  })

  it('garde la saisie à la main, mais repliée', async () => {
    const { user } = setup()
    expect(screen.queryByLabelText(t.meals.itemKcal)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: t.meals.manualMacros }))
    const kcal = screen.getByLabelText(t.meals.itemKcal)
    await user.clear(kcal)
    await user.type(kcal, '300')

    expect(kcal).toHaveValue('300')
  })

  it('n’offre de retirer la ligne que quand il y a une ligne à retirer', () => {
    const { unmount } = render(
      <QuantitySheet
        open
        item={PENNE}
        saveLabel={t.common.save}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    )
    expect(screen.queryByLabelText(t.meals.removeItem('penne'))).not.toBeInTheDocument()
    unmount()

    setup(PENNE, { onRemove: vi.fn() })
    expect(screen.getByLabelText(t.meals.removeItem('penne'))).toBeInTheDocument()
  })
})
