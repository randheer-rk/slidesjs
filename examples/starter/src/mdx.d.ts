declare module '*.mdx' {
  import type { SlideSpec } from '@slidesjs/core'
  const deck: { frontmatter: Record<string, unknown>; slides: SlideSpec[] }
  export default deck
  export const frontmatter: Record<string, unknown>
  export const slides: SlideSpec[]
}
