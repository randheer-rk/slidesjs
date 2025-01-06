import { describe, it, expect } from 'vitest'
import { parseFrontmatter } from '../src/frontmatter'

describe('parseFrontmatter', () => {
  it('parses a leading YAML block and returns the remaining body', () => {
    const source = '---\ntitle: My Talk\ntheme: editorial\n---\n# Hello'
    const { data, body } = parseFrontmatter(source)
    expect(data).toEqual({ title: 'My Talk', theme: 'editorial' })
    expect(body.trim()).toBe('# Hello')
  })

  it('returns empty data and the untouched body when no block is present', () => {
    const source = '# Just content\n\nNo frontmatter here.'
    const { data, body } = parseFrontmatter(source)
    expect(data).toEqual({})
    expect(body).toBe(source)
  })

  it('coerces booleans and numbers through YAML', () => {
    const { data } = parseFrontmatter('---\nbackdrop: true\ncount: 3\n---\nbody')
    expect(data.backdrop).toBe(true)
    expect(data.count).toBe(3)
  })

  it('throws a clear error on malformed YAML', () => {
    expect(() => parseFrontmatter('---\ntitle: : :\n bad\n---\nbody')).toThrow(/frontmatter/i)
  })
})
