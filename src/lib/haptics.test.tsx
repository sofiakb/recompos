import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import { TapTarget } from '@/components/ui/tap-target'
import { haptic, useHaptic } from '@/lib/haptics'
import { useSettingsStore } from '@/stores/settingsStore'

function parts(element: HTMLElement) {
  return {
    input: element.querySelector<HTMLInputElement>('input[data-haptic]'),
    label: element.querySelector<HTMLLabelElement>('label[data-haptic]'),
  }
}

/** The hook under test needs an element; a box with a label is the smallest one. */
function Box({ label = 'Zone' }: { label?: string }) {
  return <div ref={useHaptic<HTMLDivElement>()} data-testid="box" aria-label={label} />
}

afterEach(() => {
  act(() => useSettingsStore.getState().toggleHaptics(true))
  vi.unstubAllGlobals()
})

describe('haptic()', () => {
  it('vibrates where the platform offers it', () => {
    const vibrate = vi.fn()
    vi.stubGlobal('navigator', { vibrate })

    haptic(40)

    expect(vibrate).toHaveBeenCalledWith(40)
  })

  it('stays silent once the setting is off', () => {
    const vibrate = vi.fn()
    vi.stubGlobal('navigator', { vibrate })
    act(() => useSettingsStore.getState().toggleHaptics(false))

    haptic()

    expect(vibrate).not.toHaveBeenCalled()
  })
})

describe('useHaptic', () => {
  it('lays a switch and the label that activates it', () => {
    render(<Box />)

    const { input, label } = parts(screen.getByTestId('box'))
    expect(input?.getAttribute('switch')).toBe('')
    expect(label?.htmlFor).toBe(input?.id)
  })

  it('keeps the switch out of the way of the finger', () => {
    // The switch stretched over the element is what stole the scroll: Safari
    // claims the drag it needs to be flicked. Only the label may be touched.
    render(<Box />)

    const { input, label } = parts(screen.getByTestId('box'))
    expect(input?.style.pointerEvents).toBe('none')
    expect(input?.style.width).toBe('1px')
    expect(label?.style.inset).toBe('0')
  })

  it('hides both parts from the accessibility tree', () => {
    render(<Box />)

    const { input, label } = parts(screen.getByTestId('box'))
    expect(input?.getAttribute('aria-hidden')).toBe('true')
    expect(input?.tabIndex).toBe(-1)
    expect(label?.getAttribute('aria-hidden')).toBe('true')
    expect(screen.queryByRole('checkbox')).toBeNull()
  })

  it('lays exactly one set, however often the ref is re-applied', () => {
    const { rerender } = render(<Box />)
    rerender(<Box label="Zone bis" />)

    expect(screen.getByTestId('box').querySelectorAll('[data-haptic]')).toHaveLength(2)
  })

  it('anchors the overlay on an element that does not place itself', () => {
    render(<Box />)

    expect(screen.getByTestId('box').style.position).toBe('relative')
  })

  it('leaves an element that positions itself where it was', () => {
    function FixedBox() {
      return (
        <div ref={useHaptic<HTMLDivElement>()} data-testid="box" style={{ position: 'fixed' }} />
      )
    }
    render(<FixedBox />)

    expect(screen.getByTestId('box').style.position).toBe('fixed')
  })

  it('removes every part when the setting is turned off', () => {
    const { rerender } = render(<Box />)
    act(() => useSettingsStore.getState().toggleHaptics(false))
    rerender(<Box />)

    const box = screen.getByTestId('box')
    expect(box.querySelectorAll('[data-haptic]')).toHaveLength(0)
    expect(box.style.position).toBe('')
  })
})

describe('tap targets', () => {
  it('carry the switch and its label', () => {
    render(<TapTarget>Ligne</TapTarget>)

    const { input, label } = parts(screen.getByRole('button'))
    expect(input).not.toBeNull()
    expect(label).not.toBeNull()
  })

  it('let a tap on the overlay reach the handler underneath', async () => {
    // The finger lands on the label, never on the button itself. If the click
    // stopped there, every row in the app would vibrate and do nothing.
    const onClick = vi.fn()
    const { default: userEvent } = await import('@testing-library/user-event')
    render(<TapTarget onClick={onClick}>Ligne</TapTarget>)

    const { label } = parts(screen.getByRole('button'))
    await userEvent.click(label as HTMLLabelElement)

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('stay silent while disabled', () => {
    render(<TapTarget disabled>Ligne</TapTarget>)

    expect(parts(screen.getByRole('button')).label).toBeNull()
  })

  it('are styled the same through Button', () => {
    render(<Button>Enregistrer</Button>)

    expect(parts(screen.getByRole('button')).label).not.toBeNull()
  })

  /**
   * A plain `<button>` bypasses the seam entirely. The single exception is the
   * reorder handle, whose pointer events are its whole purpose.
   */
  it('all go through TapTarget, bar the documented drag handle', async () => {
    const { readFileSync, readdirSync } = await import('node:fs')
    const { join } = await import('node:path')

    const offenders: string[] = []
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name)
        if (entry.isDirectory()) walk(path)
        else if (entry.name.endsWith('.tsx') && !entry.name.endsWith('.test.tsx')) {
          if (/<button\b/.test(readFileSync(path, 'utf8'))) offenders.push(path)
        }
      }
    }
    walk('src')

    expect(offenders).toEqual([
      join('src', 'components', 'ui', 'tap-target.tsx'),
      join('src', 'features', 'habits', 'HabitRow.tsx'),
    ])
  })
})
