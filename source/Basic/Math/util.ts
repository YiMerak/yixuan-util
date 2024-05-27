/**
 * @name 求平均值
 */
export const average = (list: Array<number>) => {
  return list.reduce((a, c) => a + c, 0) / list.length
}

/**
 * @name 求标准差
 */
export const standard = (list: Array<number>) => {
  const av = average(list)
  return Math.sqrt(list.map((item) => (item - av) ** 2).reduce((a, c) => a + c, 0) / list.length)
}

/**
 * @name 普通文本转`utf-8`格式的十六进制文本
 * @description 转换规则:
 * ```markdown
 * UTF-8转换格式
 * 000 000 - 000 07F   --->   0xxx xxxx
 * 000 080 - 000 7FF   --->   110x xxxx    10xx xxxx
 * 000 800 - 00F FFF   --->   1110 xxxx    10xx xxxx    10xx xxxx
 * 010 000 - 10F FFF   --->   1111 0xxx    10xx xxxx    10xx xxxx    10xx xxxx
 * ```
 */
export const toutf8 = (text: string): string => {
  const list: Array<string> = []
  for (let i = 0; i < text.length; i++) {
    const num = text.charCodeAt(i)
    const bin = num.toString(2)
    if (num <= 0x7f) {
      list.push(`0${bin.padStart(7, '0')}`)
    } else if (num <= 0x7ff) {
      list.push(`110${bin.slice(0, -6).padStart(5, '0')}`, `10${bin.slice(-6)}`)
    } else if (num <= 0xffff) {
      list.push(`1110${bin.slice(0, -12).padStart(4, '0')}`, `10${bin.slice(-12, -6)}`, `10${bin.slice(-6)}`)
    } else if (num < 0x10ffff) {
      list.push(`11110${bin.slice(0, -18).padStart(3, '0')}`, `10${bin.slice(-18, -12)}`, `10${bin.slice(-12, -6)}`, `10${bin.slice(-6)}`)
    } else {
      console.warn(`字符[${text[i]}]Unicode编码超过'utf-8'编码范围`)
      return ''
    }
  }
  return list
    .map((item) => Number.parseInt(item, 2).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

/**
 * @name `utf-8`格式的十六进制文本转普通文本
 * @description 转换规则:
 * ```markdown
 * UTF-8转换格式
 * 000 000 - 000 07F   --->   0xxx xxxx
 * 000 080 - 000 7FF   --->   110x xxxx    10xx xxxx
 * 000 800 - 00F FFF   --->   1110 xxxx    10xx xxxx    10xx xxxx
 * 010 000 - 10F FFF   --->   1111 0xxx    10xx xxxx    10xx xxxx    10xx xxxx
 * ```
 */
export const unutf8 = (hexs: string): string => {
  if (hexs.length % 2 !== 0) {
    return ''
  }
  const bins = Array.from({ length: hexs.length / 2 }, (_, k) =>
    Number.parseInt(hexs.slice(2 * k, 2 * (k + 1)), 16)
      .toString(2)
      .padStart(8, '0'),
  )
  const list: Array<string> = []
  for (let i = 0; i !== bins.length; ) {
    if (bins[i].startsWith('0')) {
      list.push(bins[i])
      i += 1
    } else if (bins[i].startsWith('110')) {
      list.push(bins[i].slice(3) + bins[i + 1].slice(2))
      i += 2
    } else if (bins[i].startsWith('1110')) {
      list.push(bins[i].slice(4) + bins[i + 1].slice(2) + bins[i + 2].slice(2))
      i += 3
    } else if (bins[i].startsWith('11110')) {
      list.push(bins[i].slice(5) + bins[i + 1].slice(2) + bins[i + 2].slice(2) + bins[i + 3].slice(2))
      i += 4
    } else {
      console.warn("编码不满足'utf-8'标准格式")
      return ''
    }
  }
  return list.map((item) => String.fromCharCode(Number.parseInt(item, 2))).join('')
}
