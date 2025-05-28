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

describe('Chrome customisation', () => {
  it('hides parts that are disabled', () => {
    render(<Chrome controller={controller()} options={{ progress: false, counter: false }} />)
    expect(screen.queryByTestId('slides-progress')).toBeNull()
    expect(screen.queryByTestId('slides-counter')).toBeNull()
    expect(screen.getByTestId('slides-dots')).toBeInTheDocument()
  })

  it('positions the counter at the requested corner with custom style', () => {
    render(
      <Chrome
        controller={controller()}
        options={{ counter: { position: 'top-right', style: { fontSize: 22 } } }}
      />,
    )
    const counter = screen.getByTestId('slides-counter')
    expect(counter).toHaveStyle({ position: 'fixed', top: '28px', right: '28px', fontSize: '22px' })
  })

  it('renders a custom counter body', () => {
    render(
      <Chrome
        controller={controller({ idx: 1 })}
        options={{ counter: { render: ({ idx }) => `slide ${idx}` } }}
      />,
    )
    expect(screen.getByTestId('slides-counter')).toHaveTextContent('slide 1')
  })

  it('centres the dots on an edge for left/right positions', () => {
    render(<Chrome controller={controller()} options={{ dots: { position: 'right' } }} />)
    expect(screen.getByTestId('slides-dots')).toHaveStyle({
      position: 'fixed',
      right: '28px',
      top: '50%',
      transform: 'translateY(-50%)',
    })
  })

  it('defaults to a vertical rail with up/down chevrons', () => {
    render(<Chrome controller={controller()} options={{ dots: { arrows: true } }} />)
    expect(screen.getByTestId('slides-dots')).toHaveAttribute('data-orientation', 'vertical')
    expect(screen.getByRole('button', { name: 'Previous slide' }).querySelector('path')).toHaveAttribute(
      'd',
      'M18 15l-6-6-6 6',
    )
    expect(screen.getByRole('button', { name: 'Next slide' }).querySelector('path')).toHaveAttribute(
      'd',
      'M6 9l6 6 6-6',
    )
  })

  it('uses left/right chevrons when orientation is horizontal', () => {
    render(
      <Chrome controller={controller()} options={{ dots: { arrows: true, orientation: 'horizontal' } }} />,
    )
    expect(screen.getByRole('button', { name: 'Previous slide' }).querySelector('path')).toHaveAttribute(
      'd',
      'M15 18l-6-6 6-6',
    )
  })

  it('disables the prev arrow on the first slide', () => {
    render(
      <Chrome controller={controller({ onFirst: true })} options={{ dots: { arrows: true } }} />,
    )
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled()
  })

  it('navigates with the arrows', () => {
    const next = vi.fn()
    render(
      <Chrome controller={controller({ next, onLast: false })} options={{ dots: { arrows: true } }} />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(next).toHaveBeenCalled()
  })

  it('applies appearance options to the dots rail', () => {
    render(
      <Chrome
        controller={controller()}
        options={{
          dots: {
            appearance: {
              background: 'rgb(20, 20, 20)',
              opacity: 0.9,
              borderColor: 'rgb(255, 0, 0)',
              borderWidth: 2,
              shadow: true,
              radius: 14,
              padding: 8,
            },
          },
        }}
      />,
    )
    expect(screen.getByTestId('slides-dots')).toHaveStyle({
      background: 'rgb(20, 20, 20)',
      opacity: '0.9',
      border: '2px solid rgb(255, 0, 0)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.18)',
      borderRadius: '14px',
      padding: '8px',
    })
  })

  it('accepts a custom shadow string and styles the counter chip', () => {
    render(
      <Chrome
        controller={controller()}
        options={{ counter: { appearance: { background: '#222', shadow: '0 0 2px #000' } } }}
      />,
    )
    expect(screen.getByTestId('slides-counter')).toHaveStyle({
      background: '#222',
      boxShadow: '0 0 2px #000',
    })
  })

  it('applies a custom dot style', () => {
    render(
      <Chrome
        controller={controller({ idx: 0 })}
        options={{ dots: { dotStyle: (active) => ({ width: active ? 20 : 8 }) } }}
      />,
    )
    expect(screen.getByRole('button', { name: 'Go to slide 1' })).toHaveStyle({ width: '20px' })
  })
})
