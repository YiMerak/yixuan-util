import type { LengList } from '../Type'

// 字符编码
const encode = (text: string): string => {
  const list = text.split('')
  // UTF-8 编码
  if (list.some((item) => item.charCodeAt(0) > 0xff)) {
    return list.map((item) => item.charCodeAt(0).toString(2).padStart(16, '0')).join('')
  }
  // Unicode 编码
  return list.map((item) => item.charCodeAt(0).toString(2).padStart(8, '0')).join('')
}

// 循环左移
const loopLeft = (num: bigint, place: number): bigint => {
  const bin = num.toString(2).padStart(32, '0')
  return BigInt(`0b${bin.slice(place % 32)}${bin.slice(0, place % 32)}`)
}

// 算法常量
const V0: LengList<bigint, 8> = [0x7380166fn, 0x4914b2b9n, 0x172442d7n, 0xda8a0600n, 0xa96f30bcn, 0x163138aan, 0xe38dee4dn, 0xb0fb0e4en]

// 算法常函数
const T0 = (i: number): bigint => {
  if (i < 0 || i >= 64) {
    throw Error('索引超出')
  }
  if (i < 16) {
    return 0x79cc4519n
  }
  return 0x7a879d8an
}

// 算法常函数
const P0 = (item: bigint) => item ^ loopLeft(item, 9) ^ loopLeft(item, 17)

// 算法常函数
const P1 = (item: bigint) => item ^ loopLeft(item, 15) ^ loopLeft(item, 23)

// 算法常函数
const FF = (i: number, A: bigint, B: bigint, C: bigint): bigint => {
  if (i < 0 || i >= 64) {
    throw Error('索引超出')
  }
  if (i < 16) {
    return A ^ B ^ C
  }
  return (A & B) | (A & C) | (B & C)
}

// 算法常函数
const GG = (i: number, A: bigint, B: bigint, C: bigint): bigint => {
  if (i < 0 || i >= 64) {
    throw Error('索引超出')
  }
  if (i < 16) {
    return A ^ B ^ C
  }
  return (A & B) | (~A & C)
}

export const SM3 = (text: string, pretty = false): string => {
  // 编码
  text = encode(text)

  // 填充
  const binary: string = `${text}1${'0'.repeat(512 - ((1 + text.length + text.length.toString(2).length) % 512))}${text.length.toString(2)}`
  const hexade: string = Array.from({ length: binary.length / 4 }, (_, k) => Number.parseInt(binary.slice(k * 4, (k + 1) * 4), 2).toString(16)).join('')

  // 迭代
  let Vi: Array<bigint> = V0
  let Bi = ''
  for (let i = 0; i < hexade.length / 128; i++) {
    Bi = hexade.slice(i * 128, (i + 1) * 128)
    const W1: Array<bigint> = Array.from({ length: 16 }, (_, k) => BigInt(`0x${Bi.slice(k * 8, (k + 1) * 8)}`))
    const W2: Array<bigint> = []

    // 扩展
    for (let i = 16; i < 68; i++) {
      W1[i] = P1(W1[i - 16] ^ W1[i - 9] ^ loopLeft(W1[i - 3], 15)) ^ loopLeft(W1[i - 13], 7) ^ W1[i - 6]
    }
    for (let i = 0; i < 64; i++) {
      W2[i] = W1[i] ^ W1[i + 4]
    }

    // 压缩
    let [A, B, C, D, E, F, G, H] = Vi
    for (let j = 0; j < 64; j++) {
      const tem1 = loopLeft((loopLeft(A, 12) + E + loopLeft(T0(j), j)) % 2n ** 32n, 7)
      const tem2 = tem1 ^ loopLeft(A, 12)
      const tem3 = (FF(j, A, B, C) + D + tem2 + W2[j]) % 2n ** 32n
      const tem4 = (GG(j, E, F, G) + H + tem1 + W1[j]) % 2n ** 32n
      D = C
      C = loopLeft(B, 9)
      B = A
      A = tem3
      H = G
      G = loopLeft(F, 19)
      F = E
      E = P0(tem4)
    }

    Vi = [A, B, C, D, E, F, G, H].map((item, index) => item ^ Vi[index])
  }
  return Vi.map((item) => item.toString(16).toUpperCase().padStart(8, '0')).join(pretty ? ' ' : '')
}
