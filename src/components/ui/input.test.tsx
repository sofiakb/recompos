import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useState } from 'react'
import userEvent from '@testing-library/user-event'
import { Textarea } from '@/components/ui/input'

/**
 * jsdom lays nothing out, so `scrollHeight` is always 0. Standing in for it with
 * a line count is what makes the growth observable at all.
 */
function stubScrollHeight(pixelsPerLine = 24) {
  vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    const text = this instanceof HTMLTextAreaElement ? this.value : ''
    return text.split('\n').length * pixelsPerLine
  })
}

function Controlled() {
  const [value, setValue] = useState('')
  return (
    <Textarea
      aria-label="Décrire"
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Textarea', () => {
  it('follows the text instead of scrolling it out of sight', async () => {
    stubScrollHeight()
    render(<Controlled />)
    const box = screen.getByLabelText('Décrire')

    await userEvent.type(box, 'penne{Enter}lardons{Enter}gruyère')

    expect(box.style.height).toBe('72px')
  })

  it('shrinks back when lines are removed', () => {
    stubScrollHeight()
    const { rerender } = render(<Textarea aria-label="Décrire" value={'a\nb\nc'} readOnly />)
    const box = screen.getByLabelText('Décrire')
    expect(box.style.height).toBe('72px')

    rerender(<Textarea aria-label="Décrire" value="a" readOnly />)

    expect(box.style.height).toBe('24px')
  })

  it('leaves the minimum height alone when nothing can be measured', () => {
    render(<Textarea aria-label="Décrire" value="penne" readOnly />)

    expect(screen.getByLabelText('Décrire').style.height).toBe('auto')
  })
})
