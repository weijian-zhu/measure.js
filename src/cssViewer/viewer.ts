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

  //todo 性能待优化
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
                           ? `<label data-name="${name}" style="background-color:${targetCss[name]}" class="measure-js-css-viewer-color"><input type="color" /></label>`
                           : ''
                       }
                       <span  style="outline:none;white-space:nowrap;" ${
                         this._colorList.includes(name) ? 'contenteditable' : ''
                       }>${targetCss[name]}</span>
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
      item.children[0].addEventListener('input', (event: any) => {
        const value = event.target.value
        item.style.backgroundColor = value
        targetDom.style[item.dataset?.name!] = value
        item.nextElementSibling!.innerHTML = value
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
      ;(tagetDOm.previousElementSibling as HTMLElement).style.backgroundColor = rgba
      this.targetDom.style.backgroundColor = rgba
      console.log(rgba)
    }
  }

  SetPosition(e: MouseEvent) {
    const cssViewer = this.cssViewer

    if (!cssViewer || this.isFreeze) {
      return
    }

    // cssViewer.style.display = 'block'

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
