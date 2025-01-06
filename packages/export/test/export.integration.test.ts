import { describe, it, expect } from 'vitest'
import { resolve } from 'node:path'
import { mkdtempSync, readFileSync, existsSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { exportDeck } from '../src/exportDeck'
import { findChromePath } from '../src/chrome'
import { serveDir } from '../src/serve'

const root = resolve(__dirname, '../../..')
const fixture = resolve(root, 'fixtures/print-deck')
const hasChrome = Boolean(findChromePath())

describe('findChromePath', () => {
  it('prefers an explicit path that exists', () => {
    expect(findChromePath('/definitely/not/here')).not.toBe('/definitely/not/here')
  })
})

describe('serveDir', () => {
  it('serves files on an ephemeral loopback port', async () => {
    const server = await serveDir(fixture)
    expect(server.url).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/)
    const res = await fetch(`${server.url}/index.html`)
    expect(res.status).toBe(200)
    await server.close()
  })
})

describe.skipIf(!hasChrome)('exportDeck', () => {
  const out = (name: string) => resolve(mkdtempSync(resolve(tmpdir(), 'slidesjs-')), name)

  it('renders the print deck to a non-empty PDF', async () => {
    const file = out('deck.pdf')
    await exportDeck({ dist: fixture, out: file, format: 'pdf' })
    expect(existsSync(file)).toBe(true)
    expect(statSync(file).size).toBeGreaterThan(1000)
    expect(readFileSync(file).subarray(0, 4).toString()).toBe('%PDF')
  }, 60_000)

  it('writes one PNG per slide', async () => {
    const file = out('deck.png')
    await exportDeck({ dist: fixture, out: file, format: 'png' })
    const base = file.replace(/\.png$/, '')
    expect(existsSync(`${base}-01.png`)).toBe(true)
    expect(existsSync(`${base}-02.png`)).toBe(true)
    expect(existsSync(`${base}-03.png`)).toBe(true)
  }, 60_000)

  it('requires a url or dist', async () => {
    await expect(
      exportDeck({ out: out('x.pdf'), format: 'pdf' } as never),
    ).rejects.toThrow(/url or a dist/)
  })
})
