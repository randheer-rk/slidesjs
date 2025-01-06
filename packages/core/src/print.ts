export const PRINT_PARAM = 'print'

export function isPrintMode(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has(PRINT_PARAM)
}
