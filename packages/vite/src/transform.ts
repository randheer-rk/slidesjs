import { compile } from '@mdx-js/mdx'
import { parseDeck } from './parseDeck'
import type { ParsedSlide } from './parseDeck'

const RUNTIME_IMPORT =
  'import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";'

const isImport = (line: string): boolean => /^\s*import\s/.test(line)
const isRuntimeImport = (line: string): boolean => /react\/jsx-runtime/.test(line)

interface CompiledSlide {
  decl: string
  imports: string[]
}

const compileSlide = async (slide: ParsedSlide, index: number): Promise<CompiledSlide> => {
  const file = await compile(slide.content, { development: false })
  const lines = String(file).split('\n')
  const imports: string[] = []
  const rest: string[] = []

  for (const line of lines) {
    if (isImport(line)) {
      if (!isRuntimeImport(line)) imports.push(line)
      continue
    }
    rest.push(line)
  }

  const body = rest
    .join('\n')
    .replace(/export default function MDXContent/, 'return function MDXContent')

  return {
    imports,
    decl: `const Slide${index} = (function () {\n${body}\n})();`,
  }
}

const slideSpec = (slide: ParsedSlide, index: number): string => {
  const meta = { ...slide.frontmatter }
  return `{ ...${JSON.stringify(meta)}, Component: Slide${index} }`
}

export async function transformDeck(source: string): Promise<string> {
  const deck = parseDeck(source)
  const compiled = await Promise.all(deck.slides.map(compileSlide))

  const authorImports = Array.from(new Set(compiled.flatMap((c) => c.imports)))
  const decls = compiled.map((c) => c.decl)
  const specs = deck.slides.map((slide, i) => slideSpec(slide, i))

  return [
    RUNTIME_IMPORT,
    ...authorImports,
    '',
    ...decls,
    '',
    `const frontmatter = ${JSON.stringify(deck.frontmatter)};`,
    `const slides = [${specs.join(', ')}];`,
    'export { frontmatter, slides };',
    'export default { frontmatter, slides };',
    '',
  ].join('\n')
}
