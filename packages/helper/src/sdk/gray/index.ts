/* eslint-disable no-new */

/**
 * @description
 * @author: sfe
 * @api: https://janus-stage.tenclass.com/doc.html#/bbg-crm/gray-release-controller/checkGrayReleaseUsingGET
 * @doc: https://longsee.feishu.cn/docs/doccnyJKUdFPbNeDlYLKyiQa3Z6
 * @note:
 * 前端资源灰度版本： set cookie req-gray="always", 资源返回写入 cookie res-gray="always"
 * 后端接口灰度： 当前资源环境是灰度, 则拦截所有接口请求，添加 请求头 x-gray="always"
 */

import jsCookie from 'js-cookie'
import { merge } from 'lodash-es'
import { DefineEnvMode } from '../../common/define/types'
import { defaultGrayOptions, matchWhiteList } from './helper'
import { SfeInterceptRequest } from './intercept'
import { checkServerGray, getGrayInfo, GrayOptions } from './request'

type FuncOptions = () => Partial<GrayOptions>
type FuncReleaseChange = (release: 'stable' | 'gray') => void

type TypeofGrayOptions = ReturnType<typeof defaultGrayOptions>

export interface SfeGrayProps {
  /** @项目  @tenclass <内部项目> | @nuwaclass <机构版项目> | @更多可扩展 */
  app: keyof TypeofGrayOptions
  /** @business <B端项目> | @customer <C端项目> */
  type: keyof TypeofGrayOptions['nuwaclass']
  /** @当前环境是否是灰度环境 */
  gray: boolean
  /** @当前环境 */
  mode: DefineEnvMode | string
}

export class SfeGray {
  private _onReleaseChange?: FuncReleaseChange
  private _useOptions?: FuncOptions
  private _mode: DefineEnvMode
  private _gray: boolean
  private _app: keyof TypeofGrayOptions
  private _type: keyof TypeofGrayOptions['tenclass']

  constructor(props: SfeGrayProps) {
    const { gray, mode, app, type } = props
    if (!mode) throw new Error('Please input <mode>')
    this._mode = mode as DefineEnvMode
    this._gray = gray
    this._app = app
    this._type = type
    const that = this
    // 控制台调用
    if (this._gray) console.log('[gray] checkServerGray')
    window['checkServerGray'] = async () => {
      const grayOptions = that.getOptions()
      if (!grayOptions) return
      console.log(await checkServerGray(grayOptions))
    }
    if (!gray) return
    const sfeInterceptRequest = new SfeInterceptRequest()
    sfeInterceptRequest.onXhrRequest((ctx) => {
      const { _sfeURL } = ctx
      if (_sfeURL && matchWhiteList(_sfeURL, that._mode)) {
        ctx.setRequestHeader('x-gray', 'always')
      }
    })
  }

  private clear = () => {
    jsCookie.remove('req-gray')
  }
  private mount = () => {
    // 如果有就删掉重新设置，不然会出现重复的好几个，不设置会出现过期时间没有更新
    this.clear()
    jsCookie.set('req-gray', 'always', { path: '/' })
  }
  private getOptions = (): GrayOptions | null => {
    const defaultOptions = defaultGrayOptions(this._mode)[this._app][this._type]
    const customOptions = this._useOptions ? this._useOptions() : {}
    const url = customOptions.url || defaultOptions.url
    const headers = merge(defaultOptions.headers(), customOptions.headers)

    // 如果存在参数有key没有value。则警告，不请求
    for (const iterator of Reflect.ownKeys(headers)) {
      if (iterator === 'authorization') continue
      if (!headers[iterator]) {
        console.warn(`[gray] ${String(iterator)} is not define`)
        return null
      }
    }
    return { url, headers }
  }
  // 自定义参数
  useOptions = (callback: FuncOptions) => {
    if (typeof callback === 'function') this._useOptions = callback
  }
  // 检测到版本变更，下一次刷新生效，gray | stable
  // 仅当检测到下一次版本变更会触发，相同版本下刷新重新请求也不触发
  onReleaseChange = (callback: FuncReleaseChange) => {
    if (typeof callback === 'function') this._onReleaseChange = callback
  }
  // 合适的时机，主动调用SDK 开始检测（下一次刷新之后）是否有灰度资格
  checkNextGray = async () => {
    if (!['stage', 'prod'].includes(this._mode)) return this.clear()
    const grayOptions = this.getOptions()
    if (!grayOptions) return
    try {
      const values = await getGrayInfo(grayOptions)
      // 下一次刷新需要灰度
      if (values.grayRelease) {
        this.mount()
        // 如果当前环境不是灰度，则回调
        if (!this._gray && this._onReleaseChange) this._onReleaseChange('gray')
      } else {
        this.clear()
        if (this._gray && this._onReleaseChange) this._onReleaseChange('stable')
      }
    } catch (error) {
      console.warn('[gray] check gray warn: ', error)
    }
  }
}

export default SfeGray
