# Export guide

A presentation is not truly finished until you can share it. slidesjs lets you export your deck to a PDF, to a set of PNG images, or to a single static HTML file. This guide walks you through it.

## How export works

The export does not rely on fragile timing tricks. Instead, your `Deck` understands a special print mode. When the page is opened with a `?print` query parameter, the deck quietly re-renders every slide stacked one below the other as proper print pages, and then sets a small flag on the window to announce that it is ready.

The export command opens your built deck in headless Chrome with that `?print` parameter, waits for the ready flag, and then prints. Because it waits for an explicit signal, the result is deterministic — no guessing, no arbitrary sleeps.

## Before you export

First, build your deck as a normal static site:

```bash
vite build
```

This gives you a `dist` directory. That is what we will export.

## Exporting from the command line

Install the export package and use the `slidesjs-export` command:

```bash
pnpm add -D @slidesjs/export

slidesjs-export --dist ./dist --out ./talk.pdf --format pdf
```

The available options are:

| Option | Meaning |
| --- | --- |
| `--dist` | The built static directory to export. |
| `--url` | Instead of a directory, point at a running URL. |
| `--out` | Where to write the result. |
| `--format` | `pdf`, `png` or `html`. |
| `--width` | The viewport width in pixels. The default is 1440. |
| `--height` | The viewport height in pixels. The default is 900. |
| `--chrome` | The path to your Chrome or Chromium binary, if it is not found automatically. |

For PNG export, slidesjs writes one image per slide, numbered neatly as `talk-01.png`, `talk-02.png` and so on.

## Exporting from code

If you prefer, you may call the exporter directly:

```ts
import { exportDeck } from '@slidesjs/export'

await exportDeck({
  dist: './dist',
  out: './talk.pdf',
  format: 'pdf',
})
```

## Finding Chrome

The exporter needs a real Chrome or Chromium binary, because it uses `puppeteer-core` and does not bundle a browser of its own. It looks in the usual places automatically. If your browser sits somewhere unusual, kindly set the `CHROME_PATH` environment variable or pass `--chrome` (or `chromePath` in code).

## Hiding decorative layers in print

For a static PDF, an animated 3D backdrop serves no purpose. You may detect print mode and skip such decorative layers:

```tsx
import { isPrintMode } from '@slidesjs/core'

{isPrintMode() ? null : <DeckBackdrop idx={idx} dark={dark} />}
```

The starter example does exactly this, so do refer to it.

## A small safeguard

If any slide throws a real JavaScript error while the deck is rendering for export, the command stops and reports it, rather than silently producing a broken file. Harmless noise — such as a missing favicon or a WebGL warning in headless mode — is ignored, so it will not trouble you.
