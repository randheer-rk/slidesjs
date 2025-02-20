import { Deck, Slide, ThemeProvider } from '@slidesjs/core'
import '@slidesjs/core/theme.css'
import { Hero, HowItWorks, Counter, Outro } from './slides'

export default function App() {
  return (
    <ThemeProvider mode="dark">
      <Deck>

        <Hero />
        <HowItWorks />
        <Counter />

        <Slide layout="center" accent="#7c5cff">
          <Outro />
        </Slide>
      </Deck>
    </ThemeProvider>
  )
}
