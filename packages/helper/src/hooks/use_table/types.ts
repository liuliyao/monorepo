import { Key, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface'
import { TablePaginationConfig } from 'antd/lib/table/Table'
import React from 'react'

export type mode = 'default' | 'url'

export type order = 'descend' | 'ascend'

export interface IPagination extends TablePaginationConfig {
  pageSize: number
  current: number
}

export interface IParams {
  limit?: number
  offset?: number
}

export interface IFilterUselessParams {
  [key: string]: any
}

export type ISorter = SorterResult<any> | SorterResult<any>[]

export interface IOnChange {
  (
    pagination: IPagination,
    filters: Record<string, Key[] | null>,
    sorter: ISorter,
    extra: TableCurrentDataSource<any>
  ): void
}

export interface IResponse<T> {
  total: number
  data: T[]
}

export interface IUseTableOpts<T, V> {
  api: (params: V) => Promise<IResponse<T>>
  mode?: mode
  params?: V
  pagination?: IPagination
  beforeUpdate?: (data: any) => T[]
  pageScene?: 'default' | 'columns' | 'drawer' | 'card'
}

export interface IUseTable<T, V> {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  active: boolean
  setActive: React.Dispatch<React.SetStateAction<boolean>>
  res: IResponse<T>
  setRes: React.Dispatch<React.SetStateAction<IResponse<T>>>
  data: T[]
  setData: React.Dispatch<React.SetStateAction<T[]>>
  params: V
  setParams: React.Dispatch<React.SetStateAction<V>>
  pagination: IPagination
  setPagination: React.Dispatch<React.SetStateAction<IPagination>>
  refresh: () => void
  onChange: IOnChange
  mergeParams: (fresh: { [key: string]: any }) => void
  getOrderValue: (key: string) => order | ''
}
