import { describe, it, expect, afterAll } from 'vitest'
import { resolve } from 'node:path'
import { createServer, type ViteDevServer } from 'vite'
import { slides } from '../src/index'

const root = resolve(__dirname, '../../..')

let server: ViteDevServer

const startServer = async (): Promise<ViteDevServer> => {
  if (!server) {
    server = await createServer({
      root,
      logLevel: 'silent',
      server: { middlewareMode: true },
      plugins: [slides()],
    })
  }
  return server
}

afterAll(async () => {
  if (server) await server.close()
})

describe('slides plugin', () => {
  it('turns an .mdx deck into a module exporting a slides array', async () => {
    const s = await startServer()
    const mod = await s.ssrLoadModule(resolve(root, 'fixtures/sample-deck.mdx'))
    expect(mod.default.slides).toHaveLength(3)
    expect(mod.default.frontmatter.title).toBe('Sample Deck')
    expect(typeof mod.default.slides[0].Component).toBe('function')
  })

  it('carries per-slide frontmatter into the spec', async () => {
    const s = await startServer()
    const mod = await s.ssrLoadModule(resolve(root, 'fixtures/sample-deck.mdx'))
    expect(mod.default.slides[1].layout).toBe('split')
  })

  it('leaves non-deck modules untouched', async () => {
    const s = await startServer()
    const out = await s.transformRequest('/fixtures/plain.js').catch(() => null)
    expect(out === null || !out.code.includes('const slides =')).toBe(true)
  })
})
