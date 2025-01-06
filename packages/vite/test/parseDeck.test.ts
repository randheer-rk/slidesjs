import { describe, it, expect } from 'vitest'
import { parseDeck } from '../src/parseDeck'

describe('parseDeck', () => {
  it('reads the deck-level frontmatter', () => {
    const deck = parseDeck('---\ntitle: Talk\nbackdrop: true\n---\n# One')
    expect(deck.frontmatter).toEqual({ title: 'Talk', backdrop: true })
  })

  it('splits the body on bare --- separator lines', () => {
    const deck = parseDeck('# One\n\n---\n\n# Two\n\n---\n\n# Three')
    expect(deck.slides).toHaveLength(3)
    expect(deck.slides[0].content.trim()).toBe('# One')
    expect(deck.slides[2].content.trim()).toBe('# Three')
  })

  it('does not treat the leading frontmatter fence as a separator', () => {
    const deck = parseDeck('---\ntitle: Talk\n---\n# Only slide')
    expect(deck.slides).toHaveLength(1)
    expect(deck.slides[0].content.trim()).toBe('# Only slide')
  })

  it('attaches per-slide frontmatter', () => {
    const deck = parseDeck('# One\n\n---\nlayout: split\naccent: "#0af"\n---\n## Two')
    expect(deck.slides[1].frontmatter).toEqual({ layout: 'split', accent: '#0af' })
    expect(deck.slides[1].content.trim()).toBe('## Two')
  })

  it('yields a single slide for a deck without separators', () => {
    const deck = parseDeck('# Lonely slide')
    expect(deck.slides).toHaveLength(1)
  })

  it('preserves embedded JSX untouched', () => {
    const deck = parseDeck('# One\n\n---\n\n<Counter start={3} />')
    expect(deck.slides[1].content).toContain('<Counter start={3} />')
  })
})
