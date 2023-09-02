import { diff } from 'deep-object-diff'
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import * as UseTable from './types'
import { filterUseless, getUrlParams, handleOrder, urlParams } from './utils'

const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100']

// 分页器配置
const PAGINATION_CONFIG: any = {
  default: {
    pageSize: 10,
    size: 'default',
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    showQuickJumper: true,
    showSizeChanger: true,
    showLessItems: false,
    showTotal: (total: number, range: number[]) => {
      return `第 ${range[0]}~${range[1]} 条 / 共 ${total} 条`
    },
  },
  columns: {
    pageSize: 10,
    size: 'default',
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    showQuickJumper: true,
    showSizeChanger: true,
    showLessItems: true,
    showTotal: (total: number) => {
      return `共 ${total} 条`
    },
  },
  drawer: {
    pageSize: 10,
    size: 'small',
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    showQuickJumper: true,
    showSizeChanger: true,
    showLessItems: true,
    showTotal: (total: number) => {
      return `共 ${total} 条`
    },
  },
  card: {
    simple: true,
  },
}

const useTable = <T, V>(opts: UseTable.IUseTableOpts<T, V>, defaultactive = true): UseTable.IUseTable<T, V> => {
  const {
    api,
    params: defaultparams = {},
    pagination: defaultpagination = {},
    mode = 'default',
    beforeUpdate,
    pageScene = 'default',
  } = opts
  const history = useHistory()
  const defaultParams: any = { offset: 0, limit: 10, ...defaultparams, ...getUrlParams(mode) }
  const prevParams = useRef(defaultParams)
  const [res, setRes] = useState<UseTable.IResponse<T>>({ total: 0, data: [] })
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(defaultactive)
  const [params, setParams] = useState<V>(defaultParams)
  const [pagination, setPagination] = useState({ ...PAGINATION_CONFIG[pageScene], ...defaultpagination })
  const refresh = () => setParams({ ...params })
  const loadingRef = useRef(true)

  const onChange: UseTable.IOnChange = (pagination, filters, sorter) => {
    let _params: any = { ...params }

    // 处理分页器发生变化
    _params = { ..._params, limit: pagination.pageSize, offset: pagination?.pageSize * (pagination?.current - 1) }

    // 处理排序
    const order = handleOrder(sorter)
    _params = { ..._params, ...order }

    // 处理过滤
    _params = { ..._params, ...filters }
    setParams(_params)
  }

  const mapParamsToUrl = (_params: any) => {
    // 需要将参数映射到url
    history.replace(urlParams(_params, false)?.[1])
  }

  // 如果存在beforeUpdate， 则经处理后再setData, 否则直接setData
  const handleDataChane = async (data: T[]) => {
    if (beforeUpdate) {
      const _data = await beforeUpdate(data)
      return _data
    }
    return data
  }

  // 对比上一次的参数，如果发现除(offset, limit)发生改变，则需要翻到第一页(offset=0)
  const diffParams = (params: any) => {
    const ignore = ['offset', 'limit']
    const difference = Object.keys(diff(prevParams.current, params))
    const motive = difference.some((i) => !ignore.includes(i))
    if (motive) params = { ...params, offset: 0 }
    prevParams.current = params
    return params
  }

  // 合并参数
  const mergeParams = (fresh: { [key: string]: any }) => {
    setParams((state) => ({ ...state, ...fresh }))
  }

  // 查询orderKey
  const getOrderValue = (key: string) => {
    if ((params as any).order_field === key) {
      return (params as any).order
    }
    return null
  }

  useEffect(() => {
    if (active) {
      loadingRef.current = true
      // setTimeout添加原因：antd table分页切换pageSize后，由于设置loading组件dom结构改变，导致分页下拉框定位跳动，所以要延后setLoading(true)动作，让下拉动作先触发，这样下拉框就不会定位跳动
      setTimeout(() => {
        if (loadingRef.current) {
          setLoading(true)
        }
      }, 100)

      // 请求的参数(清洗无用的参数, 并检查参数的改变)
      const _params = diffParams(filterUseless({ ...params }))
      // url模式额外的处理
      if (mode === 'url') mapParamsToUrl(_params)

      api(_params)
        .then(async (res) => {
          setData(await handleDataChane(res.data))

          const current = _params.offset / _params.limit + 1
          setPagination({
            ...pagination,
            pageSize: _params.limit,
            total: res.total,
            current,
          })
        })
        .finally(() => {
          // 若100ms之前数据返回，则不会loading
          loadingRef.current = false
          setLoading(false)
        })
    }
  }, [params, active])

  return {
    loading,
    setLoading,
    active,
    setActive,
    res,
    setRes,
    data,
    setData,
    params,
    setParams,
    pagination,
    setPagination,
    refresh,
    onChange,
    mergeParams,
    getOrderValue,
  }
}

export default useTable
