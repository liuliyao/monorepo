export function isIos() {
  const devices = ['iphone', 'ipad']
  return devices.some((i) => navigator.userAgent.toLowerCase().includes(i))
}
