/* eslint-disable camelcase */
import { DefineEnvMode, DefineEnvModeDomain } from '../../common/define/types'

// https://longsee.feishu.cn/wiki/wikcn8nUBeuql024bg2zYZLZneg
// 灰度域名列表
// https://longsee.feishu.cn/wiki/wikcnIHBAEXTDLSsEoRgXt6qEBg

// 配置内容由文档同步至此
export const grayDomainOptions = {
  stage: [
    'tenclass.net.cn',
    'route-stage.nuwaclass.net',
    'txgz-bard-stage.nuwaclass.net',
    'txgz-vmtool-stage.nuwaclass.net',
    'api-admin-stage.nuwaclass.com',
    'api-study-stage.nuwaclass.com',
  ],
  prod: [
    'tenclass.net.cn', // 后端主域名
    'route.nuwaclass.net', // 后端域名，调度中心
    'txgz-bard.nuwaclass.net', // 后端域名，女娲中台
    'txgz-vmtool.nuwaclass.net', // 后端域名，女娲中台
    'api-admin.nuwaclass.com', // 机构版B端
    'api-study.nuwaclass.com', // 机构版C端
  ],
}
export const ignoreTenclassDomain = ['vod', 'report', 'liveplay', 'log-report', 'ip', 'im', 'ins', 'ics-center']

/**
 * 判断一个URL地址是否在白名单里面
 * @param url 接口请求地址
 * @returns <true 添加 x-gray 请求头> <false 跳过>
 */
export function matchWhiteList(url: string, env: DefineEnvMode) {
  if (!url) return false
  const grayDomainList: string[] = grayDomainOptions[env]
  if (!grayDomainList || !grayDomainList.length) return false
  let host = ''
  try {
    host = new URL(url).host
  } catch (error) {
    return false
  }
  for (let i = 0; i < grayDomainList.length; i++) {
    if (host.indexOf(grayDomainList[i]) >= 0) {
      if (grayDomainList[i] === 'tenclass.net.cn') {
        return !ignoreTenclassDomain.find((d) => host.indexOf(d) >= 0)
      }
      return true
    }
  }
  return false
}

/**
 * 参数配置项
 * @param env 环境
 * @returns 配置信息
 */
export function defaultGrayOptions(env: DefineEnvMode) {
  const EnvDomain = DefineEnvModeDomain[env]
  return {
    /** @内部项目 */
    tenclass: {
      /** @B 端项目 */
      business: {
        url: {
          check: `https://bbg-crm${EnvDomain}.tenclass.net.cn/admin/api/v1/gray_release/check`,
          test: `https://marketing${EnvDomain}.tenclass.net.cn/api/v1/gray`,
        },
        headers() {
          return {
            'Content-Type': 'application/json',
            // authorization: window.localStorage.getItem('token'),
            'x-shop-code': window.localStorage.getItem('shop_code'),
          }
        },
      },
      /** @C 端项目 */
      customer: {
        url: {
          check: `https://bbg-crm${EnvDomain}.tenclass.net.cn/api/v1/gray_release/check`,
          test: `https://marketing${EnvDomain}.tenclass.net.cn/api/v1/gray`,
        },
        headers() {
          return {
            'Content-Type': 'application/json',
            // authorization: window.localStorage.getItem('token'),
            // FIXME:外部传入店铺code  url.getShopCodeByCurrentUrl()
            // 'x-shop-code': ''
          }
        },
      },
    },
    /** @机构版项目 */
    nuwaclass: {
      /** @B 端项目 */
      business: {
        url: {
          check: `https://api-admin${EnvDomain}.nuwaclass.com/admin/b/api/v1/gray_release/check`,
          test: `https://api-admin${EnvDomain}.nuwaclass.com/admin/b/api/v1/gray_release/test`,
        },
        headers() {
          return {
            'Content-Type': 'application/json',
            // FIXME:外部传入token ServiceUsers.getToken()
            // authorization: '',
            // FIXME:外部传入店铺code ServiceUsers.getSchoolCode()
            'x-tenant-code': '',
          }
        },
      },
      /** @C 端项目 */
      customer: {
        url: {
          check: `https://api-admin${EnvDomain}.nuwaclass.com/admin/c/api/v1/gray_release/check`,
          test: `https://api-admin${EnvDomain}.nuwaclass.com/admin/c/api/v1/gray_release/test`,
        },
        headers() {
          return {
            'Content-Type': 'application/json',
            // FIXME:外部传入token ServiceUsers.getToken()
            // authorization: '',
            // FIXME:外部传入店铺code ServiceCommon.getXTenantCode()
            'x-tenant-code': '',
          }
        },
      },
    },
  }
}
