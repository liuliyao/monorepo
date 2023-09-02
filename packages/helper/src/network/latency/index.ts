import { getHost } from 'src/common/utils/var'
import { DefineEnvMode } from '../../common/define/types'

export interface ILatencyOptions {
  env?: DefineEnvMode
  timeout?: number
  customPingUrl?: string
}
function getPingUrl(env: DefineEnvMode) {
  return `${getHost('PING_HOST')[env]}/ping?t=${Date.now()}`
}

/**
 * 获取网络延时
 * @param options.env 环境
 * @param options.timeout 超时时间
 * @param options.customPingUrl 自定义 ping 接口
 * @returns 网络延时/超时时间
 */
export async function getLatency(options: ILatencyOptions = {}) {
  const { env = DefineEnvMode.stage, timeout = 2000, customPingUrl } = options
  return new Promise<number>((resolve, reject) => {
    const handleCalcLatency = () => {
      cleanup()
      resolve(Date.now() - sendTime)
    }
    const cleanup = () => {
      $img = null
      timeoutTimer && clearTimeout(timeoutTimer)
    }

    let $img: HTMLImageElement | null = new Image()
    let srcUrl = getPingUrl(env)
    if (customPingUrl) {
      srcUrl = `${customPingUrl}?t=${Date.now()}`
    }
    $img.onerror = handleCalcLatency
    $img.src = srcUrl

    const sendTime = Date.now()
    const timeoutTimer = setTimeout(() => {
      cleanup()
      reject(timeout)
    }, timeout)
  })
}
