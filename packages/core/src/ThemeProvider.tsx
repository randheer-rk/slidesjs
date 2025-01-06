import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { resolveTheme } from './resolveTheme'
import { editorialTheme } from './tokens'
import type { ResolvedTheme, ThemeMode, ThemeTokens } from './types'
import './theme.css'

const DARK_QUERY = '(prefers-color-scheme: dark)'

interface ThemeContextValue {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  dark: boolean
  tokens: ThemeTokens
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export interface ThemeProviderProps {
  theme?: ThemeTokens
  mode?: ThemeMode
  children: ReactNode
}

export function ThemeProvider({
  theme = editorialTheme,
  mode: initialMode = 'light',
  children,
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(initialMode)
  const [sysDark, setSysDark] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(DARK_QUERY).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(DARK_QUERY)
    const onChange = (e: MediaQueryListEvent) => setSysDark(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const resolved: ResolvedTheme = useMemo(
    () => resolveTheme(theme, mode, sysDark),
    [theme, mode, sysDark],
  )

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, setMode, dark: resolved.dark, tokens: theme }),
    [mode, resolved.dark, theme],
  )

  return (
    <ThemeContext.Provider value={value}>
      <div
        className="slides-root"
        data-theme={resolved.dark ? 'dark' : 'light'}
        style={resolved.vars as CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
