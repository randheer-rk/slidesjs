# slidesjs

slidesjs is a React and Vite based framework for making beautiful presentations. You write your slides in Markdown, you sprinkle in React components wherever you need them, and you get a polished editorial deck with smooth scroll navigation, a tasteful theme, an animated backdrop and one-command PDF export. The whole thing is meant to feel effortless, so that you can spend your energy on the talk and not on the tooling.

## What you get

- **Markdown and MDX authoring** — kindly write your slides the way you write your notes. Plain Markdown is enough, and the moment you need something interactive, you simply drop a React component in the middle of the slide.
- **A ready editorial theme** — the default theme is the same crisp, high-contrast look you have admired in modern portfolio decks. Big display type, a confident accent colour and plenty of breathing space.
- **Scroll, keyboard and touch navigation** — arrow keys, page keys, the space bar, the mouse wheel and touch swipes all work out of the box, with a gentle glide between slides.
- **PDF, PNG and static HTML export** — once your deck is ready, do export it to a shareable PDF with a single command.
- **An animated 3D backdrop** — an optional Three.js particle field that drifts behind your slides and gives the deck a sense of depth.

## The packages

slidesjs is a pnpm monorepo. Each concern lives in its own package, so the heavy dependencies stay out of your way unless you actually ask for them.

| Package | Purpose |
| --- | --- |
| `@slidesjs/core` | The React runtime — the `Deck`, the `Slide`, the navigation hook and the theming. This is the only package you must have. |
| `@slidesjs/vite` | The Vite plugin that turns your `.md` and `.mdx` deck files into slides. |
| `@slidesjs/export` | The export command that renders your built deck to PDF, PNG or HTML using headless Chrome. |
| `@slidesjs/backdrop` | The optional animated Three.js backdrop. Pulls in `three` only when you use it. |

## Getting started

Install the core runtime and the Vite plugin in your React + Vite project:

```bash
pnpm add @slidesjs/core
pnpm add -D @slidesjs/vite
```

Register the plugin in your `vite.config.ts`. Please keep the slides plugin before the React plugin:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { slides } from '@slidesjs/vite'

export default defineConfig({
  plugins: [slides(), react()],
})
```

Write your first deck in `src/deck.mdx`:

```mdx
---
title: My First Talk
themeMode: light
---

# Hello, everyone

A first slide, written in plain Markdown.

---

## The second slide

<MyChart data={numbers} />
```

And wire it up in your app:

```tsx
import { Deck, ThemeProvider } from '@slidesjs/core'
import '@slidesjs/core/theme.css'
import deck from './deck.mdx'

export default function App() {
  return (
    <ThemeProvider mode="light">
      <Deck slides={deck.slides} />
    </ThemeProvider>
  )
}
```

That is all. Run `vite` and your deck is live. Press the arrow keys to move around.

## Learn more

- [Authoring guide](docs/authoring.md) — how to structure a deck file, use frontmatter and embed components.
- [Theming guide](docs/theming.md) — how the editorial theme works and how to make it your own.
- [Export guide](docs/export.md) — how to take your deck to PDF and images.

A complete, runnable deck lives in `examples/starter`. Do have a look at it — it is the quickest way to see everything working together.

## Development

This repository follows test-driven development throughout. Every package is built test-first.

```bash
pnpm install
pnpm test         # run the full Vitest suite
pnpm build        # build every package
```

The export integration tests need a Chrome or Chromium binary. If none is found, those particular tests are skipped automatically, so the suite stays green on machines without a browser.

## License

MIT.
