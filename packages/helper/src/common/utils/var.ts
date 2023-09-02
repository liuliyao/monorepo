// study-fe注入的全局变量
export function isIo() {
  return window?.__site === 'io'
}

export const VPN_HOST = {
  dev: 'https://nwbusiness-dev.tenclass.net',
  stage: 'https://nwbusiness-stage.tenclass.net',
  stage1: 'https://nwbusiness-stage1.tenclass.net',
  uat: 'https://nwbusiness-uat.tenclass.net',
  prod: 'https://nwbusiness.tenclass.net',
}

export const VPN_HOST_ECDN = {
  dev: 'https://nwbusiness-dev.tenclass.net',
  stage: 'https://nwbusiness-stage.tenclass.net',
  stage1: 'https://nwbusiness-stage1.tenclass.net',
  uat: 'https://nwbusiness-uat-ecdn.tenclass.net',
  prod: 'https://nwbusiness-ecdn.tenclass.net',
}

export const PING_HOST = {
  dev: 'https://ping-stage.nuwaclass.net',
  stage: 'https://ping-stage.nuwaclass.net',
  stage1: 'https://ping-stage.nuwaclass.net',
  uat: 'https://ping-stage.nuwaclass.net',
  prod: 'https://ping.nuwaclass.net',
}

export const PING_HOST_ECDN = {
  dev: 'https://pingio-stage.nuwaclass.net',
  stage: 'https://pingio-stage.nuwaclass.net',
  stage1: 'https://pingio-stage.nuwaclass.net',
  uat: 'https://pingio-stage.nuwaclass.net',
  prod: 'https://pingio.nuwaclass.net',
}

export const HOST_MAP = {
  PING_HOST,
  VPN_HOST,
  VPN_HOST_ECDN,
  PING_HOST_ECDN,
}

export function getHost(host: keyof typeof HOST_MAP) {
  return isIo() ? HOST_MAP[`${host}_ECDN`] : HOST_MAP[host]
}
export type Host = keyof typeof HOST_MAP
