import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HabitRow } from '@/features/habits/HabitRow'
import { selectHabits, useSettingsStore } from '@/stores/settingsStore'
import { t } from '@/i18n/fr'
import type { FloorHabitDefinition } from '@/types/models'

function floorHabits(): FloorHabitDefinition[] {
  return selectHabits(useSettingsStore.getState().habits, 'floor')
}

function renderList() {
  const habits = floorHabits()
  return render(
    <ul>
      {habits.map((habit, index) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          index={index}
          count={habits.length}
          onEdit={() => {}}
        />
      ))}
    </ul>,
  )
}

describe('HabitRow', () => {
  beforeEach(() => {
    useSettingsStore.persist.clearStorage()
    useSettingsStore.setState(useSettingsStore.getInitialState())
  })

  it('carries two targets, both at the 48px minimum', () => {
    renderList()
    const row = screen.getAllByRole('listitem')[0]
    const buttons = within(row).getAllByRole('button')

    // Five 36px buttons used to share a 390px row — the violation the handoff
    // de refonte flagged first.
    expect(buttons).toHaveLength(2)
    for (const button of buttons) {
      expect(button.className).toContain('h-touch')
      expect(button.className).toContain('w-touch')
    }
  })

  it('reorders with the arrow keys, not only by dragging', async () => {
    const user = userEvent.setup()
    renderList()
    const before = floorHabits().map((habit) => habit.id)
    expect(before.length).toBeGreaterThan(1)

    const secondRow = screen.getAllByRole('listitem')[1]
    await user.click(within(secondRow).getByRole('button', { name: t.habits.reorder }))
    await user.keyboard('{ArrowUp}')

    const after = floorHabits().map((habit) => habit.id)
    expect(after[0]).toBe(before[1])
    expect(after[1]).toBe(before[0])
  })

  it('refuses to walk the first habit off the top of the list', async () => {
    const user = userEvent.setup()
    renderList()
    const before = floorHabits().map((habit) => habit.id)

    const firstRow = screen.getAllByRole('listitem')[0]
    await user.click(within(firstRow).getByRole('button', { name: t.habits.reorder }))
    await user.keyboard('{ArrowUp}')

    expect(floorHabits().map((habit) => habit.id)).toEqual(before)
  })

  it('refuses to walk the last habit off the bottom', async () => {
    const user = userEvent.setup()
    renderList()
    const before = floorHabits().map((habit) => habit.id)

    const lastRow = screen.getAllByRole('listitem').at(-1)!
    await user.click(within(lastRow).getByRole('button', { name: t.habits.reorder }))
    await user.keyboard('{ArrowDown}')

    expect(floorHabits().map((habit) => habit.id)).toEqual(before)
  })
})
