import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { fr } from '@/i18n/fr'

const SOURCE = 'src/i18n/fr.ts'

function walk(node: unknown, path: string[], onLeaf: (path: string, value: unknown) => void) {
  if (node && typeof node === 'object' && !Array.isArray(node)) {
    for (const [key, value] of Object.entries(node)) walk(value, [...path, key], onLeaf)
    return
  }
  onLeaf(path.join('.'), node)
}

/** `meals.slot.breakfast` counts as read if `meals.slot` — or `meals` — was named. */
function isRead(path: string, read: Set<string>): boolean {
  const parts = path.split('.')
  return parts.some((_, index) => read.has(parts.slice(0, index + 1).join('.')))
}

function sourceFiles(dir = 'src'): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return /\.tsx?$/.test(entry.name) && path !== SOURCE ? [path] : []
  })
}

/**
 * Every `t.a.b.c` written anywhere else in the app.
 *
 * A dynamic read — `t.meals.slot[slot]` — lands here as `meals.slot`, which is
 * why a path counts as read when itself *or any ancestor* was named.
 */
function referenced(): Set<string> {
  const found = new Set<string>()
  const reference = /\b(?:t|fr)\.((?:[A-Za-z_$][\w$]*)(?:\.[A-Za-z_$][\w$]*)*)/g
  for (const file of sourceFiles()) {
    for (const match of readFileSync(file, 'utf8').matchAll(reference)) found.add(match[1])
  }
  return found
}

describe('fr', () => {
  /**
   * Copy outlives the screen it was written for. Six redesigns left sixty-six
   * strings behind — invisible, translated by nobody, and impossible to tell
   * apart from the live ones when reading the file.
   */
  it('n’héberge aucune clé que personne ne lit', () => {
    const paths: string[] = []
    walk(fr, [], (path) => paths.push(path))
    const read = referenced()

    const orphans = paths.filter((path) => !isRead(path, read))
    expect(orphans).toEqual([])
  })

  /**
   * Typographie française : espace fine insécable avant `;` `!` `?`, espace mot
   * insécable avant `:` et devant `%`. Insécable pour qu’un `?` ne se retrouve
   * jamais seul en début de ligne sur un écran de téléphone.
   *
   * Seules les valeurs déjà littérales sont vues ici — celles qui sont des
   * fonctions ne rendent leur texte qu’une fois appelées.
   */
  it('met l’espace insécable devant la ponctuation double', () => {
    const guilty: string[] = []
    walk(fr, [], (path, value) => {
      if (typeof value === 'string' && /\S [;!?:%»]|« /.test(value)) guilty.push(path)
    })
    expect(guilty).toEqual([])
  })
})
