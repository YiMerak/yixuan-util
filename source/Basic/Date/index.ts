/**
 * @name 是否闰年
 */
export const isLeap = (value: Date = new Date()) => {
  const year = value.getFullYear()
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)
}

/**
 * @name 日期星期
 */
export const getDateWeek = (value: Date = new Date()) => (['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'] as const)[value.getDay()]

/**
 * @name 元年月数
 */
export const getMoonNumb = (value: Date = new Date()) => (value.getFullYear() - 1970) * 12 + value.getMonth() + 1

/**
 * @name 月份天数
 */
export const getMoonDays = (value: Date = new Date(), standard = false) => {
  const moon = (standard ? value.getUTCMonth() : value.getMonth()) + 1
  if ([1, 3, 5, 7, 8, 10, 12].includes(moon)) {
    return 31
  }
  if ([4, 6, 9, 11].includes(moon)) {
    return 30
  }
  return isLeap(value) ? 29 : 28
}

/**
 * @name 时间间隔
 * @description
 * - 超过10年, 仅显示年
 * - 不足01分, 仅显示秒
 * - 其他情况, 显示最高两位
 * @example
 * ```ts
 * getDateDiff(new Date("2000-12-28",), new Date(),)
 * // 22年
 * getDateDiff(new Date("2019-06-08",), new Date(),)
 * // 4年 6月
 * getDateDiff(new Date("2023-07-01",), new Date(),)
 * // 5月 20天
 * getDateDiff(new Date("2023-12-24",), new Date(),)
 * // 5天 11时
 * getDateDiff(new Date("2023-12-23 08:30:00",), new Date("2023-12-23 11:30:00"),)
 * // 3时 0分
 * getDateDiff(new Date("2023-12-18 20:23:00",), new Date("2023-12-18 20:00:00"),)
 * // 23分 0秒
 * getDateDiff(new Date(1702902253374,), new Date(1702902212280),)
 * // 41秒
 * ```
 */
export const getDateDiff = (value1: Date, value2: Date): string => {
  let value = Math.abs(value1.valueOf() - value2.valueOf())
  const YearData = 1000 * 60 * 60 * 24 * 365
  const yearValue = Math.floor(value / YearData)
  value %= YearData
  if (yearValue > 9) {
    return `${yearValue}年`
  }
  const MoonData = 1000 * 60 * 60 * 24 * 30
  const moonValue = Math.floor(value / MoonData)
  value %= MoonData
  if (yearValue > 0) {
    return `${yearValue}年 ${moonValue}月`
  }
  const DateData = 1000 * 60 * 60 * 24
  const dateValue = Math.floor(value / DateData)
  value %= DateData
  if (moonValue > 0) {
    return `${moonValue}月 ${dateValue}日`
  }
  const HourData = 1000 * 60 * 60
  const hourValue = Math.floor(value / HourData)
  value %= HourData
  if (dateValue > 0) {
    return `${dateValue}日 ${hourValue}时`
  }
  const MinuData = 1000 * 60
  const minuValue = Math.floor(value / MinuData)
  value %= MinuData
  if (hourValue > 0) {
    return `${hourValue}时 ${minuValue}分`
  }
  if (minuValue > 0) {
    return `${minuValue}分 ${Math.floor(value / 1000)}秒`
  }
  return `${Math.floor(value / 1000)}秒`
}

/**
 * @name 日期转字符串
 * @description
 * ```md
 * > 规则详情
 * - `y`必须是4位, 其他1位表示不补零, 2位表示补零
 * - y: // 年
 * - M: // 月
 * - d: // 日
 * - H: // 时(24)
 * - h: // 时(12)
 * - m: // 分
 * - s: // 秒
 *
 * > 内置规则
 * - date: yyyy-MM-dd
 * - time: HH:mm:ss
 * - datetime: yyyy-MM-dd HH:mm:ss
 * ```
 */
export const getDateText = (value: Date = new Date(), format = 'date', standard = false) => {
  if (format === 'datetime') {
    format = 'yyyy-MM-dd HH:mm:ss'
  } else if (format === 'date') {
    format = 'yyyy-MM-dd'
  } else if (format === 'time') {
    format = 'HH:mm:ss'
  }
  const y = (standard ? value.getUTCFullYear() : value.getFullYear()).toString()
  const M = ((standard ? value.getUTCMonth() : value.getMonth()) + 1).toString()
  const d = (standard ? value.getUTCDate() : value.getDate()).toString()
  const H = (standard ? value.getUTCHours() : value.getHours()).toString()
  const h = H === '12' ? '12' : (Number(H) % 12).toString()
  const m = (standard ? value.getUTCMinutes() : value.getMinutes()).toString()
  const s = (standard ? value.getUTCSeconds() : value.getSeconds()).toString()
  return format
    .replace(/yyyy/g, y)
    .replace(/(MM?)/g, (_, t: string) => M.padStart(t.length, '0'))
    .replace(/(dd?)/g, (_, t: string) => d.padStart(t.length, '0'))
    .replace(/(HH?)/g, (_, t: string) => H.padStart(t.length, '0'))
    .replace(/(hh?)/g, (_, t: string) => h.padStart(t.length, '0'))
    .replace(/(mm?)/g, (_, t: string) => m.padStart(t.length, '0'))
    .replace(/(ss?)/g, (_, t: string) => s.padStart(t.length, '0'))
}

