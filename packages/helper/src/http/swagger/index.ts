/**
 * 新的 swagger 转换辅助工具
 * @description 对 axios 请求参数转换为下划线
 * @description 对 axios 响应内容转换为驼峰
 */

import axios, { AxiosRequestConfig, AxiosTransformer } from 'axios'
import { camelCase, isArray, isObject, snakeCase, toString, transform } from 'lodash-es'

/**
 * AxiosRequestConfig - "A"xios"R"equest"C"onfig
 */
export type ArcRecord = { showErrorMessage?: boolean; resolveCodeMessage?: boolean }
export type Arc<T = {}> = Omit<AxiosRequestConfig, 'data' | 'params'> & Record<string, any> & T & ArcRecord

/**
 *
 * @param source 需要转换的数据
 * @param type <snake 驼峰转下划线> <camel 下划线转驼峰>
 */
export function changeObjectCase<T extends object>(source: T, type: 'snake' | 'camel'): T
export function changeObjectCase<T>(source: Array<T>, type: 'snake' | 'camel'): Array<T> {
  const caseTypeAction = type === 'snake' ? snakeCase : camelCase
  return transform(source, (acc, value, key, target) => {
    const camelKey = isArray(target) ? key : caseTypeAction(toString(key))
    acc[camelKey] = isObject(value) ? changeObjectCase(value, type) : value
  })
}

/**
 * swagger 驼峰转换辅助函数
 * @param config AxiosRequestConfig
 * @request 驼峰转下划线
 * @response 下划线转驼峰
 * 过滤处理掉非 json 数据，比如 file, Buffer 等之类的
 */
export function axiosHelpers(config: AxiosRequestConfig) {
  const { transformResponse } = config
  // 发起请求，驼峰转下划线
  if (config.params && Object.keys(config.params).length) config.params = changeObjectCase(config.params, 'snake')
  if (config.data && typeof config.data === 'object') config.data = changeObjectCase(config.data, 'snake')

  let cacheTransformResponse: AxiosTransformer[] = []

  // 用户自定义
  if (transformResponse) {
    cacheTransformResponse = transformResponse instanceof Array ? transformResponse : [transformResponse]
  }

  // 驼峰转换
  cacheTransformResponse.push(function toCamel(data) {
    try {
      const jsonSource = JSON.parse(data)
      if (typeof jsonSource !== 'object') return data
      return JSON.stringify(changeObjectCase(jsonSource, 'camel'))
    } catch (error) {
      return data
    }
  })

  // axios 内置默认转换
  if (axios.defaults.transformResponse) {
    if (axios.defaults.transformResponse instanceof Array) {
      cacheTransformResponse = [...cacheTransformResponse, ...axios.defaults.transformResponse]
    } else {
      cacheTransformResponse.push(axios.defaults.transformResponse)
    }
  }
  config.transformResponse = cacheTransformResponse
  return config
}
export function fetchHelpers(config: AxiosRequestConfig) {}
