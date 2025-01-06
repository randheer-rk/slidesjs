import { parse } from 'yaml'
import { parseFrontmatter } from './frontmatter'

export interface ParsedSlide {
  frontmatter: Record<string, unknown>
  content: string
}

export interface ParsedDeck {
  frontmatter: Record<string, unknown>
  slides: ParsedSlide[]
}

const SEPARATOR = /^[ \t]*---[ \t]*$/
const MAPPING_LINE = /^[A-Za-z_][\w-]*\s*:/

const splitParts = (body: string): string[] => {
  const lines = body.split(/\r?\n/)
  const parts: string[] = []
  let current: string[] = []

  for (const line of lines) {
    if (SEPARATOR.test(line)) {
      parts.push(current.join('\n'))
      current = []
    } else {
      current.push(line)
    }
  }
  parts.push(current.join('\n'))

  return parts
}

const looksLikeFrontmatter = (part: string): boolean => {
  const lines = part.split('\n').filter((line) => line.trim() !== '')
  return lines.length > 0 && lines.every((line) => MAPPING_LINE.test(line.trim()))
}

const parseMapping = (part: string): Record<string, unknown> => {
  try {
    const parsed = parse(part)
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {}
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    throw new Error(`slidesjs: could not parse slide frontmatter — ${reason}`)
  }
}

export function parseDeck(source: string): ParsedDeck {
  const { data, body } = parseFrontmatter(source)
  const parts = splitParts(body)
  const slides: ParsedSlide[] = []

  let i = 0
  while (i < parts.length) {
    if (looksLikeFrontmatter(parts[i]) && i + 1 < parts.length) {
      slides.push({ frontmatter: parseMapping(parts[i]), content: parts[i + 1] })
      i += 2
    } else {
      slides.push({ frontmatter: {}, content: parts[i] })
      i += 1
    }
  }

  return { frontmatter: data, slides }
}
