import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePrevious } from '../../usePrevious/ts/usePrevious'

export type Callback<T = any> = (prev: T, value: T) => any
export type Comparator<T extends any[] = any[]> = typeof defaultComparator<T>

export const defaultComparator: <T extends any[] = any[]>(
  prev: T,
  value: T
) => boolean = (prev, curr) =>
  prev.length !== curr.length || (prev.length !== 0 &&
    curr.length !== 0 &&
    prev.some((prevValue, index) => prevValue !== curr[index]))

/**
 * Calls the callback when the previous value changes.
 * @param cb - Callback that will be called when the previous value changes.
 * @param {*} value - Current value.
 * @param options - Options.
 * @param options.callInUseEffect - Whether to call the callback in useEffect.
 * @param options.isValuesDifferent - Comparison function. Should return true
 * if values are not equal !! Every time
 * the hook receives a new comparison function, the check cycle starts,
 * and if the previous value has changed, the callback is called. Therefore,
 * isValuesDifferent should either be a constant or wrapped in useCallback
 * if changing this function does not affect the comparison result.
 * @returns {*} Previous value.
 * @example
 * ```ts
 * const Component = ({ someProp }) => {
 *   const [value, setValue] = useState(() => computeValue(someProps))
 *
 *   // used instead of updating state dependent on multiple values in useEffect
 *   // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 *   useOnPreviousChange((prev, value) => {
 *     setValue(computeValue(someProps))
 *   }, [someProps])
 *
 *   return <span>{value}</span>
 * }
 * ```
 * @example with isValuesDifferent and checking multiple values
 * ```ts
 * const Component = ({ someProp1, someProp2 }) => {
 *   const [value, setValue] = useState(() => computeValue(someProp1, someProp2))
 *
 *   useOnPreviousChange((prev, value) => {
 *      setValue(computeValue(someProp1, someProp2))
 *    }, 
 *    [someProp1, someProp2],
 *    {
 *      // wrap isValuesDifferent in useCallback
 *      // to avoid triggering the check
 *      isValuesDifferent: useCallback((prev, value) => {
 *      // custom check if the values are different
 *        return prev[0] !== value[0] || prev[1] !== value[1]
 *      }, [])
 *    })
 *
 *   return <span>{value}</span>
 * }
 * ```
 */
export const useOnPreviousChange = <T extends any[]>(
  cb: Callback<T>,
  value: T,
  {
    callInUseEffect = false,
    isValuesDifferent = defaultComparator
  }: {
    callInUseEffect?: boolean
    isValuesDifferent?: Comparator<T>
  } = {}
) => {
  const [prev, setPrev] = useState(value)
  const isPrevChanged = useMemo(
    () => isValuesDifferent(prev, value),
    [isValuesDifferent, ...prev, ...value]
  )

  const onChange = useCallback((prev: T, value: T, cb: Callback<T>) => {
    cb(prev, value)
    setPrev(value)
  }, [])

  if (!callInUseEffect && isPrevChanged) {
    onChange(prev, value, cb)
  }

  useEffect(() => {
    if (callInUseEffect && isPrevChanged) {
      onChange(prev, value, cb)
    }
  }, [callInUseEffect, isPrevChanged, onChange, cb, ...prev, ...value])

  return usePrevious(value)
}

export default useOnPreviousChange
