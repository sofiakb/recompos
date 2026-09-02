import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import { haptic } from '@/lib/haptics'
import { useSettingsStore } from '@/stores/settingsStore'

function trigger(element: HTMLElement): HTMLElement | null {
  return element.querySelector('[data-haptic-trigger]')
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

describe('useHaptic on Button', () => {
  it('leaves an element that positions itself where it was', () => {
    // The library forces `position: relative` to anchor its overlay, which would
    // drop a fixed quick action or an absolute close cross back into the flow.
    render(<Button className="fixed">Enregistrer</Button>)

    expect(screen.getByRole('button').style.position).toBe('')
  })

  it('lays the iOS switch over the button', () => {
    render(<Button>Enregistrer</Button>)

    expect(trigger(screen.getByRole('button'))).not.toBeNull()
  })

  it('hides the switch from the accessibility tree', () => {
    render(<Button>Enregistrer</Button>)

    const overlay = trigger(screen.getByRole('button')) as HTMLElement
    expect(overlay.getAttribute('aria-hidden')).toBe('true')
    expect(overlay.tabIndex).toBe(-1)
    // The button, not a checkbox, is what a screen reader announces.
    expect(screen.queryByRole('checkbox')).toBeNull()
  })

  it('lays exactly one, however often the ref is re-applied', () => {
    const { rerender } = render(<Button>Enregistrer</Button>)
    rerender(<Button className="mt-2">Enregistrer</Button>)

    expect(screen.getByRole('button').querySelectorAll('[data-haptic-trigger]')).toHaveLength(1)
  })

  it('lets the click through to the handler underneath', async () => {
    const onClick = vi.fn()
    const { default: userEvent } = await import('@testing-library/user-event')
    render(<Button onClick={onClick}>Enregistrer</Button>)

    await userEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('removes the switch when the setting is turned off', () => {
    const { rerender } = render(<Button>Enregistrer</Button>)
    act(() => useSettingsStore.getState().toggleHaptics(false))
    rerender(<Button>Enregistrer</Button>)

    expect(trigger(screen.getByRole('button'))).toBeNull()
  })
})

describe('the app\u2019s tap targets', () => {
  /**
   * A plain `<button>` gets no haptic on iOS, and nothing about writing one
   * says so. The single exception is the reorder handle, whose pointer events
   * the overlay would swallow.
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
