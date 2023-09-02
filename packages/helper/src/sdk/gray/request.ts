/* eslint-disable camelcase */
import axios from 'axios'

export type GrayOptions = {
  url: {
    check: string
    test: string
  }
  headers: any
}

interface IResponse {
  code: number
  data: {
    gray_release: boolean
    version: string
  }
  msg: string
}
interface IValues {
  grayRelease: boolean
  version: string
}

const grayAxiosInstance = axios.create({
  timeout: 18000,
  headers: { 'Content-Type': 'application/json' },
})

// 调用后端接口，检测当前用户是否具有灰度资格
export async function getGrayInfo(param: GrayOptions): Promise<IValues> {
  const { url, headers } = param
  try {
    const values = await grayAxiosInstance.get<IResponse>(url.check, { headers })
    // 兼容 restful api
    if (typeof values.data['gray_release'] !== 'undefined') {
      return {
        grayRelease: values.data['gray_release'],
        version: values.data['version'],
      }
    }
    // 401
    if (!values.data.data) {
      console.warn('[gray]', values.data, headers)
      return {
        grayRelease: false,
        version: '',
      }
    }

    return {
      grayRelease: values.data.data.gray_release,
      version: values.data.data.version,
    }
  } catch (error) {
    console.error('[gray] 灰度接口出错了', error)
    return {
      grayRelease: false,
      version: '',
    }
  }
}

// 调用后端灰度才有的接口，检测当前灰度与服务端接口对应关系
export async function checkServerGray(param: GrayOptions): Promise<string> {
  const { url, headers } = param
  try {
    const values = await grayAxiosInstance.get<IResponse>(url.test, { headers })
    return JSON.stringify(values.data)
  } catch (error) {
    console.error('[gray] 灰度接口出错了', error)
    return '接口地址出错'
  }
}
