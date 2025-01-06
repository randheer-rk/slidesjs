import { describe, it, expect } from 'vitest'
import {
  clampSlide,
  easeInOutCubic,
  deriveIdx,
  formatCounter,
  formatProgress,
  resolveWheel,
} from '../src/deckMath'

describe('clampSlide', () => {
  it('keeps an in-range index untouched', () => {
    expect(clampSlide(2, 5)).toBe(2)
  })

  it('clamps a negative index to zero', () => {
    expect(clampSlide(-3, 5)).toBe(0)
  })

  it('clamps an index past the end to the last slide', () => {
    expect(clampSlide(99, 5)).toBe(4)
  })
})

describe('easeInOutCubic', () => {
  it('is 0 at the start', () => {
    expect(easeInOutCubic(0)).toBe(0)
  })

  it('is 1 at the end', () => {
    expect(easeInOutCubic(1)).toBe(1)
  })

  it('is 0.5 at the midpoint', () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 10)
  })
})

describe('deriveIdx', () => {
  it('rounds the scroll position to the nearest slide', () => {
    expect(deriveIdx(0, 800)).toBe(0)
    expect(deriveIdx(820, 800)).toBe(1)
    expect(deriveIdx(1190, 800)).toBe(1)
    expect(deriveIdx(1210, 800)).toBe(2)
  })
})

describe('formatCounter', () => {
  it('pads single digit indexes to two characters', () => {
    expect(formatCounter(0)).toBe('01')
    expect(formatCounter(4)).toBe('05')
  })

  it('does not truncate larger numbers', () => {
    expect(formatCounter(11)).toBe('12')
  })
})

describe('formatProgress', () => {
  it('reports the first slide of five as twenty percent', () => {
    expect(formatProgress(0, 5)).toBe('20.0%')
  })

  it('reports the last slide as a hundred percent', () => {
    expect(formatProgress(4, 5)).toBe('100.0%')
  })
})

describe('resolveWheel', () => {
  it('ignores travel below the trigger', () => {
    expect(resolveWheel(20, 30)).toBe(0)
  })

  it('steps forward on downward travel above the trigger', () => {
    expect(resolveWheel(40, 30)).toBe(1)
  })

  it('steps backward on upward travel above the trigger', () => {
    expect(resolveWheel(-40, 30)).toBe(-1)
  })
})
