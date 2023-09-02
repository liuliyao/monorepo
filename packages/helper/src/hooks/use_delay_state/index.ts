import { useCallback, useState } from 'react'

/**
 * 延迟改变state
 * 用法同useState，setState的时候，支持传入毫秒数，延迟执行setState
 */
type UseDelayStateAction<T = any> = (newState: T | ((state: T) => T), delay?: number) => void

export const useDelayState = <T extends any>(initialState: T | (() => T)): Readonly<[T, UseDelayStateAction<T>]> => {
  const [state, setState] = useState<T>(
    typeof initialState === 'function' ? (initialState as Function)() : initialState
  )

  const changeState = useCallback<UseDelayStateAction<T>>(
    (newState, delay) => {
      const res = typeof newState === 'function' ? (newState as Function)(state) : newState

      if (delay ?? undefined) {
        setTimeout(() => setState(res), delay)
      } else {
        setState(res)
      }
    },
    [state]
  )

  return [state, changeState] as const
}
