export { useDeck } from './useDeck'
export { Deck } from './Deck'
export { Slide } from './Slide'
export { Chrome } from './Chrome'
export { ThemeProvider, useTheme } from './ThemeProvider'
export { isPrintMode } from './print'
export { editorialTheme } from './tokens'
export { resolveTheme } from './resolveTheme'
export {
  clampSlide,
  easeInOutCubic,
  deriveIdx,
  formatCounter,
  formatProgress,
  resolveWheel,
} from './deckMath'
export type {
  ThemeMode,
  ThemeTokens,
  ThemeScheme,
  ThemeFonts,
  ResolvedTheme,
  DeckConfig,
  DeckController,
  SlideSpec,
  SlideProps,
  SlideLayout,
  SlideAlign,
} from './types'

export type { ChromeProps } from './Chrome'
export type { DeckProps } from './Deck'
export type { ThemeProviderProps } from './ThemeProvider'
