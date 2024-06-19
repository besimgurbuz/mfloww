import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react"

import { DashboardStateContext } from "@/app/dashboard/dashboard-context"

import {
  MontlyDifference,
  RatesStore,
  StorageKey,
  StorageType,
  SupportedCurrencyCode,
} from "./definitions"
import { fetchExchangeRates } from "./rates"
import { Transaction } from "./transaction"
import TransactionStatistics from "./transaction/statistics"
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

export function useTransactionStatistics() {
  const { entryTransactions, baseCurrency } = useContext(DashboardStateContext)
  const transactionStatistics = useMemo(
    () => new TransactionStatistics(entryTransactions, baseCurrency),
    [entryTransactions, baseCurrency]
  )

  useEffect(() => {
    transactionStatistics.setTransactions(entryTransactions)
  }, [entryTransactions, transactionStatistics])

  return transactionStatistics
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

export function useExchangeRatesStore(
  baseCurrency: SupportedCurrencyCode,
  intervalDurationMs = 1000 * 60 * 5
) {
  const [ratesStore, setRatesStore] = useState<RatesStore>({} as RatesStore)
  const fillExchangeRates = useCallback(async () => {
    const exchangeRates = await fetchExchangeRates(baseCurrency)
    setRatesStore((prev) => ({
      ...prev,
      [baseCurrency]: exchangeRates,
    }))
  }, [baseCurrency])

  useEffect(() => {
    fillExchangeRates()
    const interval = setInterval(() => {
      fillExchangeRates()
    }, intervalDurationMs)

    return () => clearInterval(interval)
  }, [fillExchangeRates, intervalDurationMs])

  return ratesStore
}

export function useMontlyDiffPercentage(
  transactions: Transaction[],
  baseCurrency: SupportedCurrencyCode,
  selectedDate: string
) {
  const [incomeDiff, setIncomeHighlight] = useState<MontlyDifference | null>(
    null
  )
  const [expenseDiff, setExpenseHighlight] = useState<MontlyDifference | null>(
    null
  )

  useEffect(() => {
    const previousDate = getPreviousMonth(selectedDate)

    let selectedDateIncome = 0
    let selectedDateExpense = 0
    let previousDateIncome = 0
    let previousDateExpense = 0

    if (transactions.length === 0) {
      return
    }

    transactions.forEach((transaction) => {
      if (transaction.date === selectedDate || transaction.isRegular) {
        if (transaction.type === "income") {
          selectedDateIncome +=
            transaction.amount * (transaction.exchangeRate[baseCurrency] || 1)
        } else if (transaction.type === "expense") {
          selectedDateExpense +=
            transaction.amount * (transaction.exchangeRate[baseCurrency] || 1)
        }
      }

      if (transaction.date === previousDate || transaction.isRegular) {
        if (transaction.type === "income") {
          previousDateIncome +=
            transaction.amount * (transaction.exchangeRate[baseCurrency] || 1)
        } else if (transaction.type === "expense") {
          previousDateExpense +=
            transaction.amount * (transaction.exchangeRate[baseCurrency] || 1)
        }
      }
    })

    const incomeDifference = selectedDateIncome - previousDateIncome
    const expenseDifference = selectedDateExpense - previousDateExpense

    const incomePercentageDifference = Math.abs(
      (incomeDifference / (previousDateIncome || 1)) * 100
    )
    const expensePercentageDifference = Math.abs(
      (expenseDifference / (previousDateExpense || 1)) * 100
    )

    // Create the highlight objects
    const incomeDiff: MontlyDifference = {
      percentage: incomePercentageDifference,
      isIncreased: incomeDifference > 0,
      type: "income",
    }
    const expenseDiff: MontlyDifference = {
      percentage: expensePercentageDifference,
      isIncreased: expenseDifference < 0,
      type: "expense",
    }

    setIncomeHighlight(incomeDifference !== 0 ? incomeDiff : null)
    setExpenseHighlight(expenseDifference !== 0 ? expenseDiff : null)
  }, [transactions, baseCurrency, selectedDate])

  return {
    incomeDiff,
    expenseDiff,
  }
}

function getPreviousMonth(dateString: string): string {
  const [month, year] = dateString.split("_")
  const date = new Date(Number(year), Number(month) - 1)
  return `${date.getMonth()}_${date.getFullYear()}`
}
