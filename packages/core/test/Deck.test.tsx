import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Deck } from '../src/Deck'
import { Slide } from '../src/Slide'

const Hero = () => <h1>Hero</h1>
const About = () => <p>About</p>

const pages = (container: HTMLElement) =>
  container.querySelectorAll('[data-slide-index]')

const slideSections = (container: HTMLElement) =>
  container.querySelectorAll('.slides-slide')

describe('Deck children', () => {
  it('wraps each plain component child in a Slide', () => {
    const { container } = render(
      <Deck chrome={false}>
        <Hero />
        <About />
      </Deck>,
    )
    expect(pages(container)).toHaveLength(2)
    expect(slideSections(container)).toHaveLength(2)
  })

  it('does not double-wrap children that are already Slides', () => {
    const { container } = render(
      <Deck chrome={false}>
        <Slide layout="split">
          <Hero />
        </Slide>
      </Deck>,
    )
    const sections = slideSections(container)
    expect(sections).toHaveLength(1)
    expect(sections[0]).toHaveAttribute('data-layout', 'split')
  })

  it('supports a mix of plain components and explicit Slides', () => {
    const { container } = render(
      <Deck chrome={false}>
        <Hero />
        <Slide layout="center">
          <About />
        </Slide>
      </Deck>,
    )
    expect(pages(container)).toHaveLength(2)
    expect(slideSections(container)).toHaveLength(2)
  })

  it('renders slides from the slides prop', () => {
    const { container } = render(<Deck chrome={false} slides={[{ Component: Hero }]} />)
    expect(slideSections(container)).toHaveLength(1)
  })
})
