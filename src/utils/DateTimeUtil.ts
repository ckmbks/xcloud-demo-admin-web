import moment from 'moment'
// Parse the time to string
export const parseTime = (
  time?: object | string | number,
  cFormat?: string
): string | null => {
  if (!time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: Date
  if (typeof time === 'object') {
    date = time as Date
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(/-/gm, '/')
      }
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: { [key: string]: number } = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}

/**
 * 创建时间戳
 *
 */
export const createTime = () => {
  return new Date().getTime()
}

/**
 * base64转文件对象
 *
 */
export const dataURLtoFile = (dataurl: any, filename: any) => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

/**
 * 获取裁剪图片
 *
 */
export const curPictureFun = (dataurl: string, size: string = '_400x800') => {
  const arr = dataurl.split(/(.png|.jpg|.gif|.jpeg|.bmp|.tif)$/)
  const newUrl = arr[0] + size + arr[1]
  return newUrl
}

// 获取当月所有天数，含星期
export interface MonthDay {
  date: string
  weekDay: string
  day: string
}

export const getMonthRangeDay = (
  month: object | string | number,
  format: string = 'YYYY-MM-DD'
): Array<MonthDay> => {
  const startTime = moment(month).startOf('month').valueOf()
  //   const endTime = moment(month).endOf('month').valueOf()
  const dayTime = 24 * 60 * 60 * 1000
  //   获取当月天数
  const days = new Date(
    +moment(month).format('YYYY'),
    +moment(month).format('MM'),
    0
  ).getDate()
  const dayAry: Array<MonthDay> = []
  for (let i = 0; i < days; i++) {
    const date = moment(startTime + dayTime * i).format('YYYY-MM-DD')
    const day = moment(startTime + dayTime * i).format(format)
    const weekDay = moment(startTime + dayTime * i).day()
    const obj = {
      day: day,
      date: date,
      weekDay: ['日', '一', '二', '三', '四', '五', '六'][weekDay]
    }
    dayAry.push(obj)
  }
  return dayAry
}

export const getAge = (brithdayStr: string) => {
  const birthday = new Date(brithdayStr)
  const now = new Date()
  if (birthday.getTime() > now.getTime()) return 0
  const age = now.getFullYear() - birthday.getFullYear()
  if (birthday.getMonth() > now.getMonth()) {
    return age - 1
  }
  if (
    birthday.getMonth() === now.getMonth() &&
    birthday.getDate() > now.getDate()
  ) {
    return age - 1
  }
  return age
}

export const getNowDate = () => {
  return moment(Date.now()).format('YYYY-MM-DD')
}

export const getYesterdayDate = () => {
  const now = new Date()
  return moment(now.setDate(now.getDate() - 1)).format('YYYY-MM-DD')
}

export const getTomorrowDate = () => {
  const now = new Date()
  return moment(now.setDate(now.getDate() + 1)).format('YYYY-MM-DD')
}

export const getThisWeek = () => {
  const now = new Date()
  const weekday = now.getDay() === 0 ? 7 : now.getDay()
  const begin = new Date().setDate(now.getDate() - weekday + 1)
  const end = new Date().setDate(now.getDate() - weekday + 7)
  return [moment(begin).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD')]
}

export const getLastWeek = () => {
  const now = new Date()
  const weekday = now.getDay() === 0 ? 7 : now.getDay()
  const begin = new Date().setDate(now.getDate() - weekday - 6)
  const end = new Date().setDate(now.getDate() - weekday)
  return [moment(begin).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD')]
}

export const getThisMonth = () => {
  const begin = new Date().setDate(1)
  const end = new Date()
  end.setMonth(end.getMonth() + 1)
  end.setDate(0)
  return [moment(begin).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD')]
}

export const getLastMonth = () => {
  const begin = new Date()
  begin.setDate(1)
  begin.setMonth(begin.getMonth() - 1)
  const end = new Date().setDate(0)
  return [moment(begin).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD')]
}
