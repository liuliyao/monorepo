/**
 * @description 消息接收服务
 * @link 飞书文档: https://longsee.feishu.cn/docs/doccnQxihPHGCjhhGVTBZ5A6Qbe#
 * @link tapd: https://www.tapd.cn/52336246/prong/stories/view/1152336246001015793
 * @link 消息服务域名： https://api-admin-dev.nuwaclass.com/base/c/api/v1/notification/events
 * @link 消息服务全地址：https://api-admin-dev.nuwaclass.com/base/c/api/v1/notification/events?t=${token}&tags=a,b,c
 * @param 传了 message 就没有 eventSourceData 返回值。也不会刷新组件
 * @param 没有传 message 就对外暴露 eventSourceData 值。组件会刷新
 */
import { useEffect, useRef } from 'react'
import { setURLParams } from '../../url/set_params'
export enum EventSourceTag {
  /** @token_wrongful token 不合法、token 无效 */
  TOKEN_WRONGFUL = 'ERROR_TOKEN',
  /** @overtime 长时间无响应 */
  OVERTIME = 'OVERTIME',
}
export enum EventSourceCode {
  /** @token_wrongful token 不合法 */
  /** @后端自定义 code */
  TOKEN_WRONGFUL = 90300,
  /** @前端自定义 code */
  OVERTIME = 90300100,
}
// 长时间无响应的超时重试阈值
const SFE_EVENT_OVERTIME_TIMEOUT = 10000

type SseEvent<T> = Event | MessageEvent<T> | EventSource
type SseEventData<T> = { tag: EventSourceTag | string; data: Partial<T> }[]
export interface IEventSource<T> {
  /** @param 自动重连间隔， 为0 则不重连 @default 5000 */
  retry?: number
  /** @param sse 地址 可以写到env环境变量； 长这样 https://api-admin-dev.nuwaclass.com/base/c/api/v1/notification/events */
  url: string
  /** @param 拼接到地址栏的 需要监听的自定义事件名称集合 @example ["aalist", "bbdata"] */
  tags: string[]
  /** @param 接收服务端推送的消息回调；和 eventSourceData 互斥使用，详情见 demo @type { tag: string; data: string | object | unknown } | string */
  message: (data: SseEventData<T>) => void
}

const transfromSourceData = (event: SseEvent<any>) => {
  if (event instanceof MessageEvent) {
    try {
      return JSON.parse(event.data)
    } catch (error) {
      return event.data
    }
  }
  return event
}

export function useEventSource<T extends any>(props: IEventSource<T>) {
  const { url, tags, message, retry = 5000 } = props
  if (!url || !tags || !message) throw new Error('参数不合法' + JSON.stringify(props))
  const refOvertimer = useRef<number>(-100)
  const refInstance = useRef<EventSource>()

  /** 订阅长时间无响应 */
  const bindOvertimer = (token: string) => {
    window.clearTimeout(refOvertimer.current)
    refOvertimer.current = window.setTimeout(() => {
      message([{ tag: EventSourceTag.OVERTIME, data: EventSourceCode.OVERTIME as T }])
      create(token)
    }, SFE_EVENT_OVERTIME_TIMEOUT)
  }
  const bindNoAuth = (value: [{ tag: 'error'; data: { code: number; message: string } }]) => {
    let isNoAuth = false
    for (const iterator of value) {
      if (iterator.tag === 'error' && iterator.data.code === EventSourceCode.TOKEN_WRONGFUL) {
        isNoAuth = true
        break
      }
    }
    return isNoAuth
  }

  const create = (token: string) => {
    if (!token) throw new Error('sse token is not define')
    close()
    const uri = setURLParams(url).set('t', token).set('tags', tags.join(',')).href()
    refInstance.current = new EventSource(uri)

    /** @onmessage */
    refInstance.current.onmessage = (e) => {
      bindOvertimer(token)
      /** ==================== token失效处理 start ==================== */
      const result = transfromSourceData(e)
      message(result)
      if (bindNoAuth(result)) {
        message([{ tag: EventSourceTag.TOKEN_WRONGFUL, data: EventSourceCode.TOKEN_WRONGFUL as T }])
        close()
      }
      /** ==================== token失效处理 end ==================== */
    }
    /** @onerror */
    refInstance.current.onerror = (e) => {
      message([{ tag: 'error', data: e as any }])
      close()
      if (retry > 0) setTimeout(create.bind(null, token), retry)
    }
    /** @onopen */
    refInstance.current.onopen = (e) => {
      message([{ tag: 'open', data: 'open' as T }])
    }
  }
  const close = () => {
    window.clearTimeout(refOvertimer.current)
    if (!refInstance.current) return
    refInstance.current?.close()
    message([{ tag: 'close', data: 'close' as T }])
    refInstance.current = undefined
  }

  useEffect(() => close, [])

  return {
    create,
    close,
  }
}
