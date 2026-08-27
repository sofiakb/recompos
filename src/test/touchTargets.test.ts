import { describe, expect, it } from 'vitest'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import config from '../../tailwind.config.js'

/**
 * The 48px touch target is a rule the whole app leans on, and Tailwind fails it
 * silently: a scale declared only under `minHeight` leaves `h-touch`
 * ungenerated, so the class stays in the markup and collapses the button to the
 * size of its icon. `Button size="icon"` shipped that way until a screenshot
 * caught it. This compiles the utilities for real rather than trusting the
 * config's shape.
 */
async function compile(markup: string): Promise<string> {
  const result = await postcss([
    tailwindcss({ ...config, content: [{ raw: markup, extension: 'html' }] }),
  ]).process('@tailwind utilities;', { from: undefined })
  return result.css
}

describe('touch target scale', () => {
  it('generates a real height and width for h-touch / w-touch', async () => {
    const css = await compile('<button class="h-touch w-touch">')

    expect(css).toContain('height: 48px')
    expect(css).toContain('width: 48px')
  })

  it('still generates the minimum variants the layouts use', async () => {
    const css = await compile('<div class="min-h-touch min-w-touch">')

    expect(css).toContain('min-height: 48px')
    expect(css).toContain('min-width: 48px')
  })
})
