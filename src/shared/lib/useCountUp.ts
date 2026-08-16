import { useEffect, useRef, useState } from 'react'

const FINAL_STEPS = 5
const STEP_DELAY = 1000

export function useCountUp(target: number, duration = 2200): number {
  const [display, setDisplay] = useState(0)
  const displayRef = useRef(0)

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduced) {
      displayRef.current = target
      setDisplay(target)
      return
    }

    let frame: number | undefined
    let interval: ReturnType<typeof setInterval> | undefined
    let cancelled = false

    const set = (v: number) => {
      displayRef.current = v
      setDisplay(v)
    }

    const startFinalTicks = () => {
      interval = setInterval(() => {
        const current = displayRef.current
        if (current >= target) {
          clearInterval(interval)
          return
        }
        set(current + 1)
      }, STEP_DELAY)
    }

    const fastTarget = target - FINAL_STEPS

    if (displayRef.current >= fastTarget) {
      // осталось мало — просто дотикаем по +1 в секунду
      startFinalTicks()
    } else {
      const from = displayRef.current
      const start = performance.now()

      const tick = (now: number) => {
        if (cancelled) return
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        set(Math.round(from + (fastTarget - from) * eased))
        if (progress < 1) {
          frame = requestAnimationFrame(tick)
        } else {
          startFinalTicks()
        }
      }

      frame = requestAnimationFrame(tick)
    }

    return () => {
      cancelled = true
      if (frame) cancelAnimationFrame(frame)
      if (interval) clearInterval(interval)
    }
  }, [target, duration])

  return display
}