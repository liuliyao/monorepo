import { getURLParams } from './index'

describe('test the getURLParams', () => {
  test('getURLParams()', () => {
    const queryParams = getURLParams()
    expect(typeof queryParams).toEqual('object')
  })
  test('getURLParams(href)', () => {
    const queryParams = getURLParams(`https://www.tenclass.com/test?a=1&name=张三&user_name=十方&isDebug=1`)
    expect(JSON.stringify(queryParams)).toEqual(JSON.stringify({a: '1', name: '张三', user_name: '十方', isDebug: '1'}))
  })
  test('getURLParams(options)', () => {
    const queryParams = getURLParams({ hump: true })
    expect(typeof queryParams).toEqual('object')
  })
  test('getURLParams(href, options)', () => {
    const queryParams = getURLParams(`https://www.tenclass.com/test?a=1&name=张三&user_name=十方&isDebug=1&__token=asdf&aa_bb__cc___dd=8`, { hump: true })
    expect(JSON.stringify(queryParams)).toEqual(JSON.stringify({a: '1', name: '张三', userName: '十方', isDebug: '1', __token: "asdf", aaBbCcDd: "8"}))
  })
})
