import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"

import {
  createStore,
  createTransaction,
  DBConnection,
  DBConnectionResult,
  DBObjectStores,
  openDB,
} from "@/lib/db"
import { Transaction } from "@/lib/transaction"

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
  const { data } = useSession()
  const { connection, tickCount } = useContext(DBContext)
  const [entries, setEntries] = useState<Entry[]>([])

  const getAllEntriesCallback = useCallback(async () => {
    if (
      !connection?.db ||
      connection.result !== DBConnectionResult.CONNECTED ||
      !data?.user
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
    const request = index.getAll(data.user.id)

    request.onsuccess = () => {
      setEntries(request.result)
    }
  }, [data?.user, connection])

  useEffect(() => {
    getAllEntriesCallback()
  }, [getAllEntriesCallback, tickCount])

  return entries
}

export function useTransactions() {
  const { data } = useSession()
  const { connection, tickCount } = useContext(DBContext)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [incomes, setIncomes] = useState<Transaction[]>([])
  const [expenses, setExpenses] = useState<Transaction[]>([])

  const getAllTransactionsCallback = useCallback(async () => {
    if (
      !connection?.db ||
      connection.result !== DBConnectionResult.CONNECTED ||
      !data?.user
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
    const request = index.getAll(data.user.id)

    request.onsuccess = () => {
      const allTransactions: Transaction[] = []
      const incomes: Transaction[] = []
      const expenses: Transaction[] = []

      for (const item of request.result) {
        const transaction = decryptObject<Transaction>(data.user.key, item.data)

        if (transaction.type === "income") {
          incomes.push(transaction)
        } else {
          expenses.push(transaction)
        }

        allTransactions.push(transaction)
      }

      setTransactions(allTransactions)
      setIncomes(incomes)
      setExpenses(expenses)
    }
  }, [data?.user, connection])

  useEffect(() => {
    getAllTransactionsCallback()
  }, [getAllTransactionsCallback, tickCount])

  return { transactions, incomes, expenses }
}

export function useTransactionStatistics() {
  const { transactions } = useTransactions()
  const transactionStatistics = useMemo(
    () => new TransactionStatistics(transactions),
    [transactions]
  )

  useEffect(() => {
    transactionStatistics.setTransactions(transactions)
  }, [transactions, transactionStatistics])

  return transactionStatistics
}

export function useCreateEntryQuery() {
  const { data } = useSession()
  const { connection, tick } = useContext(DBContext)
  const [completed, setCompleted] = useState<boolean>()
  const [error, setError] = useState<ErrorEvent>()

  return {
    createEntry: async (entry: Omit<Entry, "userId">) => {
      if (
        !connection?.db ||
        connection.result !== DBConnectionResult.CONNECTED ||
        !data?.user
      ) {
        return
      }

      const dbTransaction = createTransaction(
        connection,
        DBObjectStores.Entry,
        "readwrite"
      )
      const objectStore = dbTransaction.objectStore(DBObjectStores.Entry)
      const request = objectStore.add({
        ...entry,
        userId: data.user.id,
      })

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

export function useCreateTransactionQuery() {
  const { data } = useSession()
  const { connection, tick } = useContext(DBContext)
  const [completed, setCompleted] = useState<boolean>()
  const [error, setError] = useState<ErrorEvent>()

  return {
    createTransaction: async (transaction: Omit<Transaction, "id">) => {
      if (
        !connection?.db ||
        connection.result !== DBConnectionResult.CONNECTED ||
        !data?.user
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
        userId: data.user.id,
        data: encrypt(
          data.user.key,
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
  const { data } = useSession()
  const { connection, tick } = useContext(DBContext)
  const [completed, setCompleted] = useState<boolean>()
  const [error, setError] = useState<ErrorEvent>()

  return {
    updateTransaction: async (transaction: Transaction) => {
      if (
        !connection?.db ||
        connection.result !== DBConnectionResult.CONNECTED ||
        !data?.user
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
        userId: data.user.id,
        data: encrypt(data.user.key, JSON.stringify(transaction)),
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
  const { data } = useSession()
  const { connection, tick } = useContext(DBContext)
  const [completed, setCompleted] = useState<boolean>()
  const [error, setError] = useState<ErrorEvent>()

  return {
    deleteTransaction: async (id: string) => {
      if (
        !connection?.db ||
        connection.result !== DBConnectionResult.CONNECTED ||
        !data?.user
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
