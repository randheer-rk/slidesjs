import { writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'
import { findChromePath } from './chrome'
import { serveDir } from './serve'

export type ExportFormat = 'pdf' | 'html' | 'png'

export interface ExportOptions {
  url?: string
  dist?: string
  out: string
  format: ExportFormat
  width?: number
  height?: number
  chromePath?: string
  range?: [number, number]
}

const DEFAULT_WIDTH = 1440
const DEFAULT_HEIGHT = 900

const launchArgs = ['--no-sandbox', '--disable-gpu', '--use-gl=swiftshader']

export async function exportDeck(options: ExportOptions): Promise<void> {
  const { out, format } = options
  const width = options.width ?? DEFAULT_WIDTH
  const height = options.height ?? DEFAULT_HEIGHT

  if (!options.url && !options.dist) {
    throw new Error('slidesjs: provide either a url or a dist directory to export')
  }

  const executablePath = findChromePath(options.chromePath)
  if (!executablePath) {
    throw new Error(
      'slidesjs: no Chrome binary found — set CHROME_PATH or pass chromePath',
    )
  }

  const server = options.dist ? await serveDir(options.dist) : null
  const base = options.url ?? server!.url
  const target = `${base}${base.includes('?') ? '&' : '?'}print`

  const browser = await puppeteer.launch({ executablePath, headless: true, args: launchArgs })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width, height })

    const errors: string[] = []
    page.on('console', (msg) => {
      const text = msg.text()
      const benign = /Failed to load resource|WebGL|THREE\.WebGLRenderer/.test(text)
      if (msg.type() === 'error' && !benign) errors.push(text)
    })
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto(target, { waitUntil: 'networkidle0' })
    await page.waitForFunction('window.__SLIDES_READY__ === true', { timeout: 30_000 })

    if (errors.length > 0) {
      throw new Error(`slidesjs: deck reported errors during export — ${errors.join('; ')}`)
    }

    if (format === 'pdf') {
      const pageRanges = options.range ? `${options.range[0]}-${options.range[1]}` : undefined
      await page.pdf({
        path: out,
        printBackground: true,
        width: `${width}px`,
        height: `${height}px`,
        pageRanges,
      })
    } else if (format === 'html') {
      const html = await page.content()
      await writeFile(out, html, 'utf8')
    } else {
      const count = (await page.evaluate('window.__SLIDES_COUNT__')) as number
      for (let i = 0; i < count; i += 1) {
        const handle = await page.$(`[data-slide-index="${i}"]`)
        if (!handle) continue
        const path = out.replace(/\.png$/i, '') + `-${String(i + 1).padStart(2, '0')}.png`
        await handle.screenshot({ path })
      }
    }
  } finally {
    await browser.close()
    if (server) await server.close()
  }
}
