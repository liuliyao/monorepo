import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
/**
 * @message 倒计时
 * 注： 在hooks中传入回调记得包一层useMemo or useCallback
 */
interface CountdownOptions {
  /**
   * @message 格式化倒计时文本的方法
   * @message 默认将总毫数格式化为秒输出
   */
  format?: (time: number) => number | string
  /** 倒计时持续的时间, 单位毫秒, 默认30秒 */
  duration?: number
  /** 倒计时结束回调 */
  onEnd?: () => void
  /** 倒计时心跳回调 */
  onTick?: (tick: number) => void
  /** 倒计时时钟的唯一 name，不传的话，每次重载浏览器都会重置倒计时 */
  name?: string
  /** 倒计时时间间隔,默认1000毫秒 */
  interval?: number
  /** 是否立即开始倒计时，默认false */
  immediate?: boolean
}
type FormatedTime = number | string
type ChangeDuration = (duration: number, isReset?: boolean) => void

enum ClockStatus {
  stop = 'STOP',
  working = 'WORKING',
  pause = 'PAUSE',
}

/** 按一定规则生成在 localStorage 中的时钟名称 */
const getClockName = (name?: string): string => (name ? `HOOKS_USECOUNTDOWN_CLOSK_NAME__${name}` : '')

/** 计算剩余时间 */
const clacLeftTime = (total: number, startTime: number): number => {
  if (startTime === 0) return total
  const left = total - (Date.now() - startTime)
  if (left < 0) return 0
  return left
}

/** 默认的格式转换 */
const defaultFormat = (time) => Math.floor(time / 1000)

/** 获取默认开始时间 */
const getInitalStartTime = (clockName, immediate = false) => {
  if (!clockName) return immediate ? Date.now() : 0
  const startTime = localStorage.getItem(clockName)
  if (!startTime) {
    localStorage.setItem(clockName, JSON.stringify(immediate ? Date.now() : 0))
    return immediate ? Date.now() : 0
  }
  return +startTime
}

interface IUseCountdown {
  countdown: FormatedTime
  changeCountdown: ChangeDuration
  restart: () => void
  start: () => void
  pause: () => void
  toggle: () => void
}

export const useCountdown = (options: CountdownOptions = {}): Readonly<IUseCountdown> => {
  const { duration = 30000, onEnd, onTick, name, interval = 1000, immediate = false, format = defaultFormat } = options
  const clockName = useMemo(() => getClockName(name), [name])
  /** 倒计时开始时间 */
  const [startTime, setStartTime] = useState<number>(() => getInitalStartTime(clockName, immediate))
  const startTimeBackRef = useRef<number>(getInitalStartTime(clockName, immediate))
  const [total, setTotal] = useState<number>(() => duration)
  const [leftTime, setLeftTime] = useState<number>(() => clacLeftTime(total, startTime))
  /** 暂停之前已经进行了的时长 */
  const processDuration = useRef<number>(0)
  /** 时钟状态 */
  const clockStatusRef = useRef<ClockStatus>(immediate ? ClockStatus.working : ClockStatus.stop)
  /** 定时器 */
  const timerRef = useRef<number>(0)
  const formatedLeftTime = useMemo<FormatedTime>(() => format?.(leftTime) ?? leftTime, [leftTime, format])

  const changeStartTime = useCallback<(value: number) => void>(
    (newStartTime) => {
      setStartTime(newStartTime)
      startTimeBackRef.current = newStartTime
    },
    [setStartTime, startTimeBackRef]
  )

  /** 暂停 */
  const pause = useCallback(() => {
    if (clockStatusRef.current !== ClockStatus.working) return
    const now = Date.now()
    processDuration.current = now - startTimeBackRef.current
    clockStatusRef.current = ClockStatus.pause
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = 0
    }
  }, [clockStatusRef, ClockStatus, startTimeBackRef, processDuration, timerRef])

  // 重置倒计时并启动
  const resetClock = useCallback(() => {
    const newStartTime = Date.now()
    clockStatusRef.current = ClockStatus.working
    changeStartTime(newStartTime)
    clockName && localStorage.setItem(clockName, JSON.stringify(newStartTime))
  }, [clockStatusRef, ClockStatus, clockName, changeStartTime])

  /** 改变倒计时总时间，第二个参数可以选择是否重置倒计时 */
  const changeTotal = useCallback<ChangeDuration>(
    (total, isReset = true) => {
      setTotal(total)
      isReset && resetClock()
    },
    [setTotal, clockName, resetClock]
  )

  /** 继续 */
  const start = useCallback(() => {
    if (clockStatusRef.current === ClockStatus.working) return
    if (clockStatusRef.current === ClockStatus.stop) {
      resetClock()
    } else {
      const newStartTime = Date.now() - processDuration.current
      processDuration.current = 0
      clockStatusRef.current = ClockStatus.working
      changeStartTime(newStartTime)
    }
  }, [resetClock, changeStartTime, processDuration, clockStatusRef, ClockStatus])

  /** 启停切换 */
  const toggle = useCallback(() => {
    if (clockStatusRef.current === ClockStatus.working) {
      pause()
    } else {
      start()
    }
  }, [clockStatusRef, ClockStatus, pause, start])

  useEffect(() => {
    setLeftTime(clacLeftTime(total, startTime))
    if (!startTime || clockStatusRef.current !== ClockStatus.working) {
      return
    }

    const _timer = window.setInterval(() => {
      const left = clacLeftTime(total, startTime)
      setLeftTime(left)
      onTick?.(left)

      if (left === 0) {
        _timer && clearInterval(_timer)
        onEnd?.()
      }
    }, interval)

    timerRef.current = _timer

    return () => {
      timerRef.current = 0
      clearInterval(_timer)
    }
  }, [clockStatusRef, timerRef, ClockStatus, clacLeftTime, interval, total, startTime])

  return {
    countdown: formatedLeftTime,
    changeCountdown: changeTotal,
    restart: resetClock,
    start,
    pause,
    toggle,
  } as const
}
