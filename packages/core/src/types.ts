import type { ComponentType, CSSProperties, ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

export type SlideLayout = 'default' | 'split' | 'center' | 'full'

export type SlideAlign = 'start' | 'center' | 'end'

export interface ThemeScheme {
  bg: string
  fg: string
  accent: string
  muted: string
  trackBg: string
  stripes: string
}

export interface ThemeFonts {
  display: string
  body: string
  mono: string
  serif: string
}

export interface ThemeTokens {
  name: string
  fonts: ThemeFonts
  light: ThemeScheme
  dark: ThemeScheme
}

export interface ResolvedTheme {
  dark: boolean
  vars: Record<string, string>
}

export interface AutoScrollConfig {
  vertical?: number
  horizontal?: number
}

export interface DeckConfig {
  total?: number
  glideMs?: number
  wheelTrigger?: number
  touchThreshold?: number
  gestureSettleMs?: number
  snapType?: string
  loop?: boolean
  autoScroll?: AutoScrollConfig
  onChange?: (idx: number) => void
}

export interface DeckController {
  setScroller: (el: HTMLElement | null) => void
  idx: number
  goTo: (i: number) => void
  next: () => void
  prev: () => void
  getIdx: () => number
  onScroll: (e: { currentTarget: HTMLElement }) => void
  onFirst: boolean
  onLast: boolean
  total: number
  counterCurrent: string
  counterTotal: string
  progressPct: string
}

export type ChromeCorner =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export type ChromePosition = ChromeCorner | 'left' | 'right'

export type DotsOrientation = 'horizontal' | 'vertical'

export interface ChromeSurface {
  background?: string
  opacity?: number
  borderColor?: string
  borderWidth?: number
  shadow?: string | boolean
  radius?: number
  padding?: number
}

export interface ChromeCounterOptions {
  position?: ChromePosition
  style?: CSSProperties
  className?: string
  appearance?: ChromeSurface
  render?: (info: { current: string; total: string; idx: number; total_: number }) => ReactNode
}

export interface ChromeDotsOptions {
  position?: ChromePosition
  orientation?: DotsOrientation
  arrows?: boolean
  appearance?: ChromeSurface
  style?: CSSProperties
  className?: string
  dotStyle?: (active: boolean) => CSSProperties
  arrowStyle?: CSSProperties
}

export interface ChromeProgressOptions {
  style?: CSSProperties
  className?: string
}

export interface ChromeOptions {
  progress?: boolean | ChromeProgressOptions
  counter?: boolean | ChromeCounterOptions
  dots?: boolean | ChromeDotsOptions
  rowDots?: ChromeDotsOptions
}

export interface SlideSpec {
  id?: string
  layout?: SlideLayout
  theme?: string
  accent?: string
  background?: string
  align?: SlideAlign
  Component: ComponentType
}

export interface SlideProps {
  layout?: SlideLayout
  accent?: string
  background?: string
  align?: SlideAlign
  children: ReactNode
}
