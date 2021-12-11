import Rect from './rect'
import type { LineBorder, Direction } from './type'

function createLine(width: number, height: number, top: number, left: number, text: string, border: LineBorder = 'none'): void {
  let marker: HTMLSpanElement = document.createElement('span')
  marker.style.backgroundColor = '#ED5666'
  marker.style.position = 'fixed'
  marker.classList.add(`spacing-js-marker`)
  marker.style.width = `${width}px`
  marker.style.height = `${height}px`

  if (border === 'x') {
    marker.style.borderLeft = '1px solid rgba(255, 255, 255, .8)'
    marker.style.borderRight = '1px solid rgba(255, 255, 255, .8)'
  }

  if (border === 'y') {
    marker.style.borderTop = '1px solid rgba(255, 255, 255, .8)'
    marker.style.borderBottom = '1px solid rgba(255, 255, 255, .8)'
  }

  marker.style.pointerEvents = 'none'
  marker.style.top = `${top}px`
  marker.style.left = `${left}px`
  marker.style.zIndex = '9998'
  marker.style.boxSizing = 'content-box'

  let value: HTMLSpanElement = document.createElement('span')
  value.classList.add(`spacing-js-value`)
  value.style.backgroundColor = '#ED5666'
  value.style.color = 'white'
  value.style.fontSize = '10px'
  value.style.display = 'inline-block'
  value.style.fontFamily = 'Helvetica, sans-serif'
  value.style.fontWeight = 'bold'
  value.style.borderRadius = '20px'
  value.style.position = 'fixed'
  value.style.width = '42px'
  value.style.lineHeight = '15px'
  value.style.height = '16px'
  value.style.textAlign = 'center'
  value.style.zIndex = '10000'
  value.style.pointerEvents = 'none'
  value.innerText = text
  value.style.boxSizing = 'content-box'

  if (border === 'x') {
    // 防止文字在屏幕外面
    let topOffset = top + height / 2 - 7

    //超过屏幕高度
    if (topOffset > document.documentElement.clientHeight - 20) {
      topOffset = document.documentElement.clientHeight - 20
    }
    //小于屏幕高度
    if (topOffset < 0) {
      topOffset = 6
    }

    value.style.top = `${topOffset}px`
    value.style.left = `${left + 6}px`
  } else if (border === 'y') {
    let leftOffset = left + width / 2 - 20

    if (leftOffset > document.documentElement.clientWidth - 48) {
      leftOffset = document.documentElement.clientWidth - 48
    }

    if (leftOffset < 0) {
      leftOffset = 6
    }

    value.style.top = `${top + 6}px`
    value.style.left = `${leftOffset}px`
  }

  document.body.appendChild(marker)
  document.body.appendChild(value)
}

function createDashLine(width: number, height: number, top: number, left: number, border: LineBorder = 'none') {
  let marker: HTMLSpanElement = document.createElement('span')
  marker.style.position = 'fixed'
  marker.classList.add(`spacing-js-marker`)
  marker.style.width = `${width}px`
  marker.style.height = `${height}px`

  if (border === 'x') {
    marker.style.background = 'linear-gradient(to bottom, red, red 3px, transparent 3px, transparent)'
    marker.style.backgroundSize = '100% 5px'
  }

  if (border === 'y') {
    marker.style.background = 'linear-gradient(to right, red, red 3px, transparent 3px, transparent)'
    marker.style.backgroundSize = '5px 100%'
  }

  marker.style.pointerEvents = 'none'
  marker.style.top = `${top}px`
  marker.style.left = `${left}px`
  marker.style.zIndex = '9998'
  marker.style.boxSizing = 'content-box'
  document.body.appendChild(marker)
}

