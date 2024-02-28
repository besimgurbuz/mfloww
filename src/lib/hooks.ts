import { useEffect, useRef, useState, useTransition } from "react"

import { StorageKey, StorageType } from "./definitions"
import { getValueFromStorage, setValueToStorage } from "./utils"

export const useServerAction = <P, R>(
  action: (_: P) => Promise<R>,
  onFinished?: (_: R | undefined) => void
): [(_: P) => Promise<R | undefined>, boolean] => {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<R>()
  const [finished, setFinished] = useState(false)
  const resolver = useRef<(value?: R | PromiseLike<R>) => void>()

  useEffect(() => {
    if (!finished) return

    if (onFinished) onFinished(result)
    resolver.current?.(result)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, finished])

  const runAction = async (args: P): Promise<R | undefined> => {
    startTransition(() => {
      action(args).then((data) => {
        setResult(data)
        setFinished(true)
      })
    })

    return new Promise((resolve) => {
      resolver.current = resolve
    })
  }

  return [runAction, isPending]
}

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false)

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener("change", onChange)
    setValue(result.matches)

    return () => result.removeEventListener("change", onChange)
  }, [query])

  return value
}

export const useStorage = <T>(
  key: StorageKey,
  storageType: StorageType,
  defaultValue?: T
): [T | undefined, (value: T) => void] => {
  const [value, setValue] = useState<T | null>(() =>
    getValueFromStorage<T>(key, storageType)
  )

  useEffect(() => {
    const storedValue = getValueFromStorage<T>(key, storageType)
    if (storedValue !== null) {
      setValue(storedValue)
    }
  }, [key, storageType])

  const updateValue = (newValue: T) => {
    setValue(newValue)
    setValueToStorage(key, newValue, storageType)
  }

  return [value || defaultValue, updateValue]
}
