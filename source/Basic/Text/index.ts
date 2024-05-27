/**
 * @name 首字母大写
 */
export const upperFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/**
 * @name 将蛇形名转化为小驼峰
 * @description 蛇形名仅允许小写字母, 数字和下划线, 且不能以数字开头
 */
export const snakeToLower = (name: string) => {
  if (!/^[a-z_][a-z1-9_]*$/.test(name)) {
    console.warn('参数格式异常', name)
    return name
  }
  const list = name.split('_')
  let result = list[0]
  for (let i = 1, len = list.length; i < len; i++) {
    result += list[i].slice(0, 1).toUpperCase() + list[i].slice(1)
  }
  return result
}

/**
 * @name 将对象中蛇形名的键转化为小驼峰
 */
export const snakeKeyToLower = <T = any>(target: T) => {
  target = structuredClone(target)
  for (const key in target) {
    const value = target[key]
    delete target[key]
    ;(target as any)[snakeToLower(key)] = value
  }
  return target
}

/**
 * @name 将小驼峰转化为蛇形名
 * @description 小驼峰仅允许字母和数字, 且不能以数字开头
 */
export const lowerToSnake = (name: string) => {
  if (!/^[a-zA-Z][a-zA-Z1-9]*$/.test(name)) {
    console.warn('参数格式异常', name)
    return name
  }
  let result = ''
  for (let i = 0; i < name.length; i++) {
    const code = name.charCodeAt(i)
    if (code <= 90 && code >= 65) {
      result += `_${String.fromCharCode(code + 32)}`
    } else {
      result += name[i]
    }
  }
  return result
}

/**
 * @name 将对象中小驼峰的键转化为蛇形名
 */
export const lowerKeyToSnake = <T = any>(target: T) => {
  target = structuredClone(target)
  for (const key in target) {
    const value = target[key]
    delete target[key]
    ;(target as any)[lowerToSnake(key)] = value
  }
  return target
}
