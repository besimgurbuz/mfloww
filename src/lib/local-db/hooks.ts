import { useCallback, useContext, useEffect, useMemo, useState } from "react"

import {
  createStore,
  createTransaction,
  DBConnection,
  DBConnectionResult,
  DBObjectStores,
  openDB,
} from "@/lib/local-db"
import { Transaction } from "@/lib/transaction"
import { DashboardStateContext } from "@/app/dashboard/dashboard-context"
import { useUser } from "@/app/user-context"

import { Entry } from "../definitions"
import TransactionStatistics from "../transaction/statistics"
import { DBContext } from "./context"
import { decryptObject, encrypt } from "./crypto-utils"

export function useCreateAndInitLocalDB(version: number = 1) {
  const [inProgress, setInProgress] = useState<boolean>()
  const [connection, setConnection] = useState<DBConnection>()

  const connectAndCreateDB = useCallback(async () => {
    setInProgress(true)
    const connection = await openDB(version, (conn) => {
      createStore(conn, DBObjectStores.Entry, { keyPath: "name" }, [
        { name: "userId", keyPath: "userId", options: {} },
      ])
      createStore(
        conn,
        DBObjectStores.Transaction,
        {
          keyPath: "id",
        },
        [
          {
            name: "userId",
            keyPath: "userId",
            options: {},
          },
        ]
      )
    })
    setConnection(connection)
  }, [version])

  useEffect(() => {
    connectAndCreateDB()
  }, [connectAndCreateDB])

  return {
    connection,
    inProgress,
  }
}

export function useEntries() {
  const { user } = useUser()
  const { connection, tickCount } = useContext(DBContext)
  const [entries, setEntries] = useState<Entry[]>([])

  const getAllEntriesCallback = useCallback(async () => {
    if (
      !connection?.db ||
      connection.result !== DBConnectionResult.CONNECTED ||
      !user
    ) {
      return
    }

    const dbTransaction = createTransaction(
      connection,
      DBObjectStores.Entry,
      "readonly"
    )
    const index = dbTransaction
      .objectStore(DBObjectStores.Entry)
      .index("userId")
    const request = index.getAll(user.id)

    request.onsuccess = () => {
      setEntries(request.result)
    }
  }, [user, connection])

  useEffect(() => {
    getAllEntriesCallback()
  }, [getAllEntriesCallback, tickCount])

  return entries
}

export function useTransactions() {
  const { user } = useUser()
  const { connection, tickCount } = useContext(DBContext)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [regularTransactions, setRegularTransactions] = useState<Transaction[]>(
    []
  )
  const [incomes, setIncomes] = useState<Transaction[]>([])
  const [expenses, setExpenses] = useState<Transaction[]>([])

  const getAllTransactionsCallback = useCallback(async () => {
    if (
      !connection?.db ||
      connection.result !== DBConnectionResult.CONNECTED ||
      !user
    ) {
      return
    }

    const dbTransaction = createTransaction(
      connection,
      DBObjectStores.Transaction,
      "readonly"
    )
    const index = dbTransaction
      .objectStore(DBObjectStores.Transaction)
      .index("userId")
    const request = index.getAll(user.id)

    request.onsuccess = () => {
      const allTransactions: Transaction[] = []
      const regularTransactions: Record<string, Transaction> = {}
      const incomes: Transaction[] = []
      const expenses: Transaction[] = []

      for (const item of request.result) {
        const transaction = decryptObject<Transaction>(user.key, item.data)

        if (transaction.isRegular && !regularTransactions[transaction.name]) {
          regularTransactions[transaction.name] = transaction
        } else if (transaction.type === "income") {
          incomes.push(transaction)
        } else {
          expenses.push(transaction)
        }

        allTransactions.push(transaction)
      }

      setTransactions(allTransactions)
      setRegularTransactions(Object.values(regularTransactions))
      setIncomes(incomes)
      setExpenses(expenses)
    }
  }, [user, connection])

  useEffect(() => {
    getAllTransactionsCallback()
  }, [getAllTransactionsCallback, tickCount])

  return { transactions, regularTransactions, incomes, expenses }
}

export function useTransactionStatistics() {
  const { entryTransactions } = useContext(DashboardStateContext)
  const transactionStatistics = useMemo(
    () => new TransactionStatistics(entryTransactions),
    [entryTransactions]
  )

  useEffect(() => {
    transactionStatistics.setTransactions(entryTransactions)
  }, [entryTransactions, transactionStatistics])

  return transactionStatistics
}

export function useCreateEntryQuery() {
  const { user } = useUser()
  const { connection, tick } = useContext(DBContext)
  const [completed, setCompleted] = useState<boolean>()
  const [error, setError] = useState<ErrorEvent>()
  const { regularTransactions } = useTransactions()

  return {
    createEntry: async (entry: Omit<Entry, "userId">) => {
      if (
        !connection?.db ||
        connection.result !== DBConnectionResult.CONNECTED ||
        !user
      ) {
        return
      }

      const dbTransaction = createTransaction(
        connection,
        [DBObjectStores.Entry, DBObjectStores.Transaction],
        "readwrite"
      )
      const entryStore = dbTransaction.objectStore(DBObjectStores.Entry)
      const transactionStore = dbTransaction.objectStore(
        DBObjectStores.Transaction
      )
      const regularTransactionRequests = regularTransactions.map(
        (transaction) => {
          const transactionId = window.crypto.randomUUID()
          const encryptedTransaction = {
            id: transactionId,
            userId: user.id,
            data: encrypt(
              user.key,
              JSON.stringify({
                ...transaction,
                id: transactionId,
                date: entry.date,
              })
            ),
          }
          return new Promise<void>((resolve, reject) => {
            const request = transactionStore.add(encryptedTransaction)
            request.onsuccess = () => {
              resolve()
            }
            request.onerror = (event) => {
              reject(event as ErrorEvent)
            }
          })
        }
      )

      try {
        await new Promise<void>((resolve, reject) => {
          const request = entryStore.add({
            ...entry,
            userId: user.id,
          })
          request.onsuccess = () => {
            resolve()
          }

          request.onerror = (event) => {
            reject(event as ErrorEvent)
          }
        })
        await Promise.all(regularTransactionRequests)
        setCompleted(true)
        tick()
      } catch (error) {
        setError(error as ErrorEvent)
      }
    },
    completed,
    error,
  }
}

