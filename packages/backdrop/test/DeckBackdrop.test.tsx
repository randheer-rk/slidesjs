import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DeckBackdrop } from '../src/index'

describe('DeckBackdrop', () => {
  it('renders a fixed, non-interactive backdrop layer', () => {
    const { container } = render(<DeckBackdrop idx={0} dark={false} />)
    const el = container.firstChild as HTMLElement
    expect(el).toBeTruthy()
    expect(el.style.position).toBe('fixed')
    expect(el.style.pointerEvents).toBe('none')
  })

  it('does not throw when WebGL is unavailable and the slide index changes', () => {
    const { rerender } = render(<DeckBackdrop idx={0} dark={false} />)
    expect(() => rerender(<DeckBackdrop idx={2} dark={true} />)).not.toThrow()
  })
})
