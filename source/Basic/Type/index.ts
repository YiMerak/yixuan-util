/**
 * @name 元素或元素数组
 */
export type MayList<T> = T | Array<T>

/**
 * @name 元素或元素期约
 */
export type MayPromise<T> = T | Promise<T>

/**
 * @name 定长列表
 * @example
 * ```ts
 * const list1: ListLeng<number, 3> = [1, 2]
 * // Mistake: 不能将类型“2”分配给类型“3”
 *
 * const list2: ListLeng<number, 3> = [1, 2, 3]
 * // Success
 * ```
 */
export type LengList<T, N extends number> = Array<T> & { length: N }

/**
 * @name 修改字段为可选
 * @example
 * ```ts
 * toPick<{ a: number; b: number }, 'a' | 'b'>
 * // => { a?: number; b?: number }
 * ```
 */
export type toPick<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * @name 修改字段为必须
 * @example
 * ```ts
 * ToMust<{ a?: number; b?: number }, 'a' | 'b'>
 * // => { a: number; b: number }
 * ```
 */
export type ToMust<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/**
 * @name 解析数组
 * @example
 * ```ts
 * const list = [1, '2']
 * // const list: Array<string | number>
 *
 * const elem: UnList<typeof list> = 1
 * // const elem: string | number
 * ```
 */
export type UnList<T> = T extends Array<infer R> ? R : T

/**
 * @name 解析期约
 * ```ts
 * const p = new Promise<number | string>((res) => res('success'))
 * // const p: Promise<string | number>
 *
 * const r: UnPromise<typeof p> = 200
 * // const r: string | number
 * ```
 */
export type UnPromise<T> = T extends Promise<infer R> ? R : T

/**
 * @name 展开接口
 * @example
 * ```ts
 * interface TestVO {
 *   a: number
 * }
 *
 * const i1: TestVO = { a: 1 }
 * // const i1: TestVO
 *
 * const i2: ExpandInter<TestVO> = { a: 1 }
 * // const i2: { a: number }
 * ```
 */
export type ExpandInter<T> = T extends object ? (T extends infer O ? { [K in keyof O]: ExpandInter<O[K]> } : never) : T
