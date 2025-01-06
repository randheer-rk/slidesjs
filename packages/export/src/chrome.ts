import { existsSync } from 'node:fs'

const CANDIDATES = [
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/snap/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
]

export function findChromePath(explicit?: string): string | null {
  const ordered = [explicit, process.env.CHROME_PATH, ...CANDIDATES].filter(
    (value): value is string => Boolean(value),
  )
  for (const path of ordered) {
    if (existsSync(path)) return path
  }
  return null
}
