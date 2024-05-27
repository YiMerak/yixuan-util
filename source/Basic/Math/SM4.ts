import { toutf8, unutf8 } from './util'
import type { LengList } from '../Type'

export class SM4 {
  /**
   * @name 轮密钥
   */
  private Key: Array<bigint>
  /**
   * @name 初始化轮密钥
   * @description 密钥长度溢出后删除后面内容
   */
  constructor(arg: string | Array<bigint> = '') {
    const MK: Array<bigint> = typeof arg === 'string' ? SM4.encode(arg, 4) : Array.from({ length: 4 }, (_, i) => arg[i] ?? 0n)
    this.Key = Array.from({ length: 4 }, (_, i) => MK[i] ^ SM4.FK[i])
    for (let i = 0; i < 32; i++) {
      let Knew: bigint = SM4.CK[i] ^ this.Key[i + 1] ^ this.Key[i + 2] ^ this.Key[i + 3]
      Knew = SM4.SBox(Knew)
      Knew = Knew ^ SM4.loopLeft(Knew, 13) ^ SM4.loopLeft(Knew, 23)
      Knew = Knew ^ this.Key[i]
      this.Key.push(Knew)
    }
  }
  /**
   * @name 加密算法
   * @param plain 明文
   */
  encrypt(plain: string | Array<bigint>): string {
    // 统一格式
    const init: Array<bigint> = typeof plain === 'string' ? SM4.encode(plain) : plain
    // 填充长度
    const fill: Array<bigint> = Array.from({ length: Math.ceil(init.length / 4) * 4 }, (_, i) => init[i] ?? 0n)
    // 循环结果
    const loop: Array<Array<bigint>> = []
    for (let i = 0; i < fill.length / 4; i++) {
      // 初始明文
      const X: Array<bigint> = [fill[4 * i], fill[4 * i + 1], fill[4 * i + 2], fill[4 * i + 3]]
      // 迭代加密
      for (let j = 0; j < 32; j++) {
        let Xnew: bigint = this.Key[j + 4] ^ X[j + 1] ^ X[j + 2] ^ X[j + 3]
        Xnew = SM4.SBox(Xnew)
        Xnew = Xnew ^ SM4.loopLeft(Xnew, 2) ^ SM4.loopLeft(Xnew, 10) ^ SM4.loopLeft(Xnew, 18) ^ SM4.loopLeft(Xnew, 24)
        Xnew = Xnew ^ X[j]
        X.push(Xnew)
      }
      // 反序变换
      loop.push(Array.from({ length: 4 }, (_, k) => X[X.length - 1 - k]))
    }
    // 格式处理
    return loop
      .map((i) => i.map((j) => j.toString(16).padStart(8, '0')).join(''))
      .join('')
      .toUpperCase()
  }
  /**
   * @name 解密算法
   * @param paswd 密文
   */
  decrypt(paswd: string): string {
    // 格式处理
    const loop: Array<Array<bigint>> = Array.from({ length: paswd.length / 32 }, (_, i) =>
      Array.from({ length: 4 }, (_, j) => BigInt(`0x${paswd.slice(i * 32, (i + 1) * 32).slice(j * 8, (j + 1) * 8)}`)),
    )
    const list: Array<bigint> = []
    loop.forEach((item) => {
      // 初始密文
      const Y: Array<bigint> = [item[0], item[1], item[2], item[3]]
      // 迭代解密
      for (let j = 0; j < 32; j++) {
        let Ynew: bigint = this.Key[this.Key.length - 1 - j] ^ Y[j + 1] ^ Y[j + 2] ^ Y[j + 3]
        Ynew = SM4.SBox(Ynew)
        Ynew = Ynew ^ SM4.loopLeft(Ynew, 2) ^ SM4.loopLeft(Ynew, 10) ^ SM4.loopLeft(Ynew, 18) ^ SM4.loopLeft(Ynew, 24)
        Ynew = Ynew ^ Y[j]
        Y.push(Ynew)
      }
      // 反序变换
      list.push(...Array.from({ length: 4 }, (_, k) => Y[Y.length - 1 - k]))
    })
    return SM4.uncode(list)
  }
  /**
   * @name 编码
   * @param text 文本
   * @param leng 数组长度
   * @description 若设置数组长度, 溢出后会导致解码与原码不一致
   */
  static encode(text: string, leng?: number): Array<bigint> {
    text = toutf8(text)
    if (leng === undefined) {
      text = text.padEnd(Math.ceil(text.length / 8) * 8, '0')
    } else {
      text = text.slice(0, leng * 8)
      text = text.padEnd(leng * 8, '0')
    }
    return Array.from({ length: text.length / 8 }, (_, i) => BigInt(`0x${text.slice(i * 8, (i + 1) * 8)}`))
  }
  /**
   * @name 解码
   * @param list 编码数组
   */
  static uncode(list: Array<bigint>): string {
    return unutf8(list.map((item) => item.toString(16).padStart(8, '0')).join('')).replace(/\0/g, '')
  }
  // 算法常量
  static FK: LengList<bigint, 4> = [0xa3b1bac6n, 0x56aa3350n, 0x677d9197n, 0xb27022dcn]
  // biome-ignore format: 方便阅读
  // 算法常量
  static CK: LengList<bigint, 32> = [
    0x00070E15n, 0x1C232A31n, 0x383F464Dn, 0x545B6269n, 
    0x70777E85n, 0x8C939AA1n, 0xA8AFB6BDn, 0xC4CBD2D9n, 
    0xE0E7EEF5n, 0xFC030A11n, 0x181F262Dn, 0x343B4249n, 
    0x50575E65n, 0x6C737A81n, 0x888F969Dn, 0xA4ABB2B9n, 
    0xC0C7CED5n, 0xDCE3EAF1n, 0xF8FF060Dn, 0x141B2229n, 
    0x30373E45n, 0x4C535A61n, 0x686F767Dn, 0x848B9299n, 
    0xA0A7AEB5n, 0xBCC3CAD1n, 0xD8DFE6EDn, 0xF4FB0209n, 
    0x10171E25n, 0x2C333A41n, 0x484F565Dn, 0x646B7279n,
  ]
  // biome-ignore format: 方便阅读
  // 算法常量
  static SboxMatrix: LengList<string, 256> = [
    'D6', '90', 'E9', 'FE', 'CC', 'E1', '3D', 'B7', '16', 'B6', '14', 'C2', '28', 'FB', '2C', '05',
    '2B', '67', '9A', '76', '2A', 'BE', '04', 'C3', 'AA', '44', '13', '26', '49', '86', '06', '99',
    '9C', '42', '50', 'F4', '91', 'EF', '98', '7A', '33', '54', '0B', '43', 'ED', 'CF', 'AC', '62',
    'E4', 'B3', '1C', 'A9', 'C9', '08', 'E8', '95', '80', 'DF', '94', 'FA', '75', '8F', '3F', 'A6',
    '47', '07', 'A7', 'FC', 'F3', '73', '17', 'BA', '83', '59', '3C', '19', 'E6', '85', '4F', 'A8',
    '68', '6B', '81', 'B2', '71', '64', 'DA', '8B', 'F8', 'EB', '0F', '4B', '70', '56', '9D', '35',
    '1E', '24', '0E', '5E', '63', '58', 'D1', 'A2', '25', '22', '7C', '3B', '01', '21', '78', '87',
    'D4', '00', '46', '57', '9F', 'D3', '27', '52', '4C', '36', '02', 'E7', 'A0', 'C4', 'C8', '9E',
    'EA', 'BF', '8A', 'D2', '40', 'C7', '38', 'B5', 'A3', 'F7', 'F2', 'CE', 'F9', '61', '15', 'A1',
    'E0', 'AE', '5D', 'A4', '9B', '34', '1A', '55', 'AD', '93', '32', '30', 'F5', '8C', 'B1', 'E3',
    '1D', 'F6', 'E2', '2E', '82', '66', 'CA', '60', 'C0', '29', '23', 'AB', '0D', '53', '4E', '6F',
    'D5', 'DB', '37', '45', 'DE', 'FD', '8E', '2F', '03', 'FF', '6A', '72', '6D', '6C', '5B', '51',
    '8D', '1B', 'AF', '92', 'BB', 'DD', 'BC', '7F', '11', 'D9', '5C', '41', '1F', '10', '5A', 'D8',
    '0A', 'C1', '31', '88', 'A5', 'CD', '7B', 'BD', '2D', '74', 'D0', '12', 'B8', 'E5', 'B4', 'B0',
    '89', '69', '97', '4A', '0C', '96', '77', '7E', '65', 'B9', 'F1', '09', 'C5', '6E', 'C6', '84',
    '18', 'F0', '7D', 'EC', '3A', 'DC', '4D', '20', '79', 'EE', '5F', '3E', 'D7', 'CB', '39', '48',
  ]
  /**
   * @name S盒转化
   */
  static SBox(num: bigint): bigint {
    const hex = num.toString(16).padStart(8, '0')
    let result = '0x'
    for (let i = 0; i < 4; i++) {
      const row: number = Number.parseInt(hex.charAt(2 * i), 16)
      const col: number = Number.parseInt(hex.charAt(2 * i + 1), 16)
      result += SM4.SboxMatrix[row * 16 + col]
    }
    return BigInt(result)
  }
  /**
   * @name 循环左移
   * @param value 原始修改数据
   * @param place 循环左移位数
   */
  static loopLeft(value: bigint, place: number): bigint {
    const bin = value.toString(2).padStart(32, '0')
    return BigInt(`0b${bin.slice(place % 32)}${bin.slice(0, place % 32)}`)
  }
}
