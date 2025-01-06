import { exportDeck } from './exportDeck'
import type { ExportFormat, ExportOptions } from './exportDeck'

const parseArgs = (argv: string[]): ExportOptions => {
  const opts: Partial<ExportOptions> = { format: 'pdf' }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const value = argv[i + 1]
    switch (arg) {
      case '--url':
        opts.url = value
        i += 1
        break
      case '--dist':
        opts.dist = value
        i += 1
        break
      case '--out':
        opts.out = value
        i += 1
        break
      case '--format':
        opts.format = value as ExportFormat
        i += 1
        break
      case '--width':
        opts.width = Number(value)
        i += 1
        break
      case '--height':
        opts.height = Number(value)
        i += 1
        break
      case '--chrome':
        opts.chromePath = value
        i += 1
        break
      default:
        break
    }
  }

  if (!opts.out) throw new Error('slidesjs: --out is required')
  return opts as ExportOptions
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  await exportDeck(options)
  process.stdout.write(`slidesjs: exported ${options.format} to ${options.out}\n`)
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`)
  process.exit(1)
})
