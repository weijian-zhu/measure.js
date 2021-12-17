import type { PlaceholderType } from './type'
import config from './config'
import Rect from './rect'

export function createPlaceholderElement(
  type: PlaceholderType,
  rect: DOMRect,
  color: string
): void {
  const { width, height, top, left } = rect
  //创建select dom和target dom的框框

  const placeholder: HTMLDivElement = document.createElement('div')
  placeholder.classList.add(`measure-js-${type}-placeholder`)
  placeholder.style.border = `1px solid ${color}`
  placeholder.style.position = 'fixed'
  placeholder.style.background = 'none'
  placeholder.style.borderRadius = '2px'
  placeholder.style.padding = '0'
  placeholder.style.margin = '0'
  placeholder.style.width = `${width - 1}px`
  placeholder.style.height = `${height - 1}px`
  placeholder.style.top = `${top - 0.5}px`
  placeholder.style.left = `${left - 0.5}px`
  placeholder.style.pointerEvents = 'none'
  placeholder.style.zIndex = '9999'
  placeholder.style.boxSizing = 'content-box'
  document.body.appendChild(placeholder)
  //创建尺寸展示文本

  if (type === 'target') {
    clearPlaceholderElementDimension('selected')
    return
  }
  const dimension: HTMLSpanElement = document.createElement('span')
  dimension.classList.add(`measure-js-${type}-dimension`)
  dimension.style.background = color
  dimension.style.position = 'fixed'
  dimension.style.display = 'inline-block'
  dimension.style.color = '#fff'
  dimension.style.padding = '2px 4px'
  dimension.style.fontSize = '10px'

  let arrow = ''
  let topOffset = top

  if (top < 20) {
    //被select 的dom的top值小于0
    if (top < 0) {
      topOffset = 0
      arrow = '↑' // ↑标记为超出屏幕，表示select的dom左上角超出了视图（屏幕）
    }
    dimension.style.borderRadius = '2px 0 2px 0'
  } else {
    //+1px 是为了抵消1px的border
    dimension.style.transform = 'translateY(calc(-100% + 1px))'
    dimension.style.borderRadius = '2px 2px 0 0'
  }

  //-1 是为了和框选出来的border范围，左对齐
  dimension.style.top = `${topOffset - 1}px`
  dimension.style.left = `${left - 1}px`
  dimension.innerText = `${arrow} ${Math.round(width)}px × ${Math.round(height)}px`
  placeholder.appendChild(dimension)
}

export function clearPlaceholderElement(type: PlaceholderType): void {
  document.querySelector(`.measure-js-${type}-placeholder`)?.remove()
}
export function clearPlaceholderElementDimension(type: PlaceholderType): void {
  document.querySelector(`.measure-js-${type}-dimension`)?.remove()
}