/**
 * @name 修改年份
 */
export const setDateYear = (value: Date, year: number) => {
  const newDate = new Date(value.valueOf())
  newDate.setFullYear(newDate.getFullYear() + year)
  return newDate
}

/**
 * @name 修改月份
 */
export const setDateMoon = (value: Date, moon: number) => {
  const newDate = new Date(value.valueOf())
  newDate.setMonth(newDate.getMonth() + moon)
  return newDate
}

/**
 * @name 修改日期
 */
export const setDateDate = (value: Date, date: number) => {
  const newDate = new Date(value.valueOf())
  newDate.setDate(newDate.getDate() + date)
  return newDate
}

/**
 * @name 修改小时
 */
export const setDateHour = (value: Date, hour: number) => {
  const newDate = new Date(value.valueOf())
  newDate.setHours(newDate.getHours() + hour)
  return newDate
}

/**
 * @name 修改分钟
 */
export const setDateMinute = (value: Date, minute: number) => {
  const newDate = new Date(value.valueOf())
  newDate.setMinutes(newDate.getMinutes() + minute)
  return newDate
}

/**
 * @name 修改秒数
 */
export const setDateSecond = (value: Date, second: number) => {
  const newDate = new Date(value.valueOf())
  newDate.setMinutes(newDate.getSeconds() + second)
  return newDate
}

/**
 * @name 日期首刻
 */
export const setDateHead = (value: Date = new Date(), standard = false) =>
  new Date(
    `${standard ? value.getUTCFullYear() : value.getFullYear()}-${(standard ? value.getUTCMonth() : value.getMonth()) + 1}-${
      standard ? value.getUTCDate() : value.getDate()
    } 00:00:00.000${standard ? 'Z' : ''}`,
  )

/**
 * @name 日期尾刻
 */
export const setDateTail = (value: Date = new Date(), standard = false) =>
  new Date(
    `${standard ? value.getUTCFullYear() : value.getFullYear()}-${(standard ? value.getUTCMonth() : value.getMonth()) + 1}-${
      standard ? value.getUTCDate() : value.getDate()
    } 23:59:59.999${standard ? 'Z' : ''}`,
  )

/**
 * @name 月份首刻
 */
export const setMoonHead = (value: Date = new Date(), standard = false) =>
  new Date(
    `${standard ? value.getUTCFullYear() : value.getFullYear()}-${(standard ? value.getUTCMonth() : value.getMonth()) + 1}-01 00:00:00.000${
      standard ? 'Z' : ''
    }`,
  )

/**
 * @name 月份尾刻
 */
export const setMoonTail = (value: Date = new Date(), standard = false) =>
  new Date(
    `${standard ? value.getUTCFullYear() : value.getFullYear()}-${(standard ? value.getUTCMonth() : value.getMonth()) + 1}-${getMoonDays(
      value,
      standard,
    )} 23:59:59.999${standard ? 'Z' : ''}`,
  )

/**
 * @name 年份首刻
 */
export const setYearHead = (value: Date = new Date(), standard = false) =>
  new Date(`${standard ? value.getUTCFullYear() : value.getFullYear()}-01-01 00:00:00.000${standard ? 'Z' : ''}`)

/**
 * @name 年份尾刻
 */
export const setYearTail = (value: Date = new Date(), standard = false) =>
  new Date(`${standard ? value.getUTCFullYear() : value.getFullYear()}-12-31 23:59:59.999${standard ? 'Z' : ''}`)

/**
 * @name 去年此刻
 */
export const setDateYOY = (value: Date = new Date()) => {
  const year = value.getFullYear()
  const moon = value.getMonth() + 1
  const date = value.getDate()
  const hour = value.getHours()
  const minute = value.getMinutes()
  const second = value.getSeconds()
  const millisecond = value.getMilliseconds().toString().padStart(3, '0')
  if (moon === 1 && date === 29) {
    return new Date(`${year - 1}-02-28 ${hour}:${minute}:${second}${millisecond}`)
  }
  return new Date(`${year - 1}-${moon}-${date} ${hour}:${minute}:${second}${millisecond}`)
}

/**
 * @name 上月此刻
 */
export const setDateMOM = (value: Date = new Date()) => {
  const previous = new Date(setMoonHead(value).valueOf() - 1)
  const date1 = value.getDate()
  const date2 = previous.getDate()
  const year = previous.getFullYear()
  const moon = previous.getMonth() + 1
  const hour = value.getHours()
  const minute = value.getMinutes()
  const second = value.getSeconds()
  const millisecond = value.getMilliseconds().toString().padStart(3, '0')
  if (date1 > date2) {
    return new Date(`${year}-${moon}-${date2} ${hour}:${minute}:${second}:${millisecond}`)
  }
  return new Date(`${year}-${moon}-${date1} ${hour}:${minute}:${second}:${millisecond}`)
}
