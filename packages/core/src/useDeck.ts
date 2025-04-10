import { useCallback, useEffect, useRef, useState } from 'react'
import {
  clampSlide,
  deriveIdx,
  easeInOutCubic,
  formatCounter,
  formatProgress,
  resolveWheel,
} from './deckMath'
import type { DeckConfig, DeckController } from './types'

const DEFAULTS = {
  glideMs: 650,
  wheelTrigger: 30,
  touchThreshold: 40,
  gestureSettleMs: 80,
  snapType: 'y mandatory',
}

export function useDeck(config: DeckConfig = {}): DeckController {
  const total = Math.max(1, config.total ?? 1)
  const glideMs = config.glideMs ?? DEFAULTS.glideMs
  const wheelTrigger = config.wheelTrigger ?? DEFAULTS.wheelTrigger
  const touchThreshold = config.touchThreshold ?? DEFAULTS.touchThreshold
  const gestureSettleMs = config.gestureSettleMs ?? DEFAULTS.gestureSettleMs
  const snapType = config.snapType ?? DEFAULTS.snapType
  const onChange = config.onChange

  const scrollerRef = useRef<HTMLElement | null>(null)
  const animIdRef = useRef<number | null>(null)
  const lockRef = useRef(false)
  const settledRef = useRef(true)
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const accRef = useRef(0)
  const idxRef = useRef(0)
  const [idx, setIdxState] = useState(0)
  const [scroller, setScrollerState] = useState<HTMLElement | null>(null)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const getIdx = useCallback(() => idxRef.current, [])

  const setIdx = useCallback((i: number) => {
    if (i === idxRef.current) return
    idxRef.current = i
    setIdxState(i)
    onChangeRef.current?.(i)
  }, [])

  const setScroller = useCallback((el: HTMLElement | null) => {
    scrollerRef.current = el
    setScrollerState(el)
  }, [])

  const goTo = useCallback(
    (i: number) => {
      const el = scrollerRef.current
      if (!el) return
      const clamped = clampSlide(i, total)
      const target = clamped * el.clientHeight
      const start = el.scrollTop

      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current)
        animIdRef.current = null
      }

      if (Math.abs(target - start) < 2) {
        el.style.scrollSnapType = snapType
        return
      }

      lockRef.current = true
      el.style.scrollSnapType = 'none'
      const startTime = performance.now()

      const step = (now: number) => {
        const progress = Math.min(1, (now - startTime) / glideMs)
        el.scrollTop = start + (target - start) * easeInOutCubic(progress)

        if (progress < 1) {
          animIdRef.current = requestAnimationFrame(step)
        } else {
          animIdRef.current = null
          lockRef.current = false
          el.style.scrollSnapType = snapType
        }
      }

      animIdRef.current = requestAnimationFrame(step)
    },
    [total, glideMs, snapType],
  )

  const next = useCallback(() => goTo(idxRef.current + 1), [goTo])
  const prev = useCallback(() => goTo(idxRef.current - 1), [goTo])

  const autoMs = config.autoScroll?.vertical
  useEffect(() => {
    if (!autoMs || autoMs <= 0) return
    const id = setInterval(() => {
      const cur = idxRef.current
      goTo(cur >= total - 1 ? 0 : cur + 1)
    }, autoMs)
    return () => clearInterval(id)
  }, [autoMs, total, goTo])

  const onScroll = useCallback(
    (e: { currentTarget: HTMLElement }) => {
      const el = e.currentTarget
      const i = deriveIdx(el.scrollTop, el.clientHeight)
      if (i >= 0 && i < total) setIdx(i)
    },
    [total, setIdx],
  )

  useEffect(() => {
    const el = scroller
    if (!el) return

    const endGesture = () => {
      settledRef.current = true
      accRef.current = 0
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (idleRef.current) clearTimeout(idleRef.current)
      idleRef.current = setTimeout(endGesture, gestureSettleMs)
      if (lockRef.current || !settledRef.current) return
      accRef.current += e.deltaY
      const dir = resolveWheel(accRef.current, wheelTrigger)
      if (dir === 0) return
      settledRef.current = false
      accRef.current = 0
      goTo(idxRef.current + dir)
    }

    let touchY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (lockRef.current) return
      const dy = touchY - e.changedTouches[0].clientY
      if (Math.abs(dy) < touchThreshold) return
      goTo(idxRef.current + (dy > 0 ? 1 : -1))
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      if (idleRef.current) clearTimeout(idleRef.current)
    }
  }, [scroller, goTo, gestureSettleMs, wheelTrigger, touchThreshold])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        goTo(idxRef.current + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        goTo(idxRef.current - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current)
    }
  }, [goTo])

  return {
    setScroller,
    idx,
    goTo,
    next,
    prev,
    getIdx,
    onScroll,
    onFirst: idx === 0,
    onLast: idx === total - 1,
    total,
    counterCurrent: formatCounter(idx),
    counterTotal: formatCounter(total - 1),
    progressPct: formatProgress(idx, total),
  }
}
