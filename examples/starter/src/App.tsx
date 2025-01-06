import { useState } from 'react'
import { Deck, ThemeProvider, useTheme, isPrintMode } from '@slidesjs/core'
import { DeckBackdrop } from '@slidesjs/backdrop'
import '@slidesjs/core/theme.css'
import deck from './deck.mdx'

function Stage() {
  const { dark } = useTheme()
  const [idx, setIdx] = useState(0)

  return (
    <>
      {isPrintMode() ? null : <DeckBackdrop idx={idx} dark={dark} />}
      <Deck slides={deck.slides} config={{ onChange: setIdx }} />
    </>
  )
}

export default function App() {
  const mode = deck.frontmatter.themeMode === 'dark' ? 'dark' : 'light'
  return (
    <ThemeProvider mode={mode}>
      <Stage />
    </ThemeProvider>
  )
}
