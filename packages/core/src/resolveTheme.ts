import type { ResolvedTheme, ThemeMode, ThemeScheme, ThemeTokens } from './types'

const schemeVars = (scheme: ThemeScheme): Record<string, string> => ({
  '--slides-bg': scheme.bg,
  '--slides-fg': scheme.fg,
  '--slides-accent': scheme.accent,
  '--slides-muted': scheme.muted,
  '--slides-track-bg': scheme.trackBg,
  '--slides-stripes': scheme.stripes,
})

export const resolveTheme = (
  tokens: ThemeTokens,
  mode: ThemeMode,
  sysDark: boolean,
): ResolvedTheme => {
  const dark = mode === 'dark' || (mode === 'system' && sysDark)
  const scheme = dark ? tokens.dark : tokens.light

  return {
    dark,
    vars: {
      ...schemeVars(scheme),
      '--slides-font-display': tokens.fonts.display,
      '--slides-font-body': tokens.fonts.body,
      '--slides-font-mono': tokens.fonts.mono,
      '--slides-font-serif': tokens.fonts.serif,
    },
  }
}
