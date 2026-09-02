import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import { TapTarget } from '@/components/ui/tap-target'
import { haptic, useHaptic } from '@/lib/haptics'
import { useSettingsStore } from '@/stores/settingsStore'

function trigger(element: HTMLElement): HTMLElement | null {
  return element.querySelector('[data-haptic-trigger]')
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
  it('lays the iOS switch over its element', () => {
    render(<Box />)

    expect(trigger(screen.getByTestId('box'))).not.toBeNull()
  })

  it('hides the switch from the accessibility tree', () => {
    render(<Box />)

    const overlay = trigger(screen.getByTestId('box')) as HTMLElement
    expect(overlay.getAttribute('aria-hidden')).toBe('true')
    expect(overlay.tabIndex).toBe(-1)
    expect(screen.queryByRole('checkbox')).toBeNull()
  })

  it('lays exactly one, however often the ref is re-applied', () => {
    const { rerender } = render(<Box />)
    rerender(<Box label="Zone bis" />)

    expect(screen.getByTestId('box').querySelectorAll('[data-haptic-trigger]')).toHaveLength(1)
  })

  it('leaves an element that positions itself where it was', () => {
    // The library forces `position: relative` to anchor its overlay, which would
    // drop a fixed quick action or an absolute close cross back into the flow.
    function FixedBox() {
      return <div ref={useHaptic<HTMLDivElement>()} data-testid="box" className="fixed" />
    }
    render(<FixedBox />)

    expect(screen.getByTestId('box').style.position).toBe('')
  })

  it('removes the switch when the setting is turned off', () => {
    const { rerender } = render(<Box />)
    act(() => useSettingsStore.getState().toggleHaptics(false))
    rerender(<Box />)

    expect(trigger(screen.getByTestId('box'))).toBeNull()
  })
})

describe('tap targets', () => {
  /**
   * The overlay shipped on every button once, and the app stopped scrolling:
   * a Safari switch claims the drag gesture it needs to be flicked, and most of
   * this app's lists are full-width buttons. It stays off them until the
   * overlay can be made to let a vertical pan through.
   */
  it('carry no overlay, so a list still scrolls', () => {
    render(
      <>
        <TapTarget>Ligne</TapTarget>
        <Button>Enregistrer</Button>
      </>,
    )

    for (const button of screen.getAllByRole('button')) {
      expect(trigger(button)).toBeNull()
    }
  })

  it('still let a click through to the handler', async () => {
    const onClick = vi.fn()
    const { default: userEvent } = await import('@testing-library/user-event')
    render(<TapTarget onClick={onClick}>Ligne</TapTarget>)

    await userEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  /**
   * A plain `<button>` bypasses the seam entirely. The single exception is the
   * reorder handle, whose pointer events an overlay would swallow anyway.
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
