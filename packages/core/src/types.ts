import type { ComponentType, ReactNode } from 'react'

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

export interface DeckConfig {
  total?: number
  glideMs?: number
  wheelTrigger?: number
  touchThreshold?: number
  gestureSettleMs?: number
  snapType?: string
  loop?: boolean
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
