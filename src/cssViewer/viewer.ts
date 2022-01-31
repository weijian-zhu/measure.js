const tinycolor = require('tinycolor2')

class Viewer {
  _cssList = ['color', 'backgroundColor', 'font', 'border-color']
  _colorList = ['color', 'backgroundColor', 'border-color']
  _targetDom: HTMLElement | null = null
  cssViewer: null | HTMLElement = null
  isFreeze: boolean = false

  set targetDom(dom: HTMLElement) {
    this._targetDom = dom
    this.updateHtml()
    this.initSelectColorEvent()
  }

  get targetDom(): HTMLElement {
    return this._targetDom!
  }

  constructor(dom: HTMLElement) {
    this.SetPosition = this.SetPosition.bind(this)
    //容器
    this.initViewerWrap()
    this.initMouseMoveEvent()
    //内容
    this.targetDom = dom
    this.initSelectColorEvent()
  }

  show() {
    this.isFreeze = false
    this.cssViewer!.style.display = 'block'
    this.initMouseMoveEvent()
  }

  hide() {
    this.cssViewer!.style.display = 'none'
    this.removeMouseMoveEvent()
  }

  initViewerWrap() {
    const div = document.createElement('div')
    div.id = 'measure-js-css-viewer'
    this.cssViewer = div
    document.body.appendChild(div)
  }

  //todo 性能待优化,暂无用户反馈性能问题
  updateHtml() {
    const targetCss = window.getComputedStyle(this.targetDom)
    this.cssViewer!.innerHTML = `
            ${this._cssList
              .map(
                name => `
                <div class="measure-js-css-viewer-item">
                     <span>${name}</span>
                     <span>
                       ${
                         this._colorList.includes(name)
                           ? `<label data-name="${name}" style="background-color:${targetCss[name]}" class="measure-js-css-viewer-color"></label>`
                           : ''
                       }
                       <span  style="outline:none;" ${
                         this._colorList.includes(name) ? 'contenteditable' : ''
                       }>${
                  this._colorList.includes(name)
                    ? tinycolor(targetCss[name]).toHex8String()
                    : targetCss[name]
                }</span>
                       </span>
                  </div>`
              )
              .join('')}
            `
  }

  initSelectColorEvent() {
    const { targetDom } = this
    //选颜色
    const allViewerColor: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.measure-js-css-viewer-color'
    )
    allViewerColor.forEach(item => {
      //点击颜色区域，在rbga和16进制颜色中转换
      item.addEventListener('click', function (this: HTMLElement, event: any) {
        const input = this.nextElementSibling as HTMLElement
        const colorText = input.innerHTML
        const color1 = tinycolor(colorText)
        if (!color1.isValid()) {
          //爆红提示用户颜色输入有误
          input.style.border = '1px solid red'
          return
        }
        input.style.border = 'none'
        let transferColor = ''
        if (colorText.includes('#')) {
          transferColor = color1.toRgbString()
        } else {
          transferColor = color1.toHex8String()
        }
        item.style.backgroundColor = transferColor
        targetDom.style[item.dataset?.name!] = transferColor
        input.innerHTML = transferColor
      })
    })

    this.cssViewer?.addEventListener('keydown', this.inputColor.bind(this))
  }

  initMouseMoveEvent() {
    window.addEventListener('mousemove', this.SetPosition, false)
  }

  removeMouseMoveEvent() {
    window.removeEventListener('mousemove', this.SetPosition, false)
  }

  freezePosition() {
    this.isFreeze = true
  }

  inputColor(e: KeyboardEvent) {
    const tagetDOm = e.target as HTMLElement
    if (e.key === 'Enter' && tagetDOm.getAttribute('contenteditable') !== null) {
      e.preventDefault()
      const color1 = tinycolor(tagetDOm.innerHTML)
      if (!color1.isValid()) {
        //爆红提示用户颜色输入有误
        tagetDOm.style.border = '1px solid red'
        return
      }
      tagetDOm.style.border = 'none'
      const rgba: string = color1.toString()
      const label = tagetDOm.previousElementSibling as HTMLElement
      label.style.backgroundColor = rgba
      this.targetDom.style[label.dataset?.name!] = rgba
    }
  }

  SetPosition(e: MouseEvent) {
    const cssViewer = this.cssViewer

    if (!cssViewer || this.isFreeze) {
      return
    }

    let pageWidth = window.innerWidth
    let pageHeight = window.innerHeight

    let width = cssViewer.offsetWidth
    let height = cssViewer.offsetHeight
    const margin = 20

    if (e.clientX + width + margin > pageWidth)
      cssViewer.style.left = e.clientX - width - margin + 'px'
    else cssViewer.style.left = e.clientX + margin + 'px'

    if (e.clientY + height + margin > pageHeight)
      cssViewer.style.top = e.clientY - height - margin + 'px'
    else cssViewer.style.top = e.clientY + margin + 'px'
  }
}

let viewer: Viewer
function openCssViewer(dom: HTMLElement, event: MouseEvent): Viewer {
  if (viewer) {
    viewer.targetDom = dom
    viewer.show()
    viewer.SetPosition(event)
    return viewer
  }
  viewer = new Viewer(dom)
  viewer.SetPosition(event)
  return viewer
}

export { openCssViewer, Viewer }
