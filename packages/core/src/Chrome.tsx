import type { CSSProperties } from 'react'
import { DotsRail, surfaceStyle } from './DotsRail'
import type {
  ChromeCounterOptions,
  ChromeDotsOptions,
  ChromeOptions,
  ChromePosition,
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
const positionStyle = (pos: ChromePosition): CSSProperties => {
  if (pos === 'left' || pos === 'right') {
    return { position: 'fixed', [pos]: GAP, top: '50%', transform: 'translateY(-50%)' }
  }
  const [v, h] = pos.split('-') as ['top' | 'bottom', 'left' | 'right']
  return { position: 'fixed', [v]: GAP, [h]: GAP }
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
            ...positionStyle(counter.position ?? 'bottom-left'),
            ...surfaceStyle(counter.appearance),
            ...counter.style,
          }}
        >
          {counter.render
            ? counter.render({ current: counterCurrent, total: counterTotal, idx, total_: total })
            : `${counterCurrent} / ${counterTotal}`}
        </div>
      ) : null}

      {dots ? (
        <DotsRail
          nav={{ idx, total, goTo, next, prev, onFirst, onLast }}
          options={dots}
          orientation={orientation}
          baseStyle={positionStyle(dots.position ?? 'bottom-right')}
          noun="slide"
          testid="slides-dots"
          ariaLabel="Slides"
        />
      ) : null}
    </>
  )
}
