/**
 * @name 创建请求器
 */
export const createHttp = (
  defaultConfig: {
    /**
     * @name 路径前缀 ?? ''
     */
    prefix?: string
    /**
     * @name 存储时间 [秒] ?? '-1'
     */
    storage?: number
    /**
     * @name 超时时间 [毫秒] ?? 3600
     */
    timeout?: number
    /**
     * @name 请求次数 ?? 1
     */
    trycount?: number
    /**
     * @name 请求头部 ?? {}
     */
    headers?: HeadersInit
    /**
     * @name 请求回调
     */
    callback?: (response: Response) => void
  } = {},
) => {
  // 请求缓存
  const waitMaps: Map<string, Promise<Response>> = new Map()
  // 响应缓存
  const echoMaps: Map<string, Response> = new Map()

  /**
   * @name 发起网络请求
   * @param router  请求路由
   * @param config  请求配置
   */
  const http = async (
    router: string,
    config: {
      /**
       * @name 请求体
       */
      body?: BodyInit
      /**
       * @name 请求参数
       * @type string | Record<string, number> | Record<string, string> | string[][] | URLSearchParams
       */
      query?: any
      /**
       * @name 请求方式 ?? 'get'
       */
      method?: 'get' | 'put' | 'post' | 'delete'
      /**
       * @name 路径前缀 ?? ''
       */
      prefix?: string
      /**
       * @name 存储时间 [秒] ?? '-1'
       */
      storage?: number
      /**
       * @name 超时时间 [毫秒] ?? 3600
       */
      timeout?: number
      /**
       * @name 请求次数 ?? 1
       */
      trycount?: number
      /**
       * @name 请求头部 ?? {}
       */
      headers?: HeadersInit
      /**
       * @name 请求回调
       */
      callback?: (response: Response) => void
    } = {},
  ) => {
    // 请求路由
    router = `${config.prefix ?? defaultConfig.prefix ?? ''}${router}?${new URLSearchParams(config.query ?? {}).toString()}`

    // 请求方式
    const { method = 'get' } = config
    // 尝试次数
    let residue = config.trycount ?? defaultConfig.trycount ?? 1

    // 读取缓存
    const echo = echoMaps.get(router)
    if (echo !== undefined) {
      return echo.clone()
    }
    const wait = waitMaps.get(router)
    if (wait !== undefined) {
      return (await wait).clone()
    }

    // 发送请求
    const send = async (): Promise<Response> => {
      // 中断控制器
      const controller = new AbortController()
      // 超时倒计时
      const timer = setTimeout(() => controller.abort(), config.timeout ?? defaultConfig.timeout ?? 3600)

      try {
        const response = await fetch(
          // 请求路由
          router,
          {
            // 请求主体
            body: config.body,
            // 请求方法
            method,
            // 超时控制
            signal: controller.signal,
            // 请求头部
            headers: Object.assign(structuredClone(defaultConfig.headers ?? {}), config.headers ?? {}),
          },
        )
        clearTimeout(timer)
        return response
      } catch (err: any) {
        // 超时重试
        if (err.message === 'The user aborted a request.') {
          if (--residue > 0) {
            return await send()
          }
        }
        return new Response(null, { status: 408, statusText: 'Request Timeout' })
      }
    }

    const todo = new Promise<Response>((res) => {
      send().then((data) => {
        const storage = config.storage ?? defaultConfig.storage ?? -1
        if (storage > 0) {
          // 添加缓存响应
          echoMaps.set(router, data.clone())
          // 删除响应缓存
          setTimeout(() => {
            echoMaps.delete(router)
          }, storage * 1000)
        }
        // 回调处理
        ;(config.callback ?? defaultConfig.callback)?.(data.clone())
        // 返回响应
        res(data.clone())
      })
    })

    // 添加请求缓存
    waitMaps.set(router, todo)

    const result = await todo

    // 删除请求缓存
    waitMaps.delete(router)

    return result
  }

  return http
}
