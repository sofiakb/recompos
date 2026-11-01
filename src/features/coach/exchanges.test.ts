import { describe, expect, it } from 'vitest'
import { exchangesOf } from '@/features/coach/exchanges'
import type { CoachMessage } from '@/types/models'

const line = (id: string, role: CoachMessage['role']): CoachMessage => ({
  id,
  role,
  persona: 'nutrition',
  timestamp: '',
  date: '',
})

describe('exchangesOf', () => {
  it('groupe chaque question avec ce qui lui répond', () => {
    const groups = exchangesOf([
      line('q1', 'user'),
      line('r1', 'coach'),
      line('q2', 'user'),
      line('r2', 'coach'),
      line('q3', 'user'),
    ])
    expect(groups.map((g) => g.map((m) => m.id))).toEqual([['q1', 'r1'], ['q2', 'r2'], ['q3']])
  })

  it('rend une liste vide pour un fil vide', () => {
    expect(exchangesOf([])).toEqual([])
  })
})
