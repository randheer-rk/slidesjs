import type { CSSProperties } from 'react'
import type { DeckController } from './types'

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

const counterStyle: CSSProperties = {
  position: 'fixed',
  bottom: 24,
  left: 24,
  fontFamily: 'var(--slides-font-mono)',
  fontSize: 13,
  letterSpacing: '0.08em',
  color: 'var(--slides-fg)',
  zIndex: 50,
}

const dotsStyle: CSSProperties = {
  position: 'fixed',
  bottom: 24,
  right: 24,
  display: 'flex',
  gap: 10,
  zIndex: 50,
}

const dotStyle = (active: boolean): CSSProperties => ({
  width: 10,
  height: 10,
  padding: 0,
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  background: 'var(--slides-fg)',
  opacity: active ? 1 : 0.3,
  transform: active ? 'scale(1.2)' : 'scale(1)',
  transition: 'opacity 0.3s ease, transform 0.3s ease',
})

export interface ChromeProps {
  controller: DeckController
}

export function Chrome({ controller }: ChromeProps) {
  const { idx, total, goTo, counterCurrent, counterTotal, progressPct } = controller

  return (
    <>
      <div style={trackStyle}>
        <div data-testid="slides-progress" style={barStyle(progressPct)} />
      </div>
      <div data-testid="slides-counter" style={counterStyle}>
        {counterCurrent} / {counterTotal}
      </div>
      <div style={dotsStyle}>
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === idx ? 'true' : undefined}
            style={dotStyle(i === idx)}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </>
  )
}
