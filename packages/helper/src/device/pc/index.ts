import { isMobile } from '../mobile'
export function isPc() {
  return !isMobile()
}
