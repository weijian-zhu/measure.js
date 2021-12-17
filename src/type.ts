export type Measuring = {
  start: () => void
}

declare global {
  interface Window {
    $Measure: {
      keyDownHandler: (e: KeyboardEvent) => void
      keyUpHandler: (e: KeyboardEvent) => void
      cursorMovedHandler: (e: MouseEvent) => void
    } | null
  }
}
export type LineBorder = 'none' | 'x' | 'y'
export type Direction = 'top' | 'right' | 'bottom' | 'left'
export type PlaceholderType = 'selected' | 'target'
