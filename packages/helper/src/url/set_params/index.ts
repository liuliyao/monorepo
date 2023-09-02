export interface SetURLParamsTypes {
  /**
   * @description 删除一个配置
   */
  del(name: string): SetURLParamsTypes
  /**
   * @description 修改或者新增一个配置
   */
  set(name: string, value: string): SetURLParamsTypes
  /**
   * @description 修改或者新增配置基于一个 JSON 对象配置
   */
  setObject(param: { [key in string]: any }): SetURLParamsTypes
  /**
   * @description 返回 url 解析后的 URL 对象
   */
  url(): URL
  /**
   * @description 返回 操作后的 href 字符串
   */
  href(): string
  /**
   * @description 使删除或者 添加和修改的配置生效于地址栏参数
   * @param reload 是否刷新当前页面，默认 false 静默修改地址栏不刷新页面
   */
  apply(reload?: boolean): void
}

/**
 * @description 辅助操作地址栏参数
 * @param 需要解析的 href, 默认 window.location.href
 * del | set 只是编辑但是不生效，需要后续调用对应的方法生效
 */
export function setURLParams(href?: string): SetURLParamsTypes {
  const _url = new URL(decodeURIComponent(href || window.location.href))
  return {
    del(name) {
      _url.searchParams.delete(name)
      return this
    },

    set(name, value) {
      _url.searchParams[_url.searchParams.has(name) ? 'set' : 'append'](name, value)
      _url.searchParams.set(name, value)
      return this
    },
    setObject(param) {
      if (typeof param !== 'object') throw new Error('TypeError! 参数不合法')
      for (const paramName in param) {
        if (Object.prototype.hasOwnProperty.call(param, paramName)) {
          const paramValue = param[paramName]
          this.set(paramName, String(paramValue))
        }
      }
      return this
    },
    url() {
      return _url
    },
    href() {
      return _url.href
    },
    apply(reload = false) {
      if (window.location.origin !== _url.origin) {
        throw new Error(`Different Origin, Please use href() or url() to do it yourself`)
      }
      if (reload) {
        window.location.href = _url.href
        return
      }
      window.history.replaceState(window.history.state, window.document.title, _url.href)
    },
  }
}
