import moment from 'moment'
// Filter for article status
export const articleStatusFilter = (status: string) => {
  const statusMap: { [key: string]: string } = {
    published: 'success',
    draft: 'info',
    deleted: 'danger'
  }
  return statusMap[status]
}

// Filter to uppercase the first character
export const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export const formatTime = (
  time: string | Date | number,
  format: string = 'YYYY-MM-DD HH:mm:ss'
) => {
  if (!time) return '-'
  return moment(time).format(format)
}
export function formatMoney(money: any, digit = 2, dot = false) {
  if (!money) return '0.00'
  let mm = money.toString()
  const index = mm.indexOf('.')
  if (index !== -1) {
    mm = mm.substring(0, digit + index + 1)
  } else {
    mm = mm.substring(0)
  }
  if (!dot) {
    return parseFloat(mm).toFixed(digit)
  } else {
    const moneyArray = parseFloat(mm).toFixed(digit).split('.')
    let num = moneyArray[0]
    let result = ''
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result
      num = num.slice(0, num.length - 3)
    }
    if (num) {
      result = num + result
    }
    if (moneyArray.length > 1) {
      result += '.' + moneyArray[1]
    }
    return result
  }
}
