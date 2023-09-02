/* eslint-disable prefer-rest-params */
/* eslint-disable react-hooks/rules-of-hooks */
// https://github1s.com/Tencent/vConsole/blob/dev/src/network/network.model.ts

// 扩展字段，_url 之类的会和别的插件名称冲突
type SfeXMLHttpRequest = XMLHttpRequest & { _sfeURL?: string; _sfeMethod?: string }
type FuncXMLHttpRequest = (context: SfeXMLHttpRequest) => void
export class SfeInterceptRequest {
  private _xhrOpen?: XMLHttpRequest['open'] = undefined
  private _xhrSend?: XMLHttpRequest['send'] = undefined

  private _onXhrRequest: FuncXMLHttpRequest = () => {}

  public onXhrRequest = (callback: FuncXMLHttpRequest) => {
    if (callback) this._onXhrRequest = callback
  }

  public unXhrIntercept = () => {
    if (window.XMLHttpRequest) {
      if (this._xhrOpen) window.XMLHttpRequest.prototype.open = this._xhrOpen
      if (this._xhrSend) window.XMLHttpRequest.prototype.send = this._xhrSend
      this._xhrOpen = undefined
      this._xhrSend = undefined
    }
  }

  constructor() {
    this.xhr()
  }

  private xhr = () => {
    const _XMLHttpRequest = window.XMLHttpRequest
    if (!_XMLHttpRequest) return
    const that = this
    const _open = window.XMLHttpRequest.prototype.open
    const _send = window.XMLHttpRequest.prototype.send
    that._xhrOpen = _open
    that._xhrSend = _send

    window.XMLHttpRequest.prototype.open = function () {
      const context: SfeXMLHttpRequest = this
      const args = [].slice.call(arguments)
      const method = args[0]
      const url = args[1]

      context._sfeURL = url
      context._sfeMethod = method
      return _open.apply(context, arguments as any)
    }

    window.XMLHttpRequest.prototype.send = function () {
      const context: SfeXMLHttpRequest = this
      that._onXhrRequest(context)
      return _send.apply(context, arguments as any)
    }
  }
}
