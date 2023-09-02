import { underlineToHumpObject } from '../../transform/underline_to_hump'
/**
 * @description 辅助解析地址栏参数
 * @param href 需要解析的 href, 默认 window.location.href
 * @returns Params to Object
 */
interface IURLParamsProps {
  /** @description 转换为 驼峰; 下划线开头的不转换 __token >> __token */
  hump?: boolean
}
export function getURLParams<T extends { [key in string]: string }>(): Partial<T>
export function getURLParams<T extends { [key in string]: string }>(href: string): Partial<T>
export function getURLParams<T extends { [key in string]: string }>(config: IURLParamsProps): Partial<T>
export function getURLParams<T extends { [key in string]: string }>(href: string, config: IURLParamsProps): Partial<T>
export function getURLParams(...args) {
  let href = window.location.href
  let config: IURLParamsProps = {
    hump: false,
  }
  switch (args.length) {
    case 1:
      if (typeof args[0] === 'string' && args[0]) {
        href = args[0]
        break
      }
      if (typeof args[0] === 'object') {
        config = { ...config, ...(args[0] ?? {}) }
        break
      }
      throw new Error('Illegal parameter')
    case 2:
      if (typeof args[0] !== 'string') throw new Error('[href] Illegal parameter')
      if (typeof args[1] !== 'object' || !args[1]) throw new Error('[config] Illegal parameter')
      href = args[0]
      config = { ...config, ...args[1] }
      break
  }

  const URLParams = {}
  const _url = new URL(decodeURIComponent(href))
  for (const iterator of _url.searchParams.keys()) {
    Reflect.set(URLParams, iterator, _url.searchParams.get(iterator))
  }
  if (config.hump) return underlineToHumpObject(URLParams)
  return URLParams
}
