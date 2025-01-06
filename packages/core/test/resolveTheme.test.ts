import { describe, it, expect } from 'vitest'
import { resolveTheme } from '../src/resolveTheme'
import { editorialTheme } from '../src/tokens'
import type { ThemeTokens } from '../src/types'

describe('editorialTheme', () => {
  it('uses the reference accent orange', () => {
    expect(editorialTheme.light.accent).toBe('#E8401C')
    expect(editorialTheme.dark.accent).toBe('#E8401C')
  })

  it('pairs an off-white light scheme with a near-black dark scheme', () => {
    expect(editorialTheme.light.bg).toBe('#FAFAF7')
    expect(editorialTheme.dark.bg).toBe('#121212')
  })
})

describe('resolveTheme', () => {
  it('resolves the light scheme when the mode is light', () => {
    const resolved = resolveTheme(editorialTheme, 'light', true)
    expect(resolved.dark).toBe(false)
    expect(resolved.vars['--slides-bg']).toBe('#FAFAF7')
  })

  it('resolves the dark scheme when the mode is dark', () => {
    const resolved = resolveTheme(editorialTheme, 'dark', false)
    expect(resolved.dark).toBe(true)
    expect(resolved.vars['--slides-bg']).toBe('#121212')
  })

  it('follows the system preference when the mode is system', () => {
    expect(resolveTheme(editorialTheme, 'system', true).dark).toBe(true)
    expect(resolveTheme(editorialTheme, 'system', false).dark).toBe(false)
  })

  it('maps every scheme token to a --slides-* variable', () => {
    const { vars } = resolveTheme(editorialTheme, 'light', false)
    expect(vars['--slides-fg']).toBe('#111111')
    expect(vars['--slides-accent']).toBe('#E8401C')
    expect(vars['--slides-muted']).toBe(editorialTheme.light.muted)
    expect(vars['--slides-track-bg']).toBe(editorialTheme.light.trackBg)
  })

  it('exposes the font stack as variables', () => {
    const { vars } = resolveTheme(editorialTheme, 'dark', false)
    expect(vars['--slides-font-display']).toBe(editorialTheme.fonts.display)
    expect(vars['--slides-font-body']).toBe(editorialTheme.fonts.body)
  })

  it('lets a custom theme override the defaults', () => {
    const custom: ThemeTokens = {
      ...editorialTheme,
      light: { ...editorialTheme.light, accent: '#0af' },
    }
    expect(resolveTheme(custom, 'light', false).vars['--slides-accent']).toBe('#0af')
  })
})
