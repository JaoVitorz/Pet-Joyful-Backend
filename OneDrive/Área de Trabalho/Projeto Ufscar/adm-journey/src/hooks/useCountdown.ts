// useCountdown Hook
'use client'

import { useEffect, useState } from 'react'

export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1)
      }, 1000)
    } else if (seconds === 0) {
      setIsActive(false)
    }

    return () => clearInterval(interval)
  }, [isActive, seconds])

  const start = () => setIsActive(true)
  const pause = () => setIsActive(false)
  const reset = () => {
    setSeconds(initialSeconds)
    setIsActive(false)
  }

  return { seconds, isActive, start, pause, reset }
}
