import type { CSSProperties } from 'react'
import type {
  ChromeCorner,
  ChromeCounterOptions,
  ChromeDotsOptions,
  ChromeOptions,
  ChromeProgressOptions,
  DeckController,
  DotsOrientation,
} from './types'

const trackStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: 3,
  background: 'var(--slides-track-bg)',
  zIndex: 50,
}

const barStyle = (width: string): CSSProperties => ({
  height: '100%',
  width,
  background: 'var(--slides-accent)',
  transition: 'width 0.5s ease',
})

const counterBaseStyle: CSSProperties = {
  fontFamily: 'var(--slides-font-mono)',
  fontSize: 13,
  letterSpacing: '0.08em',
  color: 'var(--slides-fg)',
  zIndex: 50,
}

const GAP = 28
const cornerStyle = (corner: ChromeCorner): CSSProperties => {
  const [v, h] = corner.split('-') as ['top' | 'bottom', 'left' | 'right']
  return { position: 'fixed', [v]: GAP, [h]: GAP }
}

type ChevronDir = 'left' | 'right' | 'up' | 'down'
const CHEVRON_PATH: Record<ChevronDir, string> = {
  left: 'M15 18l-6-6 6-6',
  right: 'M9 18l6-6-6-6',
  up: 'M18 15l-6-6-6 6',
  down: 'M6 9l6 6 6-6',
}

function Chevron({ dir }: { dir: ChevronDir }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d={CHEVRON_PATH[dir]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const arrowDir = (orientation: DotsOrientation, edge: 'prev' | 'next'): ChevronDir => {
  if (orientation === 'vertical') return edge === 'prev' ? 'up' : 'down'
  return edge === 'prev' ? 'left' : 'right'
}

const resolve = <T,>(opt: boolean | T | undefined, fallback: T): T | null => {
  if (opt === false) return null
  if (opt === undefined || opt === true) return fallback
  return opt
}

export interface ChromeProps {
  controller: DeckController
  options?: ChromeOptions
}

export function Chrome({ controller, options = {} }: ChromeProps) {
  const {
    idx,
    total,
    goTo,
    next,
    prev,
    onFirst,
    onLast,
    counterCurrent,
    counterTotal,
    progressPct,
  } = controller

  const progress = resolve<ChromeProgressOptions>(options.progress, {})
  const counter = resolve<ChromeCounterOptions>(options.counter, {})
  const dots = resolve<ChromeDotsOptions>(options.dots, {})

  const orientation: DotsOrientation = dots?.orientation ?? 'vertical'

  return (
    <>
      {progress ? (
        <div className={progress.className} style={{ ...trackStyle, ...progress.style }}>
          <div data-testid="slides-progress" style={barStyle(progressPct)} />
        </div>
      ) : null}

      {counter ? (
        <div
          data-testid="slides-counter"
          className={counter.className}
          style={{
            ...counterBaseStyle,
            ...cornerStyle(counter.position ?? 'bottom-left'),
            ...counter.style,
          }}
        >
          {counter.render
            ? counter.render({ current: counterCurrent, total: counterTotal, idx, total_: total })
            : `${counterCurrent} / ${counterTotal}`}
        </div>
      ) : null}

      {dots ? (
        <nav
          data-testid="slides-dots"
          data-orientation={orientation}
          aria-label="Slides"
          className={['slides-dots', dots.className].filter(Boolean).join(' ')}
          style={{ ...cornerStyle(dots.position ?? 'bottom-right'), ...dots.style }}
        >
          {dots.arrows ? (
            <button
              type="button"
              className="slides-arrow"
              aria-label="Previous slide"
              disabled={onFirst}
              onClick={prev}
              style={dots.arrowStyle}
            >
              <Chevron dir={arrowDir(orientation, 'prev')} />
            </button>
          ) : null}

          {Array.from({ length: total }, (_, i) => {
            const active = i === idx
            return (
              <button
                key={i}
                type="button"
                className={dots.dotStyle ? undefined : 'slides-dot'}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active ? 'true' : undefined}
                style={dots.dotStyle ? dots.dotStyle(active) : undefined}
                onClick={() => goTo(i)}
              />
            )
          })}

          {dots.arrows ? (
            <button
              type="button"
              className="slides-arrow"
              aria-label="Next slide"
              disabled={onLast}
              onClick={next}
              style={dots.arrowStyle}
            >
              <Chevron dir={arrowDir(orientation, 'next')} />
            </button>
          ) : null}
        </nav>
      ) : null}
    </>
  )
}
