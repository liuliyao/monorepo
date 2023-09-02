import { isNull } from 'lodash-es'

/**
 * 选择多个文件
 * @param option.multiple 是否多选
 * @param option.accept 文件类型(accept)
 */
export const selectFiles = (option: { multiple?: boolean; accept?: string } = {}) => {
  const { multiple = true, accept } = option
  return new Promise<File[]>((resolve, reject) => {
    const inputEl = document.createElement('input')
    inputEl.type = 'file'
    inputEl.multiple = multiple
    accept && (inputEl.accept = accept)
    inputEl.click()
    const timer = setTimeout(reject, 20 * 1000)
    inputEl.addEventListener('change', function () {
      if (this.files) {
        resolve(Object.values(this.files))
        clearTimeout(timer)
      }
    })
  })
}

/**
 * 选择多个图片
 */
export const selectImages = () => {
  return selectFiles({ multiple: true, accept: 'image/jpeg,image/x-png,image/gif' })
}

/**
 * 下载网络文件
 * @param url 下载地址
 * @param fileName 文件名称
 */
export const downloadNetWorkFile = (url: string, fileName?: string) => {
  const a = document.createElement('a')
  fileName && (a.download = fileName)
  a.href = url
  a.click()
}

/**
 * 生成 blob|string 文件，并下载
 * @param data blob 数据，或者字符串
 * @param name 文件名称
 */
export const downloadBlobFile = (data: Blob | string, name: string) => {
  const blob = new Blob([data])
  const link = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  link.href = url
  link.download = name
  link.click()
}

export type ReaderType = 'readAsArrayBuffer' | 'readAsBinaryString' | 'readAsDataURL' | 'readAsText'
/**
 * 读取 File 文件
 * @param formType 转换形式
 * @param file 文件
 */
export const readFileReader = <T extends ReaderType>(formType: T, file: File) => {
  type ResultType = T extends 'readAsArrayBuffer' ? ArrayBuffer : string
  return new Promise<ResultType>((resole, reject) => {
    if (typeof FileReader === 'undefined') {
      console.warn('当前环境不支持使用 FileReader Api')
      return reject()
    }
    const reader = new FileReader()
    reader[formType](file)
    reader.onloadend = function () {
      if (isNull(this.result)) reject()
      else resole(this.result as ResultType)
    }
  })
}
