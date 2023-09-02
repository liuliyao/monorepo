import axios, { AxiosTransformer } from 'axios'
import { underlineToHumpObject } from '../../transform/underline_to_hump'

/**
 * axios transformResponse 解析驼峰为下划线辅助函数
 * @param resString axios response body
 * @returns string
 */
export const sfeAxiosTransformResponse = (): AxiosTransformer[] => {
  let TransfromResponseArray: AxiosTransformer[] = [
    function sfeTransformResponse(data) {
      try {
        return JSON.stringify(underlineToHumpObject(JSON.parse(data)))
      } catch (error) {
        return data
      }
    },
  ]
  if (Array.isArray(axios.defaults.transformResponse)) {
    TransfromResponseArray = [...TransfromResponseArray, ...axios.defaults.transformResponse]
  } else {
    TransfromResponseArray.push(axios.defaults.transformResponse as AxiosTransformer)
  }
  return TransfromResponseArray
}
