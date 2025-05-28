import { Children, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { clampSlide, easeInOutCubic } from './deckMath'
import { DotsRail } from './DotsRail'
import { isPrintMode } from './print'
import { wrapAsSlide } from './Slide'
import type { ChromeDotsOptions } from './types'

const GLIDE_MS = 500
const WHEEL_TRIGGER = 30
const TOUCH_THRESHOLD = 40
const SETTLE_MS = 80

const wrapStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
}

const trackStyle: CSSProperties = {
  display: 'flex',
  width: '100%',
  height: '100%',
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollSnapType: 'x mandatory',
}

const pageStyle: CSSProperties = {
  position: 'relative',
  flexShrink: 0,
  width: '100%',
  height: '100%',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
}

const dotsStyle: CSSProperties = {
  position: 'absolute',
  bottom: 28,
  left: '50%',
  transform: 'translateX(-50%)',
}

export interface SlideRowProps {
  children: ReactNode
  autoScroll?: number
  chrome?: ChromeDotsOptions
}

export function SlideRow({ children, autoScroll, chrome = {} }: SlideRowProps) {
  const slides = useMemo(() => Children.toArray(children).map(wrapAsSlide), [children])
  const total = Math.max(1, slides.length)
  const print = isPrintMode()

  const trackRef = useRef<HTMLDivElement | null>(null)
  const idxRef = useRef(0)
  const animRef = useRef<number | null>(null)
  const activeRef = useRef(false)
  const [idx, setIdx] = useState(0)

  const goTo = useCallback(
    (i: number) => {
      const el = trackRef.current
      if (!el) return
      const clamped = clampSlide(i, total)
      const target = clamped * el.clientWidth
      const start = el.scrollLeft
      if (animRef.current) cancelAnimationFrame(animRef.current)
      if (Math.abs(target - start) < 2) return

      el.style.scrollSnapType = 'none'
      const t0 = performance.now()
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / GLIDE_MS)
        el.scrollLeft = start + (target - start) * easeInOutCubic(p)
        if (p < 1) {
          animRef.current = requestAnimationFrame(step)
        } else {
          animRef.current = null
          el.style.scrollSnapType = 'x mandatory'
        }
      }
      animRef.current = requestAnimationFrame(step)
    },
    [total],
  )

  const onScroll = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    if (i !== idxRef.current && i >= 0 && i < total) {
      idxRef.current = i
      setIdx(i)
    }
  }, [total])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = entry.isIntersecting && entry.intersectionRatio >= 0.5
      },
      { threshold: [0, 0.5, 1] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!activeRef.current) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        e.stopPropagation()
        goTo(idxRef.current + 1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        e.stopPropagation()
        goTo(idxRef.current - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo])

  useEffect(() => {
    if (!autoScroll || autoScroll <= 0) return
    const id = setInterval(() => {
      if (!activeRef.current) return
      const cur = idxRef.current
      goTo(cur >= total - 1 ? 0 : cur + 1)
    }, autoScroll)
    return () => clearInterval(id)
  }, [autoScroll, total, goTo])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let settled = true
    let timer: ReturnType<typeof setTimeout> | null = null

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      e.stopPropagation()
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        settled = true
      }, SETTLE_MS)
      if (!settled || Math.abs(e.deltaX) < WHEEL_TRIGGER) return
      settled = false
      goTo(idxRef.current + (e.deltaX > 0 ? 1 : -1))
    }

    let x0 = 0
    const onTouchStart = (e: TouchEvent) => {
      x0 = e.touches[0].clientX
    }
    const onTouchEnd = (e: TouchEvent) => {
      const dx = x0 - e.changedTouches[0].clientX
      if (Math.abs(dx) < TOUCH_THRESHOLD) return
      goTo(idxRef.current + (dx > 0 ? 1 : -1))
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
      if (timer) clearTimeout(timer)
    }
  }, [goTo])

  if (print) {
    return (
      <div style={{ width: '100%' }}>
        {slides.map((node, i) => (
          <div
            key={i}
            data-subslide-index={i}
            style={{ position: 'relative', width: '100%', minHeight: '100vh', breakAfter: 'page' }}
          >
            {node}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={wrapStyle}>
      <div ref={trackRef} className="slides-row" style={trackStyle} onScroll={onScroll}>
        {slides.map((node, i) => (
          <div key={i} data-subslide-index={i} style={pageStyle}>
            {node}
          </div>
        ))}
      </div>
      {total > 1 ? (
        <DotsRail
          nav={{
            idx,
            total,
            goTo,
            next: () => goTo(idxRef.current + 1),
            prev: () => goTo(idxRef.current - 1),
            onFirst: idx === 0,
            onLast: idx === total - 1,
          }}
          options={chrome}
          orientation={chrome.orientation ?? 'horizontal'}
          baseStyle={dotsStyle}
          noun="sub-slide"
          testid="slides-row-dots"
          ariaLabel="Sub-slides"
        />
      ) : null}
    </div>
  )
}
