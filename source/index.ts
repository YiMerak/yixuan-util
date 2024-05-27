export * from './Basic/Date'
export * from './Basic/List'
export * from './Basic/Math/SM3'
export * from './Basic/Math/SM4'
export * from './Basic/Math/tool'
export * from './Basic/Math/util'
export * from './Basic/Text'
export * from './Basic/Tool'
export * from './Basic/Tree'
export * from './Basic/Type'
export * from './Client/BOM'
export * from './Client/DOM'
import type { MayList } from './Basic/Type'

/**
 * @name 创建元素对象
 * @param tag 元素标签
 * @param name 元素类名
 * @param text 元素内容
 */
export const addDOM = (tag: Parameters<typeof document.createElement>[0], name?: string, text?: string) => {
  const dom = document.createElement(tag)
  dom.className = name ?? ''
  dom.innerText = text ?? ''
  return dom
}

/**
 * @name 内置矢量图标类型
 */
export const svgType = {
  close:
    '<line stroke="var(--deepColor)" stroke-width="100" stroke-linecap="round" x1="128" y1="128" x2="896" y2="896" /><line stroke="var(--deepColor)" stroke-width="100" stroke-linecap="round" x1="128" y1="896" x2="896" y2="128" />',
  primary:
    '<path fill="#4080F0" d="M580 332c-32 0-59-24-59-58 0-35 26-58 59-58 32 0 59 24 59 58 0 35-26 58-59 58zM592 700c-38 57-77 102-144 102-44-7-64-40-53-72L479 448c2-7-1-14-7-16-6-2-18 5-29 17L391 512c-1-10 0-27 0-34 38-57 102-103 144-103 40 3 60 36 52 72l-85 283c-0 6 2 12 8 15 6 2 19-5 30-17l51-61c1 9-0 28-0 34zM512 0C229 0 0 229 0 512 0 794 229 1024 512 1024S1024 794 1024 512C1024 229 794 0 512 0z" />',
  success:
    '<path fill="#00D010" d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m-49-377L315 498 219 590c70 37 168 106 252 213C531 692 715 463 804 443c-14-57-22-166 0-223-183 120-342 427-342 427z" />',
  mistake:
    '<circle cx="512" cy="512" r="512" fill="#F04040" /><path fill="#FFF" d="M473 607c6 19 19 31 38 31s31-12 38-31l25-349c0-38-31-63-63-63-38 0-63 31-63 70l25 343z m38 95c-38 0-63 25-63 63s25 63 63 63 63-25 63-63-25-63-63-63z" />',
}

/**
 * @name 创建矢量图标
 * @param type 图标类型
 * @param name 元素类名
 */
export const addSvg = (type: keyof typeof svgType, name?: MayList<string>) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 1024 1024')
  if (name !== undefined) {
    if (typeof name === 'string') {
      svg.classList.add(name)
    } else {
      svg.classList.add(...name)
    }
  }
  svg.innerHTML = svgType[type] ?? ''
  return svg
}
