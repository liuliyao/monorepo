import { ReactElement, ReactNode, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { generateUid } from 'src/common/utils'

function generateContainer(val: string, mode: 'multiple' | 'tags' | undefined) {
  const targetELement = document.querySelector(
    `.${val} .${mode === 'multiple' ? 'ant-select-selection-overflow' : 'ant-select-selection-search'}`
  )
  const newElement = document.createElement('div')
  newElement.setAttribute('id', val)
  newElement.setAttribute('style', 'position: relative; z-index: 2;')
  targetELement?.parentNode?.insertBefore(newElement, targetELement)
}

const usePrefix = (prefix: ReactNode, mode: 'multiple' | 'tags' | undefined) => {
  const uuidRef = useRef<string>(`sfe-${generateUid()}`)

  const generatePrefix = () => {
    generateContainer(uuidRef.current, mode)
    ReactDOM.render(prefix as ReactElement, document.getElementById(`${uuidRef.current}`), () => {
      const targetELement = document.getElementById(`${uuidRef.current}`)
      !mode &&
        targetELement?.parentNode &&
        (targetELement.parentNode.childNodes[1] as HTMLElement)?.setAttribute(
          'style',
          `padding-left: ${targetELement?.offsetWidth || 42}px`
        )
    })
  }

  // 设置prefix的颜色
  const setPrefixColor = (color: string) => {
    document.getElementById(`${uuidRef.current}`)?.setAttribute('style', `color: ${color}`)
  }

  useEffect(() => {
    prefix && generatePrefix()
  }, [])

  return { uuidRef, setPrefixColor }
}

export default usePrefix
