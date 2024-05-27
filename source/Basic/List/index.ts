/**
 * @name 获取数组索引元素
 * @param array 列表数组
 * @param index 元素索引
 */
export const getArray = <T>(array: Array<T>, index: number): null | T => {
  if (index >= array.length || index < -array.length) {
    return null
  }
  if (index < 0) {
    index = array.length + index
  }
  return array[index]
}

/**
 * @name 修改数组索引元素
 * @param array 列表数组
 * @param index 元素索引
 * @param value 更新元素
 */
export const setArray = <T>(array: Array<T>, index: number, value: T): boolean => {
  if (index >= array.length || index < -array.length) {
    return false
  }
  if (index < 0) {
    index = array.length + index
  }
  array[index] = value
  return true
}

/**
 * @name 创建新数组并修改数组索引元素
 * @param array 列表数组
 * @param index 元素索引
 * @param value 更新元素
 */
export const setArrayCreated = <T>(array: Array<T>, index: number, value: T): null | Array<T> => {
  array = [...array]
  if (setArray(array, index, value)) {
    return array
  }
  return null
}

/**
 * @name 添加数组索引元素
 * @param array 列表数组
 * @param index 元素索引
 * @param value 添加元素
 */
export const addArray = <T>(array: Array<T>, index: number, ...value: Array<T>): boolean => {
  if (index >= array.length || index < -array.length) {
    return false
  }
  if (index < 0) {
    index = array.length + index
  }
  array.splice(index, 0, ...value)
  return true
}

/**
 * @name 创建新数组并添加数组索引元素
 * @param array 列表数组
 * @param index 元素索引
 * @param value 添加元素
 */
export const addArrayCreated = <T>(array: Array<T>, index: number, ...value: Array<T>): null | Array<T> => {
  array = [...array]
  if (addArray(array, index, ...value)) {
    return array
  }
  return null
}

/**
 * @name 删除数组索引元素【索引】
 * @param array 列表数组
 * @param index 元素索引
 */
export const delArrayByIndex = <T>(array: Array<T>, ...index: Array<number>): boolean => {
  if (index.some((i) => i >= array.length || i < -array.length)) {
    return false
  }
  index = index.map((i) => (i < 0 ? array.length + i : i))
  index = Array.from(new Set(index)).sort((a, c) => a - c)
  for (let i = 0, len = index.length; i < len; i++) {
    array.splice(index[i], 1)
    index = index.map((i) => i - 1)
  }
  return true
}

/**
 * @name 创建新数组并删除数组索引元素【索引】
 * @param array 列表数组
 * @param index 元素索引
 */
export const delArrayByIndexCreated = <T>(array: Array<T>, ...index: Array<number>): null | Array<T> => {
  array = [...array]
  if (delArrayByIndex(array, ...index)) {
    return array
  }
  return null
}

/**
 * @name 删除数组索引元素【元素】
 * @param array 列表数组
 * @param value 删除元素
 */
export const delArrayByValue = <T>(array: Array<T>, ...value: Array<T>): boolean => {
  const index = value.map((v) => array.findIndex((item) => item === v))
  if (index.some((i) => i === -1)) {
    return false
  }
  delArrayByIndex(array, ...index)
  return true
}

/**
 * @name 创建新数组并删除数组索引元素【元素】
 * @param array 列表数组
 * @param value 删除元素
 */
export const delArrayByValueCreated = <T>(array: Array<T>, ...value: Array<T>): null | Array<T> => {
  array = [...array]
  if (delArrayByValue(array, ...value)) {
    return array
  }
  return null
}

/**
 * @name 添加或删除数组索引元素
 * @param array 列表数组
 * @param value 待测元素
 */
export const invArray = <T>(array: Array<T>, ...value: Array<T>): void => {
  for (const item of value) {
    const index = array.findIndex((ele) => ele === item)
    if (index === -1) {
      array.push(item)
    } else {
      array.splice(index, 1)
    }
  }
}

/**
 * @name 创建新数组并添加或删除数组索引元素
 * @param array 列表数组
 * @param value 待测元素
 */
export const invArrayCreated = <T>(array: Array<T>, ...value: Array<T>): Array<T> => {
  array = [...array]
  invArray(array, ...value)
  return array
}

/**
 * @name 补充缺失时间
 * @param stand 标准日期
 * @param input 输入数据
 * @param convert 转换格式
 * @param getTime 获取时间
 * @param addNone 填充缺失
 * @description T1: 日期类型
 * @description T2: 输入类型
 * @description T3: 输出类型
 */
export function paddingTime<T1 extends number | string, T2 = unknown, T3 = unknown>(
  stand: Array<T1>,
  input: Array<T2>,
  convert: (data: T2) => T3,
  getTime: (data: T3) => T1,
  addNone: (time: T1) => T3,
) {
  const keys: Set<T1> = new Set()
  const result: Array<T3> = []
  input.forEach((item) => {
    const v = convert(item)
    const k = getTime(v)
    const i = stand.findIndex((time) => time === k)
    if (i === -1) {
      return
    }
    keys.add(k)
    result[i] = v
  })
  stand.forEach((item, i) => {
    if (keys.has(item)) {
      return
    }
    result[i] = addNone(item)
  })
  return result
}
