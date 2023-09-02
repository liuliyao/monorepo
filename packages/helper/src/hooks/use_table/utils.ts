import * as UseTable from './types'

export const urlParams = (params?: any, jump: boolean | undefined = true) => {
  const url = decodeURI(window.location.href)
  if (params === undefined) {
    const paramsArr = url.split('?')[1] ? url.split('?')[1].split('&') : []
    const params: { [key: string]: any } = {}
    paramsArr.forEach((item) => {
      let key = item.split('=')[0]
      let value: string | string[] = item.split('=')[1]
      // 数组
      if (/\[/.test(key)) {
        key = key.split('[')[0]
        value = value.split(',')
        if (value.length === 1 && value[0] === '') value = []
      }
      params[key] = value
    })
    return params
  }
  let paramsStr = ''
  const paramsArr: string[] = []
  for (const key in params) {
    let paramsKey = ''
    let paramsVal = ''
    // 数组
    if (Array.isArray(params[key])) {
      paramsKey = `${key}[]`
      paramsVal = params[key].toString()
    } else {
      // 字符串 or 数字
      paramsKey = `${key}`
      paramsVal = `${params[key]}`
    }

    paramsArr.push(`${paramsKey}=${paramsVal}`)
  }
  paramsArr.forEach((item, index) => {
    if (index === 0) {
      paramsStr += `?${item}`
    } else {
      paramsStr += `&${item}`
    }
  })

  const freshUrl = url.split('?')[0] + paramsStr
  if (!jump) {
    return [freshUrl, freshUrl.split(window.location.origin)[1]]
  }
}

export const handleOrder = (sorter: UseTable.ISorter) => {
  if (Array.isArray(sorter)) {
    console.warn('useTable不支持多行同时排序')
    return {
      order: sorter[0].order,
      order_field: sorter[0].field,
    }
  }
  if (Object.keys(sorter).length) {
    return {
      order: sorter.order,
      order_field: sorter.order ? sorter.field : undefined,
    }
  }
  return {}
}

// 过滤所有undefined和null,空字符串,空数组， 并返回过滤结果
export const filterUseless = (params: UseTable.IFilterUselessParams) => {
  const _params = { ...params }
  for (const key in _params) {
    if (_params[key] === undefined || _params[key] === null) {
      delete _params[key]
    }
    // NaN检查
    // eslint-disable-next-line no-self-compare
    if (_params[key] !== _params[key]) {
      console.error(`@@useTable【参数异常】-> 检查到参数${key}在useTable中表现为NaN，已被自动移除，请检查代码逻辑。`)
      delete _params[key]
    }
    if (typeof _params[key] === 'string' && _params[key].trim() === '') {
      delete _params[key]
    }
    if (Array.isArray(_params[key]) && !_params[key].length) {
      delete _params[key]
    }
  }
  return _params
}

export const getUrlParams = (mode: UseTable.mode) => {
  switch (mode) {
    case 'url':
      return urlParams()
    default:
      return {}
  }
}
