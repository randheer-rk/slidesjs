import { Deck, Slide, ThemeProvider } from '@slidesjs/core'
import '@slidesjs/core/theme.css'
import { Hero, HowItWorks, Counter, Outro, DeepDiveA, DeepDiveB, DeepDiveC } from './slides'

export default function App() {
  return (
    <ThemeProvider mode="dark">
      <Deck
        config={{
          autoScroll: { horizontal: 2500 },
        }}
        chrome={{
          dots: {
            position: 'right',
            arrows: true,
            appearance: {
              background: 'rgba(255, 255, 255, 0.06)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
              borderWidth: 1,
              shadow: true,
              radius: 999,
              padding: 8,
            },
          },
          rowDots: {
            arrows: true,
            appearance: {
              background: 'rgba(255, 255, 255, 0.06)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
              borderWidth: 1,
              shadow: true,
              radius: 999,
              padding: 8,
            },
          },
        }}
      >

        <Hero />
        <HowItWorks />
        <Counter />

        {[<DeepDiveA key="a" />, <DeepDiveB key="b" />, <DeepDiveC key="c" />]}

        <Slide layout="center" accent="#7c5cff">
          <Outro />
        </Slide>
      </Deck>
    </ThemeProvider>
  )
}
