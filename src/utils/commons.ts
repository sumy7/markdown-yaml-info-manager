import dayjs from 'dayjs'
import _ from 'lodash'

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

const colors = [{
  normal: 'bg-blue-400',
  hover: 'hover:bg-blue-500'
},
{
  normal: 'bg-green-400',
  hover: 'hover:bg-green-500'
},
{
  normal: 'bg-yellow-400',
  hover: 'hover:bg-yellow-500'
},
{
  normal: 'bg-red-400',
  hover: 'hover:bg-red-500'
}]

/**
 * 获取一个随机的颜色
 */
export function randomColor (): {
  normal: string,
  hover: string
  } {
  return colors[_.random(0, colors.length - 1, false)]
}
