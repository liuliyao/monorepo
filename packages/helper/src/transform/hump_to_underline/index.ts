/**
 * 驼峰字符转下划线
 * @param keyString 带驼峰的字符
 * @returns 转为下划线的字符
 */
export function humpToUnderline(keyString: string) {
  if (!keyString) return keyString
  return keyString.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * 驼峰转下划线 - JSON
 * @param keyString 带驼峰的 JSON
 * @returns 转为下划线的 JSON
 */
export function humpToUnderlineObject(keyObject) {
  if (!keyObject) return keyObject
  if (Object.prototype.toString.call(keyObject) === '[object Object]') {
    const _Object = {}
    for (const key in keyObject) {
      if (Object.prototype.hasOwnProperty.call(keyObject, key)) {
        const value = keyObject[key]
        _Object[humpToUnderline(key)] = humpToUnderlineObject(value)
      }
    }
    return _Object
  }
  if (Object.prototype.toString.call(keyObject) === '[object Array]') {
    const _Array: any[] = []
    for (let i = 0; i < keyObject.length; i++) {
      _Array.push(humpToUnderlineObject(keyObject[i]))
    }
    return _Array
  }
  return keyObject
}
