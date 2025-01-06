import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useDeck } from '../src/useDeck'

const makeScroller = (clientHeight: number): HTMLDivElement => {
  const el = document.createElement('div')
  Object.defineProperty(el, 'clientHeight', { value: clientHeight, configurable: true })
  document.body.appendChild(el)
  return el
}

const scrollTo = (el: HTMLElement, top: number) => {
  el.scrollTop = top
}

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(performance.now() + 10_000)
    return 1
  })
  vi.stubGlobal('cancelAnimationFrame', () => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('useDeck', () => {
  it('derives total, counter and progress from the config', () => {
    const { result } = renderHook(() => useDeck({ total: 5 }))
    expect(result.current.total).toBe(5)
    expect(result.current.counterCurrent).toBe('01')
    expect(result.current.counterTotal).toBe('05')
    expect(result.current.progressPct).toBe('20.0%')
    expect(result.current.onFirst).toBe(true)
    expect(result.current.onLast).toBe(false)
  })

  it('glides goTo to the clamped slide offset', () => {
    const { result } = renderHook(() => useDeck({ total: 5 }))
    const el = makeScroller(800)
    act(() => result.current.setScroller(el))

    act(() => result.current.goTo(2))
    expect(el.scrollTop).toBe(1600)

    act(() => result.current.goTo(99))
    expect(el.scrollTop).toBe(3200)

    act(() => result.current.goTo(-4))
    expect(el.scrollTop).toBe(0)
  })

  it('updates idx, counter and progress from a scroll event', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useDeck({ total: 5, onChange }))
    const el = makeScroller(800)
    act(() => result.current.setScroller(el))

    scrollTo(el, 1600)
    act(() => result.current.onScroll({ currentTarget: el }))

    expect(result.current.idx).toBe(2)
    expect(result.current.counterCurrent).toBe('03')
    expect(result.current.progressPct).toBe('60.0%')
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('flags the last slide once reached', () => {
    const { result } = renderHook(() => useDeck({ total: 3 }))
    const el = makeScroller(500)
    act(() => result.current.setScroller(el))

    scrollTo(el, 1000)
    act(() => result.current.onScroll({ currentTarget: el }))

    expect(result.current.onLast).toBe(true)
    expect(result.current.onFirst).toBe(false)
  })

  it('advances and retreats with the arrow, page and space keys', () => {
    const { result } = renderHook(() => useDeck({ total: 5 }))
    const el = makeScroller(800)
    act(() => result.current.setScroller(el))

    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })))
    expect(el.scrollTop).toBe(800)

    scrollTo(el, 800)
    act(() => result.current.onScroll({ currentTarget: el }))
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })))
    expect(el.scrollTop).toBe(1600)

    scrollTo(el, 1600)
    act(() => result.current.onScroll({ currentTarget: el }))
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' })))
    expect(el.scrollTop).toBe(800)
  })

  it('steps with next and prev relative to the current slide', () => {
    const { result } = renderHook(() => useDeck({ total: 5 }))
    const el = makeScroller(800)
    act(() => result.current.setScroller(el))

    act(() => result.current.next())
    expect(el.scrollTop).toBe(800)

    scrollTo(el, 800)
    act(() => result.current.onScroll({ currentTarget: el }))
    act(() => result.current.prev())
    expect(el.scrollTop).toBe(0)
  })

  it('ignores wheel travel below the trigger and acts above it', () => {
    const { result } = renderHook(() => useDeck({ total: 5, wheelTrigger: 30 }))
    const el = makeScroller(800)
    act(() => result.current.setScroller(el))

    act(() => {
      el.dispatchEvent(new WheelEvent('wheel', { deltaY: 20, cancelable: true }))
    })
    expect(el.scrollTop).toBe(0)

    act(() => {
      el.dispatchEvent(new WheelEvent('wheel', { deltaY: 40, cancelable: true }))
    })
    expect(el.scrollTop).toBe(800)
  })
})
