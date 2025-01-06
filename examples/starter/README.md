# slidesjs starter

A complete, runnable deck that shows the whole of slidesjs working together — Markdown authoring, the editorial theme, the animated backdrop and PDF export.

## Run it

From the repository root, install once and then start the dev server:

```bash
pnpm install
pnpm --filter @slidesjs/example-starter dev
```

Open the printed URL and use the arrow keys, the mouse wheel or touch to move through the slides.

## Export it

Build the deck and then export it to a PDF:

```bash
pnpm --filter @slidesjs/example-starter build
pnpm --filter @slidesjs/example-starter export
```

The PDF is written to `deck.pdf` in this folder, with one page per slide.

## What to look at

- `src/deck.mdx` — the slides themselves, written in Markdown with a little inline JSX.
- `src/App.tsx` — how the deck, the theme provider and the backdrop are wired together, and how the backdrop is skipped in print mode.
- `vite.config.ts` — how the slides plugin is registered.
