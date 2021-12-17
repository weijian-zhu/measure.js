import Rect from './rect'
import config from './config'
import { clearPlaceholderElement, createPlaceholderElement } from './placeholder'
import { placeMark, removeMarks, placeMarkOutside } from './marker'

let active: boolean = false
let hoveringElement: HTMLElement | null = null
let selectedElement: HTMLElement | null
let targetElement: HTMLElement | null
let delayedDismiss = false
let delayedRef: ReturnType<typeof setTimeout> | null = null
import type { Measuring as MeasuringType } from './type'

const Measuring: MeasuringType = {
  start() {
    if (!document.body) {
      console.warn(`初始化measure.js插件失败`)
      return
    }

    if (window.$Measure) {
      window.removeEventListener('keydown', window.$Measure.keyDownHandler)
      window.removeEventListener('keyup', window.$Measure.keyUpHandler)
      window.removeEventListener('mousemove', window.$Measure.cursorMovedHandler)
      window.$Measure = null
      return
    }
    window.$Measure = {
      keyDownHandler,
      keyUpHandler,
      cursorMovedHandler
    }
    window.addEventListener('keydown', keyDownHandler)
    window.addEventListener('keyup', keyUpHandler)
    window.addEventListener('mousemove', cursorMovedHandler)
  }
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
    //使用插件中禁用滚动
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
      delayedDismiss ? 3000000 : 0
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

      let top: number, bottom: number, left: number, right: number

      //select dom和target dom之间是否有接触或者在内部
      if (selected.containing(target) || selected.inside(target) || selected.colliding(target)) {
        top = Math.round(Math.abs(selectedElementRect.top - targetElementRect.top))
        bottom = Math.round(Math.abs(selectedElementRect.bottom - targetElementRect.bottom))
        left = Math.round(Math.abs(selectedElementRect.left - targetElementRect.left))
        right = Math.round(Math.abs(selectedElementRect.right - targetElementRect.right))
        placeMark(selected, target, 'top', `${top}px`)
        placeMark(selected, target, 'bottom', `${bottom}px`)
        placeMark(selected, target, 'left', `${left}px`)
        placeMark(selected, target, 'right', `${right}px`)
      } else {
        top = Math.round(Math.abs(selectedElementRect.top - targetElementRect.bottom))
        bottom = Math.round(Math.abs(selectedElementRect.bottom - targetElementRect.top))
        left = Math.round(Math.abs(selectedElementRect.left - targetElementRect.right))
        right = Math.round(Math.abs(selectedElementRect.right - targetElementRect.left))
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

    createPlaceholderElement(
      'selected',
      rect.width,
      rect.height,
      rect.top,
      rect.left,
      config.selectedDomBorderColor
    )
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
    if (
      hoveringElement &&
      hoveringElement !== selectedElement &&
      hoveringElement !== targetElement
    ) {
      targetElement = hoveringElement
      clearPlaceholderElement('target')
      const rect = targetElement.getBoundingClientRect()
      createPlaceholderElement(
        'target',
        rect.width,
        rect.height,
        rect.top,
        rect.left,
        config.targetDomBorderColor
      )
      resolve()
    }
  })
}

function preventPageScroll(active: boolean): void {
  if (active) {
    window.addEventListener('DOMMouseScroll', scrollingPreventDefault, false)
    window.addEventListener('wheel', scrollingPreventDefault, {
      passive: false
    })
    window.addEventListener('mousewheel', scrollingPreventDefault, {
      passive: false
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

export default Measuring
