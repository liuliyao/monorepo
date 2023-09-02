/**
 * @description RESTful Api 风格接口请求辅助工具
 * @extends 核心继承 axios
 * @method 内置401 调整到登录界面， 可订制
 * @method header 参数定义
 * @method 生命周期通用辅助函数
 */
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface RESTfulHttpHelperOptions {
  /** 标题显示文案 */
  title?: string
  /** 点击确认回调函数 */
  onOk: Function
}
export type RESTfulHttpHelperHeaders = { [H in string]: Function }
export type RESTfulHttpHelperUseRequest = (config: AxiosRequestConfig) => AxiosRequestConfig
export type RESTfulHttpHelperUseRequestError = (error: Error) => Promise<Error>
export type RESTfulHttpHelperUseResponse = (value) => Promise<typeof value>
export type RESTfulHttpHelperUseResponseError = (error: Error, showErrorMessage: boolean) => Promise<Error>

export class RESTfulHttpHelper {
  private requestOptions: AxiosRequestConfig
  private _useRequest: RESTfulHttpHelperUseRequest
  private _useRequestError: RESTfulHttpHelperUseRequestError
  private _useResponse: RESTfulHttpHelperUseResponse
  private _useResponseError: RESTfulHttpHelperUseResponseError
  private _useNoAuth: Function
  private _useNoPermission: Function
  private _domId: string
  private _noAuthOptions: Required<RESTfulHttpHelperOptions>
  private _PermissionOptions: Required<RESTfulHttpHelperOptions>

  constructor(config: AxiosRequestConfig) {
    const defaultRequestOptions = {
      withCredentials: false,
      timeout: 20 * 1000,
      headers: {
        'Content-Type': 'application/json',
      },
    }
    this.requestOptions = Object.assign({}, defaultRequestOptions, config)
    this._domId = '__SFE__RESTFUL_HTTP_HELPER__POPUP__'
    this._useRequest = (config) => config
    this._useRequestError = (error) => Promise.reject(error)
    this._useResponse = (value) => Promise.resolve(value)
    this._useResponseError = (error) => Promise.reject(error)
    this._noAuthOptions = { title: '您的登录信息已失效，请重新登录！', onOk: function () {} }
    this._PermissionOptions = { title: '暂无权限，请联系管理员或者重新登录！', onOk: function () {} }
    this._useNoAuth = () => this.useHelperPopup(this._noAuthOptions)
    this._useNoPermission = () => this.useHelperPopup(this._PermissionOptions)
  }
  private cssText(dom: HTMLElement, cssText: string) {
    dom.style.cssText = cssText
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean)
      .join('')
  }
  private useHelperPopup(options: Required<RESTfulHttpHelperOptions>) {
    const { title, onOk } = options
    if (window.document.getElementById(this._domId)) return
    const $ModalDOM = window.document.createElement('div')
    const $ModalInner = window.document.createElement('div')
    const $ModalInnerTitle = window.document.createElement('span')
    const $ModalInnerButton = window.document.createElement('span')

    $ModalDOM.id = this._domId

    this.cssText(
      $ModalDOM,
      `position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: hidden;
      outline: 0;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #fff;`
    )
    this.cssText(
      $ModalInner,
      `width: 420px;
      height: 135px;
      padding: 32px 32px 24px;
      font-size: 14px;
      line-height: 1.5715;
      word-wrap: break-word;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
      margin-top: 100px;
      text-align: center;
      pointer-events: auto;`
    )
    this.cssText(
      $ModalInnerTitle,
      `display: block;
      overflow: hidden;
      color: rgba(0,0,0,.85);
      font-size: 16px;
      text-align: center;
      line-height: 1.4;`
    )
    this.cssText(
      $ModalInnerButton,
      `border-radius: 4px;
      -webkit-appearance: button;
      color: #fff;
      background: #118aff;
      cursor: pointer;
      user-select: none;
      touch-action: manipulation;
      margin-top: 24px;
      padding: 4px 15px;`
    )

    $ModalInnerTitle.innerHTML = title
    $ModalInnerButton.innerHTML = '确定'
    $ModalInnerButton.onclick = () => {
      window.document.body.removeChild($ModalDOM)
      onOk()
    }

    $ModalDOM.appendChild($ModalInner)
    $ModalInner.appendChild($ModalInnerTitle)
    $ModalInner.appendChild($ModalInnerButton)
    window.document.body.appendChild($ModalDOM)
  }

  create() {
    const instance = Axios.create(this.requestOptions)
    /** @Request 请求拦截钩子 */
    instance.interceptors.request.use((config) => this._useRequest(config), this._useRequestError)

    /** @Response 响应拦截钩子 */
    instance.interceptors.response.use(this._useResponse, (err) => {
      if (Axios.isCancel(err)) this._useResponseError(err, false)

      const response: AxiosResponse = Reflect.get(err, 'response')
      if (!response) return this._useResponseError(err, false)

      const { config, data, status } = response

      const showErrorMessage = !!Reflect.get(config, 'showErrorMessage')
      const codeMessage = typeof data.code !== 'undefined' && typeof data.message !== 'undefined'

      // 401
      // 会有弹窗，后续业务不做处理，转 resolve 处理， 避免开发环境下报错显示弹窗
      // 一直错误 & 已经处理掉的 错误， 转 resolve
      if (status === 401) {
        this._useNoAuth(response)
        return this._useResponse(response)
      }

      // 403
      // 会有弹窗，后续业务不做处理，转 resolve 处理， 避免开发环境下报错显示弹窗
      // 一直错误 & 已经处理掉的 错误， 转 resolve
      if (status === 403) {
        this._useNoPermission(response)
        return this._useResponse(response)
      }

      // status 不等于 200.但是有 data 信息。有 code & message; 不转换。判断是否弹框提示
      if (codeMessage && showErrorMessage) {
        return this._useResponseError(new Error(data.message), showErrorMessage)
      }

      // 有返回内容
      if (!codeMessage && typeof data !== 'undefined') {
        return this._useResponse(response)
      }

      return this._useResponseError(err, showErrorMessage)
    })
    return instance
  }
  useRequest(handle: RESTfulHttpHelperUseRequest) {
    this._useRequest = handle
  }
  useRequestError(handle: RESTfulHttpHelperUseRequestError) {
    this._useRequestError = handle
  }
  useResponse(handle: RESTfulHttpHelperUseResponse) {
    this._useResponse = handle
  }
  useResponseError(handle: RESTfulHttpHelperUseResponseError) {
    this._useResponseError = handle
  }
  // { 401 } 没登录或者登录信息失效
  useNoAuth(handle: Function | RESTfulHttpHelperOptions) {
    typeof handle === 'function'
      ? (this._useNoAuth = handle)
      : (this._noAuthOptions = Object.assign({}, this._noAuthOptions, handle))
  }
  // { 403 } 无权限
  useNoPermission(handle: Function | RESTfulHttpHelperOptions) {
    typeof handle === 'function'
      ? (this._useNoPermission = handle)
      : (this._useNoPermission = Object.assign({}, this._useNoPermission, handle))
  }
}
