import type { CSSProperties } from 'react'
import type { ChromeDotsOptions, ChromeSurface, DotsOrientation } from './types'

export const DEFAULT_SHADOW = '0 4px 16px rgba(0, 0, 0, 0.18)'

export const surfaceStyle = (s: ChromeSurface | undefined): CSSProperties => {
  if (!s) return {}
  const out: CSSProperties = {}
  if (s.background != null) out.background = s.background
  if (s.opacity != null) out.opacity = s.opacity
  if (s.borderWidth != null || s.borderColor != null) {
    out.border = `${s.borderWidth ?? 1}px solid ${s.borderColor ?? 'currentColor'}`
  }
  if (s.shadow != null && s.shadow !== false) {
    out.boxShadow = s.shadow === true ? DEFAULT_SHADOW : s.shadow
  }
  if (s.radius != null) out.borderRadius = s.radius
  if (s.padding != null) out.padding = s.padding
  return out
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

export interface DotsNav {
  idx: number
  total: number
  goTo: (i: number) => void
  next: () => void
  prev: () => void
  onFirst: boolean
  onLast: boolean
}

export interface DotsRailProps {
  nav: DotsNav
  options: ChromeDotsOptions
  orientation: DotsOrientation
  baseStyle: CSSProperties
  noun: string
  testid: string
  ariaLabel: string
}

export function DotsRail({ nav, options, orientation, baseStyle, noun, testid, ariaLabel }: DotsRailProps) {
  const { idx, total, goTo, next, prev, onFirst, onLast } = nav
  return (
    <nav
      data-testid={testid}
      data-orientation={orientation}
      aria-label={ariaLabel}
      className={['slides-dots', options.className].filter(Boolean).join(' ')}
      style={{ ...baseStyle, ...surfaceStyle(options.appearance), ...options.style }}
    >
      {options.arrows ? (
        <button
          type="button"
          className="slides-arrow"
          aria-label={`Previous ${noun}`}
          disabled={onFirst}
          onClick={prev}
          style={options.arrowStyle}
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
            className={options.dotStyle ? undefined : 'slides-dot'}
            aria-label={`Go to ${noun} ${i + 1}`}
            aria-current={active ? 'true' : undefined}
            style={options.dotStyle ? options.dotStyle(active) : undefined}
            onClick={() => goTo(i)}
          />
        )
      })}

      {options.arrows ? (
        <button
          type="button"
          className="slides-arrow"
          aria-label={`Next ${noun}`}
          disabled={onLast}
          onClick={next}
          style={options.arrowStyle}
        >
          <Chevron dir={arrowDir(orientation, 'next')} />
        </button>
      ) : null}
    </nav>
  )
}
