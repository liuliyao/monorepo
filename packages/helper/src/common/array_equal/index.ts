import { equalObject } from '../object_equal'
/**
 * 判断两个数组是否数值相等
 */
export function equalArray(arr1: any[], arr2: any[]): boolean {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false
  if (arr1.length !== arr2.length) return false

  for (let i = 0; i < arr1.length; i++) {
    let flag = true
    const value1 = arr1[i]
    const value2 = arr2[i]
    if (typeof value1 !== typeof value2) {
      return false
    }
    if (typeof value1 === 'function') continue
    if (typeof value1 === 'object') {
      flag = Array.isArray(value1) ? equalArray(value1, value2) : equalObject(value1, value2)
    } else {
      flag = value1 === value2
    }
    if (!flag) return false
  }
  return true
}
