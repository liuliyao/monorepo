import { equalArray } from '../array_equal'
/**
 * 判断传入的两个对象是否相等
 * @obj1    object
 * @obj2    object
 */
export function equalObject(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false

  const keys = Object.keys(obj1)
  if (keys?.length !== Object.keys(obj2)?.length) return false
  return keys.every((key) => {
    const value1 = obj1[key]
    const value2 = obj2[key]
    if (typeof value1 !== typeof value2) return false
    if (typeof value1 === 'function') return true // 跳过判断
    if (typeof value1 === 'object') {
      return Array.isArray(value1) ? equalArray(value1, value2) : equalObject(value1, value2)
    }
    return value1 === value2
  })
}
