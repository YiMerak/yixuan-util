export const RegEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/

export const RegPhone = /^1[3-9]\d{9}$/

export const RegChinese = /^[\u4e00-\u9fa5]*$/

/**
 * @name 标准选项
 */
export interface Option<T extends number | string> {
  alias: string
  value: T
  unuse?: boolean
  child?: Array<Option<T>>
}

/**
 * @name 标准选项数组
 */
export type Options<T extends number | string> = Array<Option<T>>

/**
 * @name 非标准选项
 */
export type MayOption<T extends number | string> = T | Option<T>

/**
 * @name 非标准选项数组
 */
export type MayOptions<T extends number | string> = Array<MayOption<T>>

/**
 * @name 获取选项别名
 * @param option 选项
 */
export const getOptionAlias = <T extends number | string>(option: MayOption<T>) => {
  if (typeof option === 'object') {
    return option.alias
  }
  return option.toString()
}

/**
 * @name 获取选项主键
 * @param option 选项
 */
export const getOptionValue = <T extends number | string>(option: MayOption<T>) => {
  if (typeof option === 'object') {
    return option.value
  }
  return option
}

/**
 * @name 查询选项别名
 * @param value 主键
 * @param options 选项数组
 */
export const findOptionAlias = <T extends number | string>(value: T, options: MayOptions<T>) => {
  const element = options.find((option) => value === getOptionValue(option))
  if (element === undefined) {
    return null
  }
  return getOptionAlias(element)
}

/**
 * @name 查询选项主键
 */
export const findOptionValue = <T extends number | string>(alias: string, options: MayOptions<T>) => {
  const element = options.find((option) => alias === getOptionAlias(option))
  if (element === undefined) {
    return null
  }
  return getOptionValue(element)
}

/**
 * @name 函数防抖
 */
export function debounce(fn: Function, wait = 2400, flag: 'start' | 'end' | 'all' = 'all') {
  let first: boolean
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (this: unknown, ...arg: any) {
    if (timer === null) {
      first = true
      if (flag !== 'end') {
        fn.apply(this, arg)
      }
    } else {
      first = false
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      if (!first && flag !== 'start') {
        fn.apply(this, arg)
      }
      timer = null
    }, wait)
  }
}

/**
 * @name 函数节流
 */
export function throttle(fn: Function, wait = 2400) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (this: unknown, ...arg: any) {
    if (timer === null) {
      timer = setTimeout(() => {
        fn.apply(this, arg)
        timer = null
      }, wait)
    }
  }
}

/**
 * @name 处理异常的异步函数
 * @param { T } none 异常空值
 * @param { any } fn 异步函数
 * @param { Array<any> } args 函数参数
 */
export async function AtomAsync<T>(none: T, fn: any, ...args: Array<any>): Promise<['success' | 'mistake', T]> {
  try {
    const data = await fn(...args)
    return ['success', data]
  } catch (error: any) {
    console.error(error)
    return ['mistake', none]
  }
}

/**
 * @name 随机颜色
 * @param len 颜色位数
 * @example
 * ```ts
 * getRandomColor(3)   // #48f
 * getRandomColor(4)   // #3698
 * getRandomColor(6)   // #165DFF
 * getRandomColor(8)   // #00C01040
 * ```
 */
export const getColor = (len: 3 | 4 | 6 | 8) =>
  `#${Math.random()
    .toString(16)
    .slice(2, 2 + len)
    .padEnd(len, '0')}`

/**
 * @name 数据类型名称
 */
export const getType = (param: unknown) => {
  if (param === null) {
    return 'null'
  }
  if (typeof param === 'undefined') {
    return 'undefined'
  }
  if (typeof param === 'boolean') {
    return 'boolean'
  }
  if (typeof param === 'number') {
    return 'number'
  }
  if (typeof param === 'bigint') {
    return 'bigint'
  }
  if (typeof param === 'string') {
    return 'string'
  }
  if (typeof param === 'symbol') {
    return 'symbol'
  }
  if (typeof param === 'function') {
    return 'function'
  }
  if (param instanceof Boolean) {
    return 'Boolean'
  }
  if (param instanceof Number) {
    return 'Number'
  }
  if (param instanceof String) {
    return 'String'
  }
  if (param instanceof Date) {
    return 'Date'
  }
  if (param instanceof RegExp) {
    return 'RegExp'
  }
  if (Array.isArray(param)) {
    return 'Array'
  }
  if (param instanceof Set) {
    return 'Set'
  }
  if (param instanceof WeakSet) {
    return 'WeakSet'
  }
  if (param instanceof Map) {
    return 'Map'
  }
  if (param instanceof WeakMap) {
    return 'WeakMap'
  }
  if (param instanceof Error) {
    return 'Error'
  }
  return 'Object'
}

/**
 * @name 是否基本类型
 * @description null; undefined; boolean; number; bigint; string; symbol
 */
export const isBasic = (param: unknown) =>
  param === null ||
  typeof param === 'undefined' ||
  typeof param === 'boolean' ||
  typeof param === 'number' ||
  typeof param === 'bigint' ||
  typeof param === 'string' ||
  typeof param === 'symbol'

/**
 * @name 是否无效数据
 * @description null; undefined; ''; []; Set(0); Map(0); {}
 */
export const isEmpty = (param: unknown) =>
  param === null ||
  param === undefined ||
  param === '' ||
  (Array.isArray(param) && param.length === 0) ||
  (param instanceof Set && param.size === 0) ||
  (param instanceof Map && param.size === 0) ||
  (param instanceof Object && Object.keys(Object.getOwnPropertyDescriptors(param)).length === 0)
