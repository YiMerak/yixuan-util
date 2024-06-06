import { build } from 'bun'
import dts from 'bun-plugin-dts'

build({
  /**
   * @name 入口文件
   */
  entrypoints: ['./source/index.ts'],
  /**
   * @name 外部依赖
   */
  external: [],
  /**
   * @name 代码格式
   */
  format: 'esm',
  /**
   * @name 出口目录
   */
  outdir: './target',
  /**
   * @name 中间插件
   */
  plugins: [dts()],
  /**
   * @name 代码拆分
   */
  splitting: true,
  /**
   * @name 文件映射
   */
  sourcemap: 'none',
  /**
   * @name 目标环境
   */
  target: 'node',
  /**
   * @name 压缩变量
   */
  minify: false,
  /**
   * @name 文件名称
   */
  naming: '[dir]/[name].[ext]'
})
