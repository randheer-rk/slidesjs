export const clampSlide = (i: number, total: number): number =>
  Math.max(0, Math.min(total - 1, i))

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export const deriveIdx = (scrollTop: number, clientHeight: number): number =>
  clientHeight === 0 ? 0 : Math.round(scrollTop / clientHeight)

export const formatCounter = (i: number): string =>
  String(i + 1).padStart(2, '0')

export const formatProgress = (i: number, total: number): string =>
  (((i + 1) / total) * 100).toFixed(1) + '%'

export const resolveWheel = (acc: number, trigger: number): number =>
  Math.abs(acc) < trigger ? 0 : acc > 0 ? 1 : -1
