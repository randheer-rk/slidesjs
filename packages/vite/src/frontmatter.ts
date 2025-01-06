import { parse } from 'yaml'

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

export interface Frontmatter {
  data: Record<string, unknown>
  body: string
}

export function parseFrontmatter(source: string): Frontmatter {
  const match = source.match(FENCE)
  if (!match) return { data: {}, body: source }

  let parsed: unknown
  try {
    parsed = parse(match[1])
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    throw new Error(`slidesjs: could not parse frontmatter — ${reason}`)
  }

  const data = parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {}
  return { data, body: source.slice(match[0].length) }
}
