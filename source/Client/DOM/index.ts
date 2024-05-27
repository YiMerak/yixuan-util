/**
 * @name 复制文本
 */
export const CopyText = async (text: string) => {
  // 非浏览器环境
  if (typeof window === 'undefined') {
    return
  }
  // 浏览器环境
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch (error: any) {
      console.warn('Error: navigator.clipboard', error)
    }
  }
  const elem = document.createElement('textarea')
  elem.value = text
  elem.style.position = 'fixed'
  elem.style.translate = '100vw 100vh'
  document.body.appendChild(elem)
  elem.select()
  document.execCommand('copy') ? void 0 : console.warn('复制失败')
  elem.remove()
}

/**
 * @name 选择文件
 */
export const PickFile = (): Promise<File> => {
  return new Promise((res) => {
    const handleChange = () => {
      if (DOM.files === null) {
        return
      }
      DOM.removeEventListener('change', handleChange)
      res(DOM.files[0])
    }

    const DOM = document.createElement('input')
    DOM.type = 'file'
    DOM.addEventListener('change', handleChange)
    DOM.click()
  })
}

/**
 * @name 上传文件
 */
export const LoadFile = (path: string, info: Record<string, string | Blob>) => {
  const body = new FormData()
  for (const key in info) {
    body.append(key, info[key])
  }
  return fetch(path, {
    method: 'post',
    body,
  })
}

interface WatchElemSize {
  x: number
  y: number
  innerW: number
  innerH: number
  outerW: number
  outerH: number
  target: Element
}

/**
 * @name 监听元素尺寸变化
 * @param { boolean } position 包含元素定位
 * @description
 * ```md
 * - 不含定位信息
 *  + innerW: DOM 元素 的 content 宽度
 *  + innerH: DOM 元素 的 content 高度
 *  + outerW: DOM 元素 的 content + padding + border 宽度
 *  + outerH: DOM 元素 的 content + padding + border 高度
 * - 额外定位信息
 *  + x: DOM 元素 距离屏幕左侧距离
 *  + y: DOM 元素 距离屏幕顶部距离
 * ```
 * @example
 * ```ts
 *  const observer = watchElemSize((item,) => console.log(item,))
 *  // 监听 DOM1 的 content 区域尺寸变化
 *  observer.observe(DOM1,)
 *  // 监听 DOM2 的 content、padding、border 区域尺寸变化
 *  observer.observe(DOM2, { box: "border-box", },)
 *  // 监听 DOM3 的 像素级 尺寸变化, 好像是用于 canvas 【待深入】
 *  observer.observe(DOM3, { box: "device-pixel-content-box", },)
 *  // 停止监听 DOM3
 *  observer.unobserve(DOM3,)
 *  // 销毁整个监听器
 *  observer.disconnect()
 * ```
 */
export const WatchElemSize = (fun: (item: WatchElemSize) => void | Promise<void>, position = false) => {
  return new ResizeObserver(async (entries) => {
    for await (const i of entries) {
      const info = {
        x: 0,
        y: 0,
        innerW: i.contentRect.width,
        innerH: i.contentRect.height,
        outerW: i.borderBoxSize[0].inlineSize,
        outerH: i.borderBoxSize[0].blockSize,
        target: i.target,
      }
      if (position) {
        const box = i.target.getBoundingClientRect()
        info.x = box.x
        info.y = box.y
      }
      await fun(info)
    }
  })
}

interface WatchElemOver {
  time: number
  level: number
  result: boolean
  target: Element
  thisX: number
  thisY: number
  thisW: number
  thisH: number
  rootX: number
  rootY: number
  rootW: number
  rootH: number
  overX: number
  overY: number
  overW: number
  overH: number
}

/**
 * @name 监听元素重叠变化
 * @param { Element | Document | null | undefined } config.root 基础元素
 * @param { string | undefined } config.rootMargin 重叠边距
 * @param { number | undefined } config.threshold 重叠阈值
 * @description
 * ```md
 *  time: number, 事件触发到距离创建监听器的时间戳
 *  level: number, 重叠程度
 *  result: boolean, 是否重叠[受threshold影响]
 *  target: Element, 监听元素
 *  thisX: number, 监听元素距离屏幕左侧距离
 *  thisY: number, 监听元素距离屏幕顶部距离
 *  thisW: number, 监听元素宽度
 *  thisH: number, 监听元素高度
 *  rootX: number, 基础元素距离屏幕左侧距离
 *  rootY: number, 基础元素距离屏幕顶部距离
 *  rootW: number, 基础元素宽度
 *  rootH: number, 基础元素高度
 *  overX: number, 重叠部分距离屏幕左侧距离
 *  overY: number, 重叠部分距离屏幕顶部距离
 *  overW: number, 重叠部分宽度
 *  overH: number, 重叠部分高度
 * ```
 * @example
 */
export const WatchElemOver = (fun: (item: WatchElemOver) => void | Promise<void>, config: IntersectionObserverInit = {}) => {
  return new IntersectionObserver(async (entries) => {
    for await (const i of entries) {
      await fun({
        thisX: i.boundingClientRect.x,
        thisY: i.boundingClientRect.y,
        thisW: i.boundingClientRect.width,
        thisH: i.boundingClientRect.height,
        rootX: i.rootBounds?.x ?? 0,
        rootY: i.rootBounds?.y ?? 0,
        rootW: i.rootBounds?.width ?? 0,
        rootH: i.rootBounds?.height ?? 0,
        overX: i.intersectionRect.x,
        overY: i.intersectionRect.y,
        overW: i.intersectionRect.width,
        overH: i.intersectionRect.height,
        time: i.time,
        level: i.intersectionRatio,
        result: i.isIntersecting,
        target: i.target,
      })
    }
  }, config)
}
