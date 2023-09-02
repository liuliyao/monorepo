import { isAndroid } from './android'
import { isIos } from './ios'
import { isMobile } from './mobile'
import { isPc } from './pc'

const ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045409 Mobile Safari/537.36 MMWEBID/9133 MicroMessenger/7.0.20.1781(0x2700143F) Process/tools WeChat/arm64 NetType/WIFI Language/zh_CN ABI/arm64'
const IOS_UA =
  'Mozilla/5.0 (; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.18(0x1700122c) NetType/WIFI Language/zh_CN'
const PC_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
const MOBILE_UA =
  'Mozilla/5.0 (; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.18(0x1700122c) NetType/WIFI Language/zh_CN'

let uaValue = PC_UA
function initUA() {
  Object.defineProperty(window.navigator, 'userAgent', {
    get: function () {
      return uaValue
    }
  })
}

initUA()

describe('test the case the device is pc', () => {
  // 测试设备为 PC 端的情况
  beforeAll(() => {
    uaValue = PC_UA
  })

  test('isPc() will return true', () => {
    expect(isPc()).toBe(true)
  })
  test('isMoible() will return false', () => {
    expect(isMobile()).toBe(false)
  })
})

describe('test the case the device is mobile', () => {
  // 测试设备为移动端的情况
  beforeAll(() => {
    uaValue = MOBILE_UA
  })

  test('isMoible() will return true', () => {
    expect(isMobile()).toBe(true)
  })
  test('isPc() will return false', () => {
    expect(isPc()).toBe(false)
  })
})

describe('test the case the device is Android', () => {
  // 测试设备为 Android 的情况
  beforeAll(() => {
    uaValue = ANDROID_UA
  })

  test('isAndroid() will return true', () => {
    expect(isAndroid()).toBe(true)
  })
  test('isIos() will return false', () => {
    expect(isIos()).toBe(false)
  })
})

describe('test the case the device is Ios', () => {
  // 测试设备为 Ios 的情况
  beforeAll(() => {
    uaValue = IOS_UA
  })

  test('isIos() will return true', () => {
    expect(isIos()).toBe(true)
  })
  test('isAndroid() will return false', () => {
    expect(isAndroid()).toBe(false)
  })
})
