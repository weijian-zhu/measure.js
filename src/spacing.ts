import Rect from './rect'
import { clearPlaceholderElement, createPlaceholderElement } from './placeholder'
import { placeMark, removeMarks, placeMarkOutside } from './marker'

let active = false
let hoveringElement: HTMLElement | null = null
let selectedElement: HTMLElement | null
let targetElement: HTMLElement | null
let delayedDismiss = false
let delayedRef: ReturnType<typeof setTimeout> | null = null
import { Spacing as SpacingType } from './type'

const Spacing: SpacingType = {
  start() {
    if (!document.body) {
      console.warn(`Unable to initialise, document.body does not exist.`)
      return
    }

    window.addEventListener('keydown', keyDownHandler)
    window.addEventListener('keyup', keyUpHandler)
    window.addEventListener('mousemove', cursorMovedHandler)
  },
}

function keyDownHandler(e: KeyboardEvent) {
  if (delayedDismiss) {
    cleanUp()
    if (delayedRef) {
      clearTimeout(delayedRef)
      delayedRef = null
    }
  }

  if (e.key === 'Alt' && !active) {
    e.preventDefault()
    active = true

    setSelectedElement()
    preventPageScroll(true)
  }

  if (e.shiftKey) delayedDismiss = true
}

function keyUpHandler(e: KeyboardEvent) {
  if (e.key === 'Alt' && active) {
    active = false

    delayedRef = setTimeout(
      () => {
        cleanUp()
      },
      delayedDismiss ? 3000000 : 0,
    )
  }
}

function cleanUp(): void {
  clearPlaceholderElement('selected')
  clearPlaceholderElement('target')

  delayedDismiss = false

  selectedElement = null
  targetElement = null

  removeMarks()

  preventPageScroll(false)
}

function cursorMovedHandler(e: MouseEvent) {
  if (e.composedPath) {
    //使用composedPath来检测悬停元素是否支持阴影DOM
    hoveringElement = e.composedPath()[0] as HTMLElement
  } else {
    // 兼容方案
    hoveringElement = e.target as HTMLElement
  }
  if (!active) return

  setTargetElement().then(() => {
    if (selectedElement != null && targetElement != null) {
      // 框选出select dom和target dom后，计算两者的间距
      const selectedElementRect: DOMRect = selectedElement.getBoundingClientRect()
      const targetElementRect: DOMRect = targetElement.getBoundingClientRect()

      const selected: Rect = new Rect(selectedElementRect)
      const target: Rect = new Rect(targetElementRect)

      removeMarks()

      let top: number, bottom: number, left: number, right: number, outside: boolean

      //select dom和target dom之间是否有接触或者在内部
      if (selected.containing(target) || selected.inside(target) || selected.colliding(target)) {
        // if(selected.containing(target)){
        //   console.log('containing');
        // }
        // if(selected.inside(target)){
        //   console.log('inside');
        // }
        // if(selected.colliding(target)){
        //   console.log('colliding');
        // }

        // console.log(`containing || inside || colliding`);

        top = Math.round(Math.abs(selectedElementRect.top - targetElementRect.top))
        bottom = Math.round(Math.abs(selectedElementRect.bottom - targetElementRect.bottom))
        left = Math.round(Math.abs(selectedElementRect.left - targetElementRect.left))
        right = Math.round(Math.abs(selectedElementRect.right - targetElementRect.right))
        outside = false
        console.log('有接触或者内部')
        placeMark(selected, target, 'top', `${top}px`, outside)
        placeMark(selected, target, 'bottom', `${bottom}px`, outside)
        placeMark(selected, target, 'left', `${left}px`, outside)
        placeMark(selected, target, 'right', `${right}px`, outside)
      } else {
        console.log(`outside`)
        top = Math.round(Math.abs(selectedElementRect.top - targetElementRect.bottom))
        bottom = Math.round(Math.abs(selectedElementRect.bottom - targetElementRect.top))
        left = Math.round(Math.abs(selectedElementRect.left - targetElementRect.right))
        right = Math.round(Math.abs(selectedElementRect.right - targetElementRect.left))
        outside = true

        placeMarkOutside(selected, target, 'top', `${top}px`)
      }
    }
  })
}

function setSelectedElement(): void {
  if (hoveringElement && hoveringElement !== selectedElement) {
    selectedElement = hoveringElement
    clearPlaceholderElement('selected')

    const rect = selectedElement.getBoundingClientRect()

    createPlaceholderElement('selected', rect.width, rect.height, rect.top, rect.left, `#ED5666`)
  }
}

function setTargetElement(): Promise<void> {
  return new Promise((resolve, reject) => {
    //进入到这里一定是active=true的状态
    //如果hover = select，清空target所有的状态
    if (hoveringElement === selectedElement) {
      clearPlaceholderElement('target')
      removeMarks()
      targetElement = null
      return
    }
    if (hoveringElement && hoveringElement !== selectedElement && hoveringElement !== targetElement) {
      targetElement = hoveringElement
      clearPlaceholderElement('target')
      const rect = targetElement.getBoundingClientRect()
      createPlaceholderElement('target', rect.width, rect.height, rect.top, rect.left, '#0A91FC')
      resolve()
    }
  })
}

function preventPageScroll(active: boolean): void {
  if (active) {
    window.addEventListener('DOMMouseScroll', scrollingPreventDefault, false)
    window.addEventListener('wheel', scrollingPreventDefault, {
      passive: false,
    })
    window.addEventListener('mousewheel', scrollingPreventDefault, {
      passive: false,
    })
  } else {
    window.removeEventListener('DOMMouseScroll', scrollingPreventDefault)
    window.removeEventListener('wheel', scrollingPreventDefault)
    window.removeEventListener('mousewheel', scrollingPreventDefault)
  }
}

function scrollingPreventDefault(e: Event): void {
  e.preventDefault()
}

export default Spacing
