import { useEffect, useRef } from 'react'

export const usePrevious = <T = any>(value: T): T => {
  const prevRef = useRef<T>(value)

  useEffect(() => {
    prevRef.current = value
  }, [value])

  return prevRef.current
}

export default usePrevious