export function placeMarkOutside(rect1: Rect, rect2: Rect, direction: Direction, value: string) {
  //select dom 和 target dom 并集的情况
  if (rect1.outsideAndNOIntersection(rect2)) {
    //水平和垂直方向没有相交的情况
    // 水平方向
    {
      let xTop = (rect1.top + rect1.bottom) / 2
      let xLeft = rect1.left > rect2.right ? rect2.right : rect1.right
      let xHeight = 1
      let xWidth = Math.abs(rect1.left > rect2.right ? rect1.left - rect2.right : rect2.left - rect1.right)
      createLine(xWidth, xHeight, xTop, xLeft, `${xWidth}px`, 'y')
      //画虚线
      let top = rect2.top > rect1.bottom ? xTop : rect2.bottom
      let height = Math.abs(rect2.top > rect1.bottom ? xTop - rect2.top : xTop - rect2.bottom)
      let width = 1
      let left = rect2.left > rect1.right ? xLeft + xWidth : rect2.right
      createDashLine(width, height, top, left, 'x')
    }

    //垂直方向
    {
      let yTop = rect1.top > rect2.bottom ? rect2.bottom : rect1.bottom
      let yLeft = (rect1.left + rect1.right) / 2
      let yHeight = Math.abs(rect1.top > rect2.bottom ? rect1.top - rect2.bottom : rect2.top - rect1.bottom)
      let yWidth = 1
      createLine(yWidth, yHeight, yTop, yLeft, `${yHeight}px`, 'x')
      //画虚线
      let top = rect2.top > rect1.bottom ? yHeight + rect1.bottom : rect2.bottom
      let height = 1
      let width = Math.abs(rect2.left > rect1.right ? yLeft - rect2.left : yLeft - rect2.right)
      let left = rect2.left > rect1.right ? yLeft : rect2.right
      createDashLine(width, height, top, left, 'y')
    }
    //水平或者垂直方向空间上有相交的情况
  } else {
    if (!rect1.outsideAndNOIntersectionY(rect2)) {
      //垂直方向上有相交
      let left = rect1.left > rect2.left ? (rect2.right + rect1.left) / 2 : (rect1.right + rect2.left) / 2
      if (rect1.outsideIncludeY(rect2) || rect2.outsideIncludeY(rect1)) {
        left = (rect2.width > rect1.width ? rect1.left + rect1.right : rect2.left + rect2.right) / 2
      }
      let height = Math.min(Math.abs(rect2.top - rect1.bottom), Math.abs(rect2.bottom - rect1.top))
      let top = rect2.top > rect1.bottom ? rect1.bottom : rect2.bottom
      let width = 1
      createLine(width, height, top, left, `${height}px`, 'x')
      //---------

      {
        // 右对右的线
        // let xTop = rect2.left > rect1.left ? (rect1.top + rect1.bottom) / 2 : (rect2.top + rect2.bottom) / 2
        let xTop = rect2.right > rect1.right ? (rect1.top + rect1.bottom) / 2 : (rect2.top + rect2.bottom) / 2
        let xLeft = rect2.right > rect1.right ? rect1.right : rect2.right
        let xHeight = 1
        let xWidth = Math.abs(rect2.right - rect1.right)
        createLine(xWidth, xHeight, xTop, xLeft, `${xWidth}px`, 'y')
        //画虚线
        let top = Math.min(xTop, rect2.bottom, rect1.bottom)
        let height =
          rect2.right > rect1.right
            ? Math.min(Math.abs(xTop - rect2.top), Math.abs(xTop - rect2.bottom))
            : Math.min(Math.abs(xTop - rect1.top), Math.abs(xTop - rect1.bottom))
        let width = 1
        let left = Math.max(rect1.right, rect2.right)
        createDashLine(width, height, top, left, 'x')
      }
      {
        // 左对左的线
        let xTop = rect2.left > rect1.left ? (rect2.top + rect2.bottom) / 2 : (rect1.top + rect1.bottom) / 2
        let xLeft = rect2.left > rect1.left ? rect1.left : rect2.left
        let xHeight = 1
        let xWidth = Math.abs(rect2.left - rect1.left)
        createLine(xWidth, xHeight, xTop, xLeft, `${xWidth}px`, 'y')
        //画虚线
        let top = Math.min(xTop, rect2.bottom, rect1.bottom)
        let height =
          rect2.left > rect1.left
            ? Math.min(Math.abs(xTop - rect1.bottom), Math.abs(xTop - rect1.top))
            : Math.min(Math.abs(xTop - rect2.bottom), Math.abs(xTop - rect2.top))
        let width = 1
        let left = Math.min(rect1.left, rect2.left)
        createDashLine(width, height, top, left, 'x')
      }
    } else if (!rect1.outsideAndNOIntersectionX(rect2)) {
      //水平方向上有相交
    }
  }
}

export function placeMark(rect1: Rect, rect2: Rect, direction: Direction, value: string, edgeToEdge: boolean = false): void {
  //select dom 和 target dom 交集的情况
  if (direction === 'top') {
    let width: number = 1
    let height: number = Math.abs(rect1.top - rect2.top)
    let left: number = Math.floor((Math.min(rect1.right, rect2.right) + Math.max(rect1.left, rect2.left)) / 2)
    let top: number = Math.min(rect1.top, rect2.top)

    createLine(width, height, top, left, value, 'x')
  } else if (direction === 'left') {
    let width: number = Math.abs(rect1.left - rect2.left)
    let height: number = 1
    let top: number = Math.floor((Math.min(rect1.bottom, rect2.bottom) + Math.max(rect1.top, rect2.top)) / 2)
    let left: number = Math.min(rect1.left, rect2.left)

    createLine(width, height, top, left, value, 'y')
  } else if (direction === 'right') {
    let width: number = Math.abs(rect1.right - rect2.right)
    let height: number = 1
    let top: number = Math.floor((Math.min(rect1.bottom, rect2.bottom) + Math.max(rect1.top, rect2.top)) / 2)
    let left: number = Math.min(rect1.right, rect2.right)

    createLine(width, height, top, left, value, 'y')
  } else if (direction === 'bottom') {
    let width: number = 1
    let height: number = Math.abs(rect1.bottom - rect2.bottom)
    let top: number = Math.min(rect1.bottom, rect2.bottom)
    let left: number = Math.floor((Math.min(rect1.right, rect2.right) + Math.max(rect1.left, rect2.left)) / 2)

    createLine(width, height, top, left, value, 'x')
  }
}

export function removeMarks(): void {
  document.querySelectorAll<HTMLSpanElement>('.spacing-js-marker').forEach(function (element) {
    element.remove()
  })
  document.querySelectorAll<HTMLSpanElement>('.spacing-js-value').forEach(function (element) {
    element.remove()
  })
}
