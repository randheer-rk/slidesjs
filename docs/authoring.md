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

### Wrapping a list of components

You do not have to reach for `Slide` at all. Any top-level child you pass is automatically wrapped in a `Slide` for you, so a plain list of components renders one slide per component:

```tsx
import { Deck } from '@slidesjs/core'

<Deck>
  <Hero />
  <About />
  <Contact />
</Deck>
```

Reach for `Slide` only when a particular slide needs its own settings — mix the two freely, and any child that already is a `Slide` is left exactly as you wrote it:

```tsx
<Deck>
  <Hero />
  <Slide layout="split" accent="#0af"><About /></Slide>
  <Contact />
</Deck>
```

## Customising the chrome

The "chrome" is the on-screen furniture the `Deck` draws around your slides: the
progress bar, the slide counter, and the navigation dots. By default you get all
three. Pass `chrome={false}` to hide them entirely, or pass an object to tune
each part.

```tsx
<Deck
  chrome={{
    progress: true,
    counter: { position: 'top-left', style: { fontSize: 16 } },
    dots: {
      position: 'bottom-right',
      orientation: 'vertical',
      arrows: true,
      dotStyle: (active) => ({
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: active ? '#7c5cff' : 'var(--slides-fg)',
        opacity: active ? 1 : 0.3,
      }),
    },
  }}
>
  {/* slides */}
</Deck>
```

### Positions

`counter` and `dots` each take a `position` — one of `top-left`, `top-right`,
`bottom-left`, `bottom-right`, or — handy for the vertical dot rail — `left` or
`right`, which centre it on that edge. The counter defaults to `bottom-left` and
the dots to `bottom-right`.

### Dot orientation and arrows

The dots are drawn as a rail of small ticks; the active slide stretches into a
rounded pill in the accent colour (the same accent as the progress bar). Because
the deck scrolls vertically, the rail is `vertical` by default — set
`dots.orientation` to `horizontal` if you prefer a bottom row instead.

When you turn on `dots.arrows`, prev/next chevrons appear flanking the dots and
follow the orientation automatically — up/down for the vertical rail, left/right
for a horizontal one. They fade and disable themselves on the first and last
slide.

### Styling

Every part accepts a `style` (and `className`) for its container. The dots also
take a `dotStyle(active)` callback for the individual dot buttons and an
`arrowStyle` for the arrow buttons. The counter accepts a `render` callback if
you want to replace its content completely:

```tsx
chrome={{ counter: { render: ({ current, total }) => `${current} of ${total}` } }}
```

Set any individual part to `false` to hide just that piece — for example
`chrome={{ progress: false }}` keeps the counter and dots but drops the bar.

## Horizontal sub-slides

The deck scrolls vertically. If you want a side-trip — a sequence the audience
moves through left-to-right before carrying on down — pass a **list** as one
child. That list becomes a horizontal row of sub-slides occupying a single
vertical slide:

```tsx
<Deck>
  <Intro />
  {[<DeepDiveA />, <DeepDiveB />, <DeepDiveC />]}
  <Conclusion />
</Deck>
```

Inside a row you navigate with the **left/right** arrow keys, a sideways swipe
or trackpad gesture, or the row's own dots; the **up/down** arrows still move
between the vertical slides. The row only responds to the horizontal keys while
it is the slide on screen. When you export to PDF the sub-slides are stacked
vertically so every one is captured.

You can also build a row explicitly with the `SlideRow` component, which is what
a list child renders to under the hood:

```tsx
import { SlideRow } from '@slidesjs/core'

<Deck>
  <Intro />
  <SlideRow>
    <DeepDiveA />
    <DeepDiveB />
  </SlideRow>
</Deck>
```

## Auto-advancing the deck

You can have the deck advance on its own. The two axes are configured separately
through the `config` prop, each as an interval in milliseconds:

```tsx
<Deck
  config={{
    autoScroll: {
      vertical: 8000,    // step down to the next slide every 8s
      horizontal: 4000,  // step across sub-slides within a row every 4s
    },
  }}
>
  {/* slides */}
</Deck>
```

Set either axis to `0` or leave it out to keep that axis manual. Both loop back
to the start when they reach the end. Horizontal auto-advance only runs while its
row is the slide on screen.

### Surface (background, border, shadow)

The counter and the dots rail each take an `appearance` object for the common
panel treatments, so you can float them on a chip without writing raw CSS:

```tsx
chrome={{
  dots: {
    position: 'right',
    appearance: {
      background: 'rgba(255, 255, 255, 0.06)',
      opacity: 1,
      borderColor: 'rgba(255, 255, 255, 0.12)',
      borderWidth: 1,        // px; implies a solid border
      shadow: true,          // or any box-shadow string
      radius: 999,           // px corner radius
      padding: 12,           // px room around the dots
    },
  },
}}
```

`shadow: true` uses a sensible default; pass a string for a custom one. Give the
surface a `padding` (and usually a `radius`) when you add a `background` or
border. Anything in `style` still wins, so you can override a specific property.

### Styling a row's dots

A row has its own dot indicator (bottom-centre), and it takes the **same options
as the deck dots** — arrows, `appearance`, `dotStyle`, `arrowStyle`. Set them for
every list-child row through `chrome.rowDots`:

```tsx
<Deck
  chrome={{
    rowDots: {
      arrows: true,
      appearance: { background: 'rgba(255,255,255,0.06)', borderWidth: 1, radius: 999, padding: 8 },
    },
  }}
>
  <Intro />
  {[<DeepDiveA />, <DeepDiveB />]}
</Deck>
```

An explicit `SlideRow` takes the same options directly via its `chrome` prop:
`<SlideRow chrome={{ arrows: true }}>…</SlideRow>`.
