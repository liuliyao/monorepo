/** mode 环境 枚举类型 */
export enum DefineEnvMode {
  dev = 'dev',
  stage = 'stage',
  stage1 = 'stage1',
  uat = 'uat',
  prod = 'prod',
}

/** mode 环境 对应的域名 枚举类型 */
export enum DefineEnvModeDomain {
  dev = '-dev',
  stage = '-stage',
  stage1 = '-stage1',
  uat = '-uat',
  prod = '',
}

export type AnyObject = {
  [key: string]: any
}

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type DeepKeyof<T> = T extends object ? keyof T | DeepKeyof<T[keyof T]> : never

export type DeepReplace<T, K = unknown, V = unknown> = {
  [P in keyof T]: K extends P ? V : DeepReplace<T[P], K, V>
}
