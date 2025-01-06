# Authoring guide

This guide explains how to write a deck for slidesjs. The good news is that there is very little to learn — if you can write Markdown, you can already make a deck.

## The deck file

A deck is a single `.md` or `.mdx` file. The Vite plugin reads this file and hands you back two things: the deck-level `frontmatter` and an array of `slides`. You then pass the slides to the `Deck` component.

```tsx
import deck from './deck.mdx'
// deck.frontmatter -> { title, themeMode, ... }
// deck.slides      -> [{ Component, layout, ... }, ...]
```

## Separating slides

Slides are separated by a line that contains only three dashes:

```mdx
# First slide

---

# Second slide

---

# Third slide
```

Please remember this one small thing — a bare `---` always means "start a new slide". So if you ever need an actual horizontal rule inside a slide, kindly use `***` or `___` instead. This keeps the splitting completely unambiguous.

## Frontmatter

### Deck-level frontmatter

The block at the very top of the file is the deck-level frontmatter. This is where you put settings for the whole presentation:

```mdx
---
title: My Talk
themeMode: light
backdrop: true
---
```

You receive this object as `deck.frontmatter` and you are free to use it however you like — for the document title, for choosing the theme mode, and so on.

### Slide-level frontmatter

Any individual slide may also carry its own frontmatter, written right after the separator:

```mdx
---
layout: split
accent: "#0af"
background: "#111111"
---

## A slide with its own settings
```

These keys become props on the `Slide` that wraps your content:

| Key | Meaning |
| --- | --- |
| `layout` | One of `default`, `split`, `center` or `full`. |
| `accent` | Overrides the accent colour for this one slide. |
| `background` | Sets a background colour for this one slide. |
| `align` | Vertical alignment — `start`, `center` or `end`. |

## Embedding components

Because the deck is MDX, you may import and use any React component inside a slide. Simply write the import at the top of the slide and use the component as you normally would:

```mdx
---

import { Counter } from './widgets'

## A live component

<Counter start={3} />
```

This is the whole point of MDX — your prose and your components sit happily side by side. Do use it freely for charts, diagrams, code playgrounds, or anything else your talk needs.

## Composing slides by hand

If you would rather not use Markdown at all, you may compose the deck directly with the `Deck` and `Slide` components:

```tsx
import { Deck, Slide } from '@slidesjs/core'

<Deck>
  <Slide><Hero /></Slide>
  <Slide layout="split"><About /></Slide>
</Deck>
```

When you pass children like this, the `Deck` counts them for you, so you need not specify the total number of slides anywhere.
