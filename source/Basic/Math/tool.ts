/**
 * @name 转为数字
 */
export function toNumber(value: null | undefined | string) {
  if (value === null || value === undefined) {
    return 0
  }
  const data = Number(value)
  if (Number.isNaN(data)) {
    return 0
  }
  return data
}

/**
 * @name 美化整数
 * @example
 * ```ts
 * prettyInteger(123456789012,),)         // 1234,5678,9012
 * prettyInteger(123456789012, 3,),)      // 123,456,789,012
 * prettyInteger(123456789012, 3, ' ',),) // 123 456 789 012
 * ```
 */
export const prettyInteger = (value: number | string, count = 4, padding = ','): string => {
  if (typeof value === 'string') {
    if (!/^\d+$/.test(value)) {
      return ''
    }
  }
  if (typeof value === 'number') {
    if (value % 1 !== 0) {
      return ''
    }
    value = value.toString()
  }
  return value.replace(new RegExp(`\\B(?=(\\d{${count}})+\$)`, 'g'), padding)
}

/**
 * @name 美化小数
 * @param value 待美化数据
 * @param count 最大小数位
 * @param overflow 溢出处理
 */
export const prettyDecimal = (value: number | string, count = 0, overflow: 'ceil' | 'floor' | 'round' = 'round'): string => {
  // 参数校验
  if (count < 0 || count % 1 !== 0) {
    console.warn('最大小数位异常', count)
    return ''
  }
  const format = value.toString()
  const item = format.match(/^(-?\d*)\.?(\d*)$/)
  if (item === null) {
    console.warn('待美化数据异常', value)
    return ''
  }

  // 数据解析
  let temp = ''
  const [_, integer, decimal] = item
  const negative = integer.startsWith('-')

  // 溢出处理
  const over = decimal[count] as undefined | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  const base = `${integer}.${decimal.slice(0, count)}`
  const unit = Number(`1e-${count}`)
  if (over === undefined) {
    temp = base
  } else if (overflow === 'ceil') {
    temp = negative ? base : (Number(base) + unit).toString()
  } else if (overflow === 'floor') {
    temp = negative ? (Number(base) - unit).toString() : base
  } else {
    temp = ['0', '1', '2', '3', '4'].includes(over) ? base : negative ? (Number(base) - unit).toString() : (Number(base) + unit).toString()
  }

  return temp
}

/**
 * @name 单位填充
 */
export const paddingUnit = (data?: null | number | string, unit = 'px') => {
  if (data === undefined || data === null) {
    return `0${unit}`
  }
  if (typeof data === 'number') {
    if (data === Infinity || data === -Infinity || Number.isNaN(data)) {
      return `0${unit}`
    }
    return `${data}${unit}`
  }
  if (data === '') {
    return `0${unit}`
  }
  if (/^-?(\d+|\d+\.\d*|\d*\.\d+)$/.test(data)) {
    if (data.endsWith('.')) {
      return `${data.slice(0, -1)}${unit}`
    }
    if (/^-?\./.test(data)) {
      return `${data.startsWith('-') ? '-0' : '0'}${data.slice(data.indexOf('.'))}${unit}`
    }
    return `${data}${unit}`
  }
  return data
}
