import { describe, it, expect } from 'vitest'
import { transformDeck } from '../src/transform'

describe('transformDeck', () => {
  it('emits an ES module that default-exports a slides array', async () => {
    const code = await transformDeck('# One\n\n---\n\n# Two')
    expect(code).toMatch(/export default/)
    expect(code).toMatch(/slides/)
  })

  it('produces one component per slide', async () => {
    const code = await transformDeck('# One\n\n---\n\n# Two\n\n---\n\n# Three')
    expect(code).toContain('Slide0')
    expect(code).toContain('Slide2')
    expect(code).not.toContain('Slide3')
  })

  it('exports the deck frontmatter', async () => {
    const code = await transformDeck('---\ntitle: Talk\n---\n# One')
    expect(code).toContain('"title"')
    expect(code).toContain('Talk')
  })

  it('carries the per-slide layout into the slide spec', async () => {
    const code = await transformDeck('# One\n\n---\nlayout: split\n---\n## Two')
    expect(code).toContain('split')
  })

  it('preserves component imports written inside the deck', async () => {
    const code = await transformDeck("# One\n\n---\n\nimport { Counter } from './widgets'\n\n<Counter />")
    expect(code).toContain("from './widgets'")
    expect(code).toContain('Counter')
  })

  it('imports the jsx runtime exactly once', async () => {
    const code = await transformDeck('# One\n\n---\n\n# Two')
    const matches = code.match(/from ["']react\/jsx-runtime["']/g) ?? []
    expect(matches).toHaveLength(1)
  })
})
