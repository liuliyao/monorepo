import { useEffect, useState } from 'react'

export const useResizeObserver = (ref: { current: any }, duration = 100) => {
  const [dimensions, setDimensions] = useState<DOMRectReadOnly>()
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    const observeTarget = ref.current
    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      timer && clearTimeout(timer)
      timer = null
      timer = setTimeout(() => {
        entries.forEach((entry) => {
          setDimensions(entry.contentRect)
        })
      }, duration)
    })
    resizeObserver.observe(observeTarget)
    return () => {
      resizeObserver.unobserve(observeTarget)
    }
  }, [ref])
  return dimensions
}
