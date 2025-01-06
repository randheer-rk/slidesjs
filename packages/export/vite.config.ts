import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const shebang = () => ({
  name: 'slidesjs-cli-shebang',
  generateBundle(_options: unknown, bundle: Record<string, { type: string; fileName: string; code?: string }>) {
    const cli = bundle['cli.js']
    if (cli && cli.type === 'chunk' && cli.code) {
      cli.code = `#!/usr/bin/env node\n${cli.code}`
    }
  },
})

export default defineConfig({
  plugins: [dts({ include: ['src'], rollupTypes: true }), shebang()],
  build: {
    target: 'node20',
    ssr: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        cli: resolve(__dirname, 'src/cli.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['puppeteer-core', 'sirv', 'node:http', 'node:path', 'node:fs', 'node:fs/promises', 'node:url'],
    },
  },
})
