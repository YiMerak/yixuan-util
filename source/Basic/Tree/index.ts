/**
 * @name 深度优先遍历
 * @param handle 处理函数
 * @param target 处理对象
 * @param suffix 下级字段
 * @param prefix 上级对象
 */
export const DFS = <T extends Object>(
  handle: (v: T, p: T, c: Array<T>) => void | Promise<void>,
  target: T | Array<T>,
  suffix: keyof T = 'children' as keyof T,
  prefix: T = null as unknown as T,
) => {
  target = Array.isArray(target) ? target : [target]
  target.forEach(async (v) => {
    const children = v[suffix] as Array<T>
    await handle(v, prefix, children)
    children && DFS(handle, children, suffix, v)
  })
}

/**
 * @name 广度优先遍历
 * @param handle 处理函数
 * @param target 处理对象
 * @param suffix 下级字段
 * @param prefix 上级对象
 */
export const BFS = <T extends Object>(
  handle: (v: T, p: T, c: Array<T>) => void | Promise<void>,
  target: T | Array<T>,
  suffix: keyof T = 'children' as keyof T,
  prefix: T = null as unknown as T,
) => {
  const queue: Array<{ v: T; p: T }> = Array.isArray(target) ? target.map((v) => ({ v, p: prefix })) : [{ v: target, p: prefix }]
  while (queue.length !== 0) {
    const item = queue.shift()!
    const children = item.v[suffix] as Array<T>
    handle(item.v, item.p, children)
    queue.push(...children.map((v) => ({ v, p: item.v })))
  }
}

/**
 * @name 将树转为列表
 * @param input 树形节点
 * @param getValue 树形节点获取标识
 * @param getChild 树形节点获取下级
 * @param convert 树形节点转列表节点
 * @param type 遍历方式
 * @description T1: 树形节点类型
 * @description T2: 列表节点类型
 * @description T3: 节点标识类型
 * @description BFS: 广度优先遍历
 * @description DFS: 深度优先遍历
 */
export const convertTreeToList = <T1 extends Object, T2 extends Object, T3 extends number | string>(
  input: Array<T1>,
  getValue: (node: T1) => T3,
  getChild: (node: T1) => Array<T1>,
  convert: (node: T1, parent: null | T3, level: number) => T2,
  type: 'BFS' | 'DFS' = 'BFS',
): Array<T2> => {
  const result: Array<T2> = []
  if (type === 'BFS') {
    const queue: Array<{ value: T1; pater: null | T3 }> = input.map((item) => ({
      value: item,
      pater: null,
    }))
    while (queue.length !== 0) {
      const current = queue.shift()!
      const code = getValue(current.value)
      const next = getChild(current.value)
      result.push(convert(current.value, current.pater, 1))
      queue.push(
        ...next.map((item) => ({
          value: item,
          pater: code,
        })),
      )
    }
  } else {
    const DFS = (data: Array<T1>, pater: T3, level: number) => {
      data.forEach((item) => {
        result.push(convert(item, pater, level))
        DFS(getChild(item), getValue(item), level + 1)
      })
    }
    DFS(input, null as unknown as T3, 1)
  }
  return result
}

/**
 * @name 将列表转为树
 * @param input 列表节点
 * @param convert 列表节点转树形节点
 * @param getValue 列表节点获取标识
 * @param getPater 列表节点获取上级
 * @param getChild 树形节点获取下级
 * @param nulValue 空值标识
 * @description T1: 列表节点类型
 * @description T2: 树形节点类型
 * @description T3: 节点标识类型
 */
export const convertListToTree = <T1 extends Object, T2 extends Object, T3 extends undefined | null | number | string>(
  input: Array<T1>,
  convert: (node: T1) => T2,
  getValue: (node: T1) => T3,
  getPater: (node: T1) => T3,
  getChild: (node: T2) => Array<T2>,
  nulValue: T3 = null as T3,
) => {
  /**
   * @name 标识映射父级
   */
  const _map: Map<T3, T3> = new Map()
  /**
   * @name 标识映射节点
   */
  const maps: Map<T3, T2> = new Map()
  /**
   * @name 树形节点
   */
  const tree: Array<T2> = []
  /**
   * @name 异常节点
   */
  const none: Array<T2> = []
  /**
   * @name 节点列表
   */
  const list: Array<T2> = input.map((item) => {
    const code = getValue(item)
    const prev = getPater(item)
    const node = convert(item)
    _map.set(code, prev)
    maps.set(code, node)
    return node
  })
  _map.forEach((v, k) => {
    const node = maps.get(k)!
    if (v === nulValue) {
      return tree.push(node)
    }
    const prev = maps.get(v)
    if (prev === undefined) {
      return none.push(node)
    }
    getChild(prev).push(node)
  })
  return { maps, tree, none, list }
}
