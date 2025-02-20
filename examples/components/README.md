# Components example

A deck authored as a plain list of React components — no MDX, no manual
`<Slide>` wrapping. Each top-level child of `<Deck>` is automatically rendered
as its own slide.

```tsx
<Deck>
  <Hero />
  <HowItWorks />
  <Counter />
  <Slide layout="center" accent="#7c5cff">
    <Outro />
  </Slide>
</Deck>
```

Mix plain components with explicit `<Slide>` elements freely — a child that is
already a `<Slide>` is left untouched, so you only reach for it when a slide
needs its own `layout`, `accent`, or `background`.

## Run it

```sh
pnpm --filter @slidesjs/example-components dev
```

## Export to PDF

```sh
pnpm --filter @slidesjs/example-components build
pnpm --filter @slidesjs/example-components export
```
