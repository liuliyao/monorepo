import { useLayoutEffect, useState } from 'react'

/**
 * 更改浏览器 title
 * @param initTitle string
 * @returns (title: string) => void
 */
export const useTitle = (initTitle = '') => {
  const [title, setTitle] = useState<string>(() => initTitle)

  useLayoutEffect(() => {
    if (!title) return
    document.title = title
  }, [document, title])

  return (newTitle: string) => {
    setTitle(newTitle)
  }
}
