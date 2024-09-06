import { useCallback, useContext, useEffect, useState } from "react"

import {
  createStore,
  createTransaction,
  DBConnection,
  DBConnectionResult,
  DBObjectStores,
  dbRequestPromise,
  openDB,
} from "@/lib/local-db"
import { EncryptedTransaction, Transaction } from "@/lib/transaction"
import { useUser } from "@/app/user-context"

import { DBContext } from "./context"
import { decryptObject, encrypt } from "./crypto-utils"

export function useCreateAndInitLocalDB(version: number = 1) {
  const [inProgress, setInProgress] = useState<boolean>()
  const [connection, setConnection] = useState<DBConnection>()

  const connectAndCreateDB = useCallback(async () => {
    setInProgress(true)
    const connection = await openDB(version, (conn) => {
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

export function useEncryptedTransactions() {
  const { user } = useUser()
  const { connection, tickCount } = useContext(DBContext)
  const [transactions, setTransactions] = useState<EncryptedTransaction[]>([])

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
      const allTransactions: EncryptedTransaction[] = []
      for (const item of request.result) {
        allTransactions.push(item)
      }
      setTransactions(allTransactions)
    }
  }, [user, connection])

  useEffect(() => {
    getAllTransactionsCallback()
  }, [getAllTransactionsCallback, tickCount])

  return { transactions }
}

export function useImportEncryptedTransactions() {
  const { user } = useUser()
  const { connection, tick } = useContext(DBContext)
  const [completed, setCompleted] = useState<boolean>()
  const [error, setError] = useState<ErrorEvent>()

  return {
    importTransactions: async (
      transactions: EncryptedTransaction[],
      mode: "merge" | "replace",
      conflictResolution: "local" | "remote"
    ) => {
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

      for (const transaction of transactions) {
        if (mode === "merge") {
          const request = dbTransaction
            .objectStore(DBObjectStores.Transaction)
            .get(transaction.id)
          const result = await dbRequestPromise(request)

          if (result && conflictResolution === "local") {
            continue
          }
        }
        const addRequest = dbTransaction
          .objectStore(DBObjectStores.Transaction)
          .add(transaction)
        await dbRequestPromise(addRequest)
      }

      dbTransaction.oncomplete = () => {
        setCompleted(true)
        tick()
      }
      dbTransaction.onerror = (event) => {
        setError(event as ErrorEvent)
      }
    },
    completed,
    error,
  }
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
          regularTransactions[transaction.id] = transaction
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

export function useCreateTransactionQuery() {
  const { user } = useUser()
  const { connection, tick } = useContext(DBContext)
  const [completed, setCompleted] = useState<boolean>()
  const [error, setError] = useState<ErrorEvent>()

  return {
    createTransaction: (transaction: Omit<Transaction, "id">) => {
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
      const encryptedTransaction: EncryptedTransaction = {
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
      const encryptedTransaction: EncryptedTransaction = {
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

export function useDeleteAllTransactionsQuery() {
  const { user } = useUser()
  const { connection, tick } = useContext(DBContext)
  const [completed, setCompleted] = useState<boolean>()
  const [error, setError] = useState<ErrorEvent>()

  return {
    deleteAllTransactions: async () => {
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
      const request = objectStore.clear()

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
