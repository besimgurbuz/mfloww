import { useEffect, useRef, useState, useTransition } from "react"

import { StorageKey, StorageType, SupportedCurrencyCode } from "./definitions"
import { Transaction } from "./transaction"
import { formatMoney, getValueFromStorage, setValueToStorage } from "./utils"

export const useServerAction = <P, R>(
  action: (_: P) => Promise<R>,
  options?: {
    onFinished?: (_: R | undefined) => void
    onFailed?: (_: Error | undefined) => void
  }
): [(_: P) => Promise<R | undefined>, boolean] => {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<R>()
  const [finished, setFinished] = useState(false)
  const resolver = useRef<(value?: R | PromiseLike<R>) => void>()

  useEffect(() => {
    if (!finished) return

    if (options?.onFinished) options.onFinished(result)
    resolver.current?.(result)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, finished])

  const runAction = async (args: P): Promise<R | undefined> => {
    startTransition(() => {
      action(args)
        .then((data) => {
          setResult(data)
          setFinished(true)
        })
        .catch((error) => {
          if (options?.onFailed) options.onFailed(error)
          setFinished(true)
        })
    })

    return new Promise((resolve, reject) => {
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

export function useStorage<T>(
  key: StorageKey,
  storageType: StorageType,
  defaultValue: T
): [T, (value: T) => void]

export function useStorage<T>(
  key: StorageKey,
  storageType: StorageType,
  defaultValue?: T
): [T | undefined, (value: T) => void]

export function useStorage<T>(
  key: StorageKey,
  storageType: StorageType,
  defaultValue?: T
): [T | undefined, (value: T) => void] {
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

export function useFormattedTransactionAmount(
  transaction: Transaction,
  baseCurrency: SupportedCurrencyCode
) {
  const [amount, setAmount] = useState<string>(
    formatMoney(transaction.amount, transaction.currency)
  )
  const [realAmount, setRealAmount] = useState<string | null>(null)

  useEffect(() => {
    setAmount(formatMoney(transaction.amount, transaction.currency))

    if (transaction.currency !== baseCurrency) {
      setRealAmount(
        formatMoney(
          transaction.amount * transaction.exchangeRate[baseCurrency],
          baseCurrency
        )
      )
    } else {
      setRealAmount(null)
    }
  }, [transaction, baseCurrency])

  return { amount, realAmount }
}