export function useCreateRegularTransactionQuery() {
  const { user } = useUser()
  const { connection, tick } = useContext(DBContext)
  const [completed, setCompleted] = useState<boolean>()
  const [error, setError] = useState<ErrorEvent>()
  const entries = useEntries()

  return {
    createRegularTransaction: async (transaction: Omit<Transaction, "id">) => {
      if (
        !connection?.db ||
        connection.result !== DBConnectionResult.CONNECTED ||
        !user
      ) {
        return
      }

      const payload = entries.map((entry) => ({
        ...transaction,
        date: entry.date,
      }))
      const dbTransaction = createTransaction(
        connection,
        DBObjectStores.Transaction,
        "readwrite"
      )
      const objectStore = dbTransaction.objectStore(DBObjectStores.Transaction)
      const requests = payload.map((transaction) => {
        return new Promise<void>((resolve, reject) => {
          const transactionId = window.crypto.randomUUID()
          const encryptedTransaction = {
            id: transactionId,
            userId: user.id,
            data: encrypt(
              user.key,
              JSON.stringify({ ...transaction, id: transactionId })
            ),
          }
          const request = objectStore.add(encryptedTransaction)
          request.onsuccess = () => {
            resolve()
          }
          request.onerror = (event) => {
            reject(event as ErrorEvent)
          }
        })
      })
      try {
        await Promise.all(requests)
        setCompleted(true)
        tick()
      } catch (error) {
        setError(error as ErrorEvent)
      }
    },
    completed,
    error,
  }
}

export function useCreateTransactionQuery() {
  const { user } = useUser()
  const { connection, tick } = useContext(DBContext)
  const [completed, setCompleted] = useState<boolean>()
  const [error, setError] = useState<ErrorEvent>()

  return {
    createTransaction: async (transaction: Omit<Transaction, "id">) => {
      if (
        !connection?.db ||
        connection.result !== DBConnectionResult.CONNECTED ||
        !user
      ) {
        return
      }

      const dbTransaction = createTransaction(
        connection,
        DBObjectStores.Transaction,
        "readwrite"
      )
      const objectStore = dbTransaction.objectStore(DBObjectStores.Transaction)
      const transactionId = window.crypto.randomUUID()
      const encryptedTransaction = {
        id: transactionId,
        userId: user.id,
        data: encrypt(
          user.key,
          JSON.stringify({ ...transaction, id: transactionId })
        ),
      }
      const request = objectStore.add(encryptedTransaction)

      request.onsuccess = () => {
        setCompleted(true)
        tick()
      }
      request.onerror = (event) => {
        setError(event as ErrorEvent)
      }
    },
    completed,
    error,
  }
}

export function useUpdateTransactionQuery() {
  const { user } = useUser()
  const { connection, tick } = useContext(DBContext)
  const [completed, setCompleted] = useState<boolean>()
  const [error, setError] = useState<ErrorEvent>()

  return {
    updateTransaction: async (transaction: Transaction) => {
      if (
        !connection?.db ||
        connection.result !== DBConnectionResult.CONNECTED ||
        !user
      ) {
        return
      }

      const dbTransaction = createTransaction(
        connection,
        DBObjectStores.Transaction,
        "readwrite"
      )
      const objectStore = dbTransaction.objectStore(DBObjectStores.Transaction)
      const encryptedTransaction = {
        id: transaction.id,
        userId: user.id,
        data: encrypt(user.key, JSON.stringify(transaction)),
      }
      const request = objectStore.put(encryptedTransaction)

      request.onsuccess = () => {
        setCompleted(true)
        tick()
      }

      request.onerror = (event) => {
        setError(event as ErrorEvent)
      }
    },
    completed,
    error,
  }
}

export function useDeleteTransactionQuery() {
  const { user } = useUser()
  const { connection, tick } = useContext(DBContext)
  const [completed, setCompleted] = useState<boolean>()
  const [error, setError] = useState<ErrorEvent>()

  return {
    deleteTransaction: async (id: string) => {
      if (
        !connection?.db ||
        connection.result !== DBConnectionResult.CONNECTED ||
        !user
      ) {
        return
      }

      const dbTransaction = createTransaction(
        connection,
        DBObjectStores.Transaction,
        "readwrite"
      )
      const objectStore = dbTransaction.objectStore(DBObjectStores.Transaction)
      const request = objectStore.delete(id)

      request.onsuccess = () => {
        setCompleted(true)
        tick()
      }

      request.onerror = (event) => {
        setError(event as ErrorEvent)
      }
    },
    completed,
    error,
  }
}
