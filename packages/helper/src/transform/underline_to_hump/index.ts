/**
 * 下划线字符转驼峰
 * 首字母是 下划线的，跳过首字母的下滑线处理
 * @param keyString 带下划线的字符
 * @returns 转为驼峰的字符
 */
export function underlineToHump(keyString: string) {
  if (!keyString) return keyString
  if (!/_/g.test(keyString)) return keyString
  if (/^_/.test(keyString)) return keyString
  return keyString.replace(/_+(\w)/g, (all, letter) => letter.toUpperCase())
}

/**
 * 下划线驼转峰 - JSON
 * @param keyString 带下划线的 JSON
 * @returns 转为驼峰的 JSON
 */
export function underlineToHumpObject(keyObject) {
  if (!keyObject) return keyObject
  if (Object.prototype.toString.call(keyObject) === '[object Object]') {
    const _Object = {}
    for (const key in keyObject) {
      if (Object.prototype.hasOwnProperty.call(keyObject, key)) {
        const value = keyObject[key]
        _Object[underlineToHump(key)] = underlineToHumpObject(value)
      }
    }
    return _Object
  }
  if (Object.prototype.toString.call(keyObject) === '[object Array]') {
    const _Array: any[] = []
    for (let i = 0; i < keyObject.length; i++) {
      _Array.push(underlineToHumpObject(keyObject[i]))
    }
    return _Array
  }
  return keyObject
}
