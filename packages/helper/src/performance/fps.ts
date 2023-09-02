/**
 * One-time calculation of browser FPS.
 *
 * @param callback A callback to get the FPS.
 */
export function calculateFPS(callback: (fps: number) => void) {
  let before = performance.now()
  let frames = 0

  requestAnimationFrame(function frameRequestCallback(domHighResTimeStamp: number) {
    // equal to `performance.now()`
    const now = domHighResTimeStamp
    frames++
    if (now > before + 1000) {
      const frameDeltaTime = now - before
      const fps = Math.floor((frames * 1000) / frameDeltaTime)
      before = now
      frames = 0

      callback(fps)
      return
    }

    requestAnimationFrame(frameRequestCallback)
  })
}
