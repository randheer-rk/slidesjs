import type { ThemeTokens } from './types'

export const editorialTheme: ThemeTokens = {
  name: 'editorial',
  fonts: {
    display: "'Archivo Black', 'Archivo', sans-serif",
    body: "'Archivo', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Cascadia Code', monospace",
    serif: "'Instrument Serif', Georgia, serif",
  },
  light: {
    bg: '#FAFAF7',
    fg: '#111111',
    accent: '#E8401C',
    muted: '#E2DFD4',
    trackBg: 'rgba(17, 17, 17, 0.08)',
    stripes:
      'repeating-linear-gradient(45deg, #EEEBE2 0, #EEEBE2 12px, #F5F3EC 12px, #F5F3EC 24px)',
  },
  dark: {
    bg: '#121212',
    fg: '#FAFAF7',
    accent: '#E8401C',
    muted: '#2F2F2C',
    trackBg: 'rgba(250, 250, 247, 0.12)',
    stripes:
      'repeating-linear-gradient(45deg, #1C1C1B 0, #1C1C1B 12px, #232322 12px, #232322 24px)',
  },
}
