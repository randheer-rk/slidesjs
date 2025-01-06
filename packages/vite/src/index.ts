import type { Plugin } from 'vite'
import { transformDeck } from './transform'

export interface SlidesPluginOptions {
  include?: RegExp
  exclude?: RegExp
}

const DEFAULT_INCLUDE = /\.mdx?$/

export function slides(options: SlidesPluginOptions = {}): Plugin {
  const include = options.include ?? DEFAULT_INCLUDE
  const exclude = options.exclude

  return {
    name: 'slidesjs',
    enforce: 'pre',
    async transform(code, id) {
      const file = id.split('?')[0]
      if (!include.test(file)) return null
      if (exclude && exclude.test(file)) return null

      const out = await transformDeck(code)
      return { code: out, map: null }
    },
  }
}

export { transformDeck } from './transform'
export { parseDeck } from './parseDeck'
export { parseFrontmatter } from './frontmatter'
export type { ParsedDeck, ParsedSlide } from './parseDeck'
