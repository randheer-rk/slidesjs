import { describe, it, expect, beforeAll, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { Deck } from '../src/Deck'
import { SlideRow } from '../src/SlideRow'

const A = () => <h1>A</h1>
const B = () => <h1>B</h1>
const C = () => <h1>C</h1>

beforeAll(() => {
  class IO {
    cb: (entries: { isIntersecting: boolean; intersectionRatio: number }[]) => void
    constructor(cb: IO['cb']) {
      this.cb = cb
    }
    observe() {
      this.cb([{ isIntersecting: true, intersectionRatio: 1 }])
    }
    disconnect() {}
  }
  ;(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO
})

const subDots = () =>
  screen.queryByTestId('slides-row-dots')?.querySelectorAll('button') ?? []

describe('SlideRow', () => {
  it('wraps each sub-slide and renders a dot per sub-slide', () => {
    render(
      <SlideRow>
        <A />
        <B />
        <C />
      </SlideRow>,
    )
    expect(screen.getAllByRole('button', { name: /go to sub-slide/i })).toHaveLength(3)
    expect(document.querySelectorAll('.slides-slide')).toHaveLength(3)
  })

  it('omits the dots when there is only one sub-slide', () => {
    render(
      <SlideRow>
        <A />
      </SlideRow>,
    )
    expect(screen.queryByTestId('slides-row-dots')).toBeNull()
  })

  it('marks the first sub-slide active by default', () => {
    render(
      <SlideRow>
        <A />
        <B />
      </SlideRow>,
    )
    const dots = subDots()
    expect(dots[0]).toHaveAttribute('aria-current', 'true')
    expect(dots[1]).not.toHaveAttribute('aria-current')
  })

  it('frames a multi-sub-slide row with corner brackets by default', () => {
    render(
      <SlideRow>
        <A />
        <B />
      </SlideRow>,
    )
    const f = screen.getByTestId('slides-row-frame')
    expect(f.querySelectorAll('.slides-row-corner')).toHaveLength(4)
  })

  it('omits the frame when frame is false or there is one sub-slide', () => {
    const { rerender } = render(
      <SlideRow frame={false}>
        <A />
        <B />
      </SlideRow>,
    )
    expect(screen.queryByTestId('slides-row-frame')).toBeNull()
    rerender(
      <SlideRow>
        <A />
      </SlideRow>,
    )
    expect(screen.queryByTestId('slides-row-frame')).toBeNull()
  })

  it('applies chrome appearance and arrows to the row dots', () => {
    render(
      <SlideRow
        chrome={{
          arrows: true,
          appearance: { background: 'rgb(10, 10, 10)', borderWidth: 1, radius: 20, padding: 6 },
        }}
      >
        <A />
        <B />
      </SlideRow>,
    )
    const rail = screen.getByTestId('slides-row-dots')
    expect(rail).toHaveStyle({ background: 'rgb(10, 10, 10)', borderRadius: '20px', padding: '6px' })
    expect(screen.getByRole('button', { name: 'Previous sub-slide' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next sub-slide' })).toBeInTheDocument()
  })

  it('routes a Deck array group through chrome.rowDots', () => {
    render(
      <Deck chrome={{ rowDots: { arrows: true } }}>
        <A />
        {[<B key="b" />, <C key="c" />]}
      </Deck>,
    )
    expect(screen.getByRole('button', { name: 'Next sub-slide' })).toBeInTheDocument()
  })

  it('auto-advances horizontally on the configured interval while on screen', () => {
    vi.useFakeTimers()
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(performance.now() + 10_000)
      return 1
    })
    vi.stubGlobal('cancelAnimationFrame', () => {})
    try {
      render(
        <SlideRow autoScroll={1000}>
          <A />
          <B />
          <C />
        </SlideRow>,
      )
      const track = document.querySelector('.slides-row') as HTMLElement
      Object.defineProperty(track, 'clientWidth', { value: 1000, configurable: true })

      act(() => vi.advanceTimersByTime(1000))
      expect(track.scrollLeft).toBe(1000)
    } finally {
      vi.unstubAllGlobals()
      vi.useRealTimers()
    }
  })
})

describe('Deck horizontal groups', () => {
  it('renders an array child as a horizontal SlideRow', () => {
    render(
      <Deck chrome={false}>
        <A />
        {[<B key="b" />, <C key="c" />]}
      </Deck>,
    )
    expect(document.querySelectorAll('[data-slide-index]')).toHaveLength(2)
    expect(screen.getByTestId('slides-row-dots').querySelectorAll('button')).toHaveLength(2)
  })

  it('counts a group as a single vertical slide', () => {
    render(
      <Deck chrome>
        <A />
        {[<B key="b" />, <C key="c" />]}
      </Deck>,
    )
    expect(screen.getAllByRole('button', { name: /go to slide/i })).toHaveLength(2)
  })
})
