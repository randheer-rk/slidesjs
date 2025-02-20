import { useState } from 'react'

export function Hero() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: 'clamp(40px, 8vw, 96px)', margin: 0 }}>slidesjs</h1>
      <p style={{ fontSize: 'clamp(16px, 2.5vw, 28px)', opacity: 0.7 }}>
        A deck built from a plain list of components.
      </p>
    </div>
  )
}

export function HowItWorks() {
  return (
    <div>
      <h2 style={{ fontSize: 'clamp(28px, 5vw, 56px)' }}>How it works</h2>
      <p style={{ fontSize: 'clamp(16px, 2.5vw, 26px)', lineHeight: 1.5 }}>
        Pass your components as children. Each one becomes its own slide —
        automatically wrapped, counted, and snap-scrolled.
      </p>
    </div>
  )
}

export function Counter() {
  const [n, setN] = useState(0)
  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: 'clamp(28px, 5vw, 56px)' }}>Slides stay interactive</h2>
      <p style={{ fontSize: 'clamp(48px, 10vw, 120px)', margin: '0.2em 0' }}>{n}</p>
      <button
        onClick={() => setN((v) => v + 1)}
        style={{
          fontSize: 'clamp(16px, 2.5vw, 24px)',
          padding: '0.5em 1.2em',
          borderRadius: 999,
          border: '2px solid currentColor',
          background: 'transparent',
          color: 'inherit',
          cursor: 'pointer',
        }}
      >
        Click me
      </button>
    </div>
  )
}

export function Outro() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: 'clamp(28px, 5vw, 56px)' }}>That's the whole idea.</h2>
      <p style={{ fontSize: 'clamp(16px, 2.5vw, 26px)', opacity: 0.7 }}>
        Reach for <code>&lt;Slide&gt;</code> only when a slide needs its own settings.
      </p>
    </div>
  )
}
