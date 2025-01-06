# Theming guide

slidesjs ships with a single, carefully tuned theme called `editorial`. It gives you the clean, high-contrast, typography-first look straight away. This guide explains how the theme works and how you may bend it to your own taste.

## How theming works

Theming rests on three simple ideas:

1. A **theme tokens** object describes the colours and fonts for both the light and the dark scheme.
2. The `ThemeProvider` resolves these tokens for the current mode and writes them out as CSS custom properties (variables) on a wrapper element.
3. Your slides simply read those variables, for example `var(--slides-accent)`.

So the theme is nothing but a tidy set of CSS variables, and overriding it is just a matter of supplying different token values.

## Using the provider

Wrap your deck in a `ThemeProvider`. Do not forget to import the stylesheet once, as it carries the fonts and the slide-transition keyframes:

```tsx
import { Deck, ThemeProvider } from '@slidesjs/core'
import '@slidesjs/core/theme.css'

<ThemeProvider mode="light">
  <Deck slides={deck.slides} />
</ThemeProvider>
```

The `mode` may be `light`, `dark` or `system`. When you choose `system`, the deck quietly follows the operating system preference.

## The variables on offer

After the provider has done its work, these variables are available everywhere inside the deck:

| Variable | Meaning |
| --- | --- |
| `--slides-bg` | The background colour. |
| `--slides-fg` | The foreground (text) colour. |
| `--slides-accent` | The accent colour — the famous orange in the default theme. |
| `--slides-muted` | A muted shade, useful for large background numerals. |
| `--slides-track-bg` | The colour of the progress track. |
| `--slides-stripes` | A diagonal stripe pattern, for decorative panels. |
| `--slides-font-display` | The display font, for big headings. |
| `--slides-font-body` | The body font. |
| `--slides-font-mono` | The monospace font, for code and labels. |
| `--slides-font-serif` | The serif font, for elegant accents. |

## Making the theme your own

The simplest way to change one or two things is to start from the `editorialTheme` and override what you wish:

```tsx
import { ThemeProvider, editorialTheme } from '@slidesjs/core'

const myTheme = {
  ...editorialTheme,
  light: { ...editorialTheme.light, accent: '#0a7cff' },
  dark: { ...editorialTheme.dark, accent: '#0a7cff' },
}

<ThemeProvider theme={myTheme} mode="light">
  <Deck slides={deck.slides} />
</ThemeProvider>
```

If you need a completely fresh look, you may supply your own tokens object in full. As long as it has a `name`, a `fonts` block and the `light` and `dark` schemes, slidesjs will be perfectly happy.

## Overriding a single slide

You need not change the whole theme just to make one slide stand out. The `accent` and `background` keys in a slide's frontmatter set scoped variables for that slide alone, leaving the rest of the deck untouched.

## A note on slide transitions

The signature zoom-through transition between slides uses the modern `animation-timeline: view()` feature. At present this is supported in Chromium-based browsers. Where it is not supported, the slides remain perfectly readable — they simply appear without the scroll-linked animation. Your PDF export is rendered with Chromium, so it is never affected.
