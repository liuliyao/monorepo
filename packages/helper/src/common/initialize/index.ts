/* eslint-disable camelcase */
import { getURLParams } from '../../url/get_params'
import { setURLParams } from '../../url/set_params'

/**
 * 控制台输出 Jenkins 信息和版本信息
 * @param NODE_ENV 开发环境
 * @param MODE 运行环境
 * @param JENKINS_BUILD_NUMBER Jenkins 构建号
 * @param APP_VERSION 项目版本号
 * @param TITLE 标题
 */
export function devToolInfo(NODE_ENV, MODE, JENKINS_BUILD_NUMBER, APP_VERSION, TITLE?: string) {
  const cEnv = NODE_ENV === 'production' && MODE === 'prod' ? '' : `[环境]: ${MODE} `
  const aStyle = 'padding: 6px 4px;background: #e3333a; color: #fff; border-radius: 2px 0 0 2px;'
  const bStyle = 'padding: 6px 4px;background: #000000; color: #fff; border-radius: 0 0px 0px 0;'
  const cStyle = 'padding: 6px 4px;background: #118AFF; color: #fff; border-radius: 0 2px 2px 0;'
  const aText = `%c ${TITLE || '十方教育'} `
  const bText = `%c ${window.location.origin} `
  const cText = ` %c [版本]: ${APP_VERSION} ${cEnv}[Build]: ${JENKINS_BUILD_NUMBER} `
  console.log(`${aText}${bText}${cText}`, aStyle, bStyle, cStyle)
}

/**
 * 生命全局辅助函数
 * @returns clear 清理本地缓存
 * @returns debug 开启 debug
 */
export function defineGlobalParams() {
  const { g_debug, g_clear, g_loglevel } = getURLParams<{ g_debug: string; g_clear: string; g_loglevel: string }>()
  if (g_clear) {
    window.localStorage.clear()
    window.sessionStorage.clear()
    alert('系统缓存已重置！ 重新访问?')
    setURLParams().del('sfe_clear').apply()
  }

  if (g_debug) {
    console.log('TODO:')
  }
}
