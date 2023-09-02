import { nanoid } from 'nanoid'

export const browserFinger = () => {
  const BrowserPrint = '__bp__'
  try {
    let bp = localStorage.getItem(BrowserPrint)
    if (!bp) {
      bp = nanoid()
      bp && localStorage.setItem(BrowserPrint, bp)
    }
    return bp || ''
  } catch (e) {
    console.error('获取浏览器指纹异常', e)
    return ''
  }
}
