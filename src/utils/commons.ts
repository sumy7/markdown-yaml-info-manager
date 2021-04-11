import dayjs from 'dayjs'

/**
 * 尝试标准化日期字符串
 * @param date 可能为日期类型的对象
 */
export function toDate (date: any): string | undefined {
  if (!date) {
    return
  }
  const dateJs = dayjs(date)
  if (!dateJs.isValid()) {
    return
  }

  return dateJs.format('YYYY-MM-DD HH:mm:ss')
}
