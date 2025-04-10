import { isValidElement } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { SlideAlign, SlideProps } from './types'

const alignItems: Record<SlideAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
}

export function Slide({
  layout = 'default',
  accent,
  background,
  align = 'center',
  children,
}: SlideProps) {
  const style: CSSProperties = {
    position: 'relative',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: alignItems[align],
    padding: 'clamp(32px, 7vw, 120px)',
    overflow: 'hidden',
    background: background ?? 'transparent',
  }

  if (accent) (style as Record<string, string>)['--slides-accent'] = accent

  return (
    <section className="slides-slide" data-layout={layout} style={style}>
      <div className="slides-inner" style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </section>
  )
}

export const wrapAsSlide = (node: ReactNode): ReactNode =>
  isValidElement(node) && node.type === Slide ? node : <Slide>{node}</Slide>
