/**
 * @description 集本地存储，内存存储，发布订阅于一身
 * enum EnumStorage {
 *   token = 'token',
 *   userName = 'userName'
 * }
 * const storage = new Storage<EnumStorage>()
 * 如需扩展 参考 >> https://gitlab.weike.fm/bbg/mew/blob/master/src/storage.ts
 */

export class Storage<TKey extends string> {
  getItem<T = string>(key: TKey) {
    let value = window.localStorage.getItem(key)
    if (value === null) return null
    try {
      value = JSON.parse(value)
    } catch (err) {
      /** */
    }
    return value as T | null
  }
  setItem(key: TKey, value: { [key: string]: any } | string | number) {
    let retValue
    if (typeof value === 'object') {
      retValue = JSON.stringify(value)
    } else {
      retValue = String(value)
    }
    window.localStorage.setItem(key, retValue)
  }
  removeItem(key: TKey) {
    window.localStorage.removeItem(key)
  }
  clear() {
    window.localStorage.clear()
  }
}
