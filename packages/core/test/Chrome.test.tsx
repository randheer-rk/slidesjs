import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Chrome } from '../src/Chrome'
import type { DeckController } from '../src/types'

const controller = (over: Partial<DeckController> = {}): DeckController => ({
  setScroller: () => {},
  idx: 0,
  goTo: vi.fn(),
  next: () => {},
  prev: () => {},
  getIdx: () => 0,
  onScroll: () => {},
  onFirst: true,
  onLast: false,
  total: 5,
  counterCurrent: '01',
  counterTotal: '05',
  progressPct: '20.0%',
  ...over,
})

describe('Chrome', () => {
  it('renders one navigation dot per slide', () => {
    render(<Chrome controller={controller()} />)
    expect(screen.getAllByRole('button', { name: /go to slide/i })).toHaveLength(5)
  })

  it('shows the current and total counter', () => {
    render(<Chrome controller={controller({ counterCurrent: '03', idx: 2 })} />)
    expect(screen.getByTestId('slides-counter')).toHaveTextContent('03 / 05')
  })

  it('sizes the progress bar to the progress percentage', () => {
    render(<Chrome controller={controller({ progressPct: '60.0%' })} />)
    expect(screen.getByTestId('slides-progress')).toHaveStyle({ width: '60.0%' })
  })

  it('navigates to the clicked slide', () => {
    const goTo = vi.fn()
    render(<Chrome controller={controller({ goTo })} />)
    fireEvent.click(screen.getByRole('button', { name: 'Go to slide 3' }))
    expect(goTo).toHaveBeenCalledWith(2)
  })

  it('marks the active dot as current', () => {
    render(<Chrome controller={controller({ idx: 2 })} />)
    expect(screen.getByRole('button', { name: 'Go to slide 3' })).toHaveAttribute(
      'aria-current',
      'true',
    )
  })
})
