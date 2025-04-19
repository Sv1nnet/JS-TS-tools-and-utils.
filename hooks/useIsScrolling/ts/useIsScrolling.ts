import { useEffect, useRef, useState } from 'react'

export type ScrollReason = 'timeout' | 'touchend'

export const useIsScrolling = (element: HTMLElement, {
  onScrollStart,
  onScroll,
  onScrollEnd,
  isBoundedToPointer = false,
  msToSetNotScrolling = 16,
}: {
  onScrollStart?: (event: Event) => void;
  onScroll?: (event: Event) => void;
  onScrollEnd?: (arg: { reason: ScrollReason, event: Event }) => void;
  isBoundedToPointer?: boolean;
  msToSetNotScrolling?: number;
} = {}) => {
  const [ isScrolling, setIsScrolling ] = useState(false)

  const onScrollRef = useRef(onScroll)
  const onScrollEndRef = useRef(onScrollEnd)
  const onScrollStartRef = useRef(onScrollStart)
  const isPointerDownRef = useRef(false)
  const scrollingTimeoutRef = useRef<NodeJS.Timeout | number | undefined>()

  useEffect(() => {
    onScrollRef.current = onScroll
    onScrollEndRef.current = onScrollEnd
    onScrollStartRef.current = onScrollStart
  }, [ onScroll, onScrollEnd, onScrollStart ])

  useEffect(() => {
    if (!element) return

    const abortController = new AbortController()
    const options = { signal: abortController.signal }

    const setScrollEndHandler = (e: Event) => {
      clearTimeout(scrollingTimeoutRef.current as number)
      scrollingTimeoutRef.current = setTimeout(() => {
        if ((isBoundedToPointer && !isPointerDownRef.current) || !isBoundedToPointer) {
          setIsScrolling(false)
          onScrollEndRef.current?.({ reason: 'timeout', event: e })
        }
      }, msToSetNotScrolling)
    }

    element.addEventListener(
      'scroll',
      (e) => {
        onScrollRef.current?.(e)
        if (!isScrolling) {
          setIsScrolling(true)
          onScrollStartRef.current?.(e)
        }

        setScrollEndHandler(e)
      },
      options,
    )

    element.addEventListener(
      'touchstart',
      () => {
        isPointerDownRef.current = true
      },
      options,
    )

    element.addEventListener(
      'touchend',
      (e) => {
        isPointerDownRef.current = false
        setScrollEndHandler(e)
      },
      options,
    )

    return () => {
      abortController.abort()
    }
  }, [ element, isBoundedToPointer, msToSetNotScrolling, isBoundedToPointer ])

  return isScrolling
}

export default useIsScrolling
