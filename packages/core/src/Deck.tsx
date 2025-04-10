import { useEffect, useMemo, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Chrome } from './Chrome'
import { Slide, wrapAsSlide } from './Slide'
import { SlideRow } from './SlideRow'
import { useDeck } from './useDeck'
import { isPrintMode } from './print'
import type { ChromeOptions, DeckConfig, SlideSpec } from './types'

const isPrint = (): boolean => isPrintMode()

const pageStyle = (print: boolean): CSSProperties => ({
  position: 'relative',
  width: '100%',
  height: print ? undefined : '100vh',
  minHeight: print ? '100vh' : undefined,
  scrollSnapAlign: print ? undefined : 'start',
  scrollSnapStop: print ? undefined : 'always',
  breakAfter: print ? 'page' : undefined,
  overflow: 'hidden',
})

const scrollerStyle = (print: boolean): CSSProperties => ({
  position: print ? 'relative' : 'fixed',
  inset: 0,
  height: print ? 'auto' : '100vh',
  overflowY: print ? 'visible' : 'auto',
  scrollSnapType: print ? undefined : 'y mandatory',
})

export interface DeckProps {
  slides?: SlideSpec[]
  config?: DeckConfig
  chrome?: boolean | ChromeOptions
  children?: ReactNode
}

const renderSpec = (spec: SlideSpec) => {
  const { Component, ...rest } = spec
  return (
    <Slide {...rest}>
      <Component />
    </Slide>
  )
}

const toTopLevel = (children: ReactNode): ReactNode[] => {
  if (children == null || children === false) return []
  const arr = Array.isArray(children) ? children : [children]
  return arr.filter((c) => c != null && c !== false && c !== true)
}

const renderChild = (child: ReactNode, autoScrollH?: number): ReactNode =>
  Array.isArray(child) ? (
    <SlideRow autoScroll={autoScrollH}>{child}</SlideRow>
  ) : (
    wrapAsSlide(child)
  )

export function Deck({ slides, config = {}, chrome = true, children }: DeckProps) {
  const print = isPrint()
  const topLevel = useMemo(() => toTopLevel(children), [children])
  const items: ReactNode[] = slides
    ? slides.map((spec, i) => <div key={spec.id ?? i}>{renderSpec(spec)}</div>)
    : topLevel.map((child) => renderChild(child, config.autoScroll?.horizontal))
  const total = items.length || 1

  const deck = useDeck({ ...config, total })
  const readyRef = useRef(false)

  useEffect(() => {
    if (!print || readyRef.current) return
    readyRef.current = true
    const win = window as unknown as { __SLIDES_COUNT__?: number; __SLIDES_READY__?: boolean }
    win.__SLIDES_COUNT__ = total
    const ready = () => requestAnimationFrame(() => requestAnimationFrame(() => {
      win.__SLIDES_READY__ = true
    }))
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(ready)
    } else {
      ready()
    }
  }, [print, total])

  return (
    <>
      <div
        ref={deck.setScroller}
        className={print ? 'slides-scroller slides-print' : 'slides-scroller'}
        style={scrollerStyle(print)}
        onScroll={print ? undefined : deck.onScroll}
      >
        {items.map((node, i) => (
          <div key={i} data-slide-index={i} style={pageStyle(print)}>
            {node}
          </div>
        ))}
      </div>
      {chrome && !print ? (
        <Chrome controller={deck} options={typeof chrome === 'object' ? chrome : undefined} />
      ) : null}
    </>
  )
}
