import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"

import {
  createStore,
  createTransaction,
  DBConnection,
  DBConnectionResult,
  openDB,
} from "@/lib/db"
import { Entry } from "@/lib/entry"

import EntryStatistics from "../entry/statistics"
import { DBContext } from "./context"
import { decryptObject, encrypt } from "./crypto-utils"

export function useCreateAndInitLocalDB(version: number = 1) {
  const [inProgress, setInProgress] = useState<boolean>()
  const [connection, setConnection] = useState<DBConnection>()

  const connectAndCreateDB = useCallback(async () => {
    setInProgress(true)
    const connection = await openDB(version, (conn) =>
      createStore(
        conn,
        "entry",
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
    )
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
  const [allEntries, setAllEntries] = useState<Entry[]>([])
  const [incomes, setIncomes] = useState<Entry[]>([])
  const [expenses, setExpenses] = useState<Entry[]>([])

  const getAllEntriesCb = useCallback(async () => {
    if (!connection?.db || connection.result !== DBConnectionResult.CONNECTED) {
      return
    }

    const transaction = createTransaction(connection, "entry", "readonly")

    if (data?.user) {
      const index = transaction.objectStore("entry").index("userId")
      const request = index.getAll(data.user.id)

      request.onsuccess = () => {
        const allEntries: Entry[] = []
        const incomes: Entry[] = []
        const expenses: Entry[] = []

        for (const item of request.result) {
          const entry = decryptObject<Entry>(data.user.key, item.data)

          if (entry.type === "income") {
            incomes.push(entry)
          } else {
            expenses.push(entry)
          }

          allEntries.push(entry)
        }

        setAllEntries(allEntries)
        setIncomes(incomes)
        setExpenses(expenses)
      }
    }
  }, [data?.user, connection])

  useEffect(() => {
    getAllEntriesCb()
  }, [getAllEntriesCb, tickCount])

  return { allEntries, incomes, expenses }
}

export function useEntriesStatistics() {
  const { allEntries } = useEntries()
  const entryStatistics = useMemo(
    () => new EntryStatistics(allEntries),
    [allEntries]
  )

  useEffect(() => {
    entryStatistics.setEntries(allEntries)
  }, [allEntries, entryStatistics])

  return entryStatistics
}

export function useCreateEntryQuery() {
  const { data } = useSession()
  const { connection, tick } = useContext(DBContext)
  const [completed, setCompleted] = useState<boolean>()
  const [error, setError] = useState<ErrorEvent>()

  return {
    createEntry: async (entry: Omit<Entry, "id">) => {
      if (
        !connection?.db ||
        connection.result !== DBConnectionResult.CONNECTED
      ) {
        return
      }

      const transaction = createTransaction(connection, "entry", "readwrite")

      if (data?.user) {
        const objectStore = transaction.objectStore("entry")
        const entryId = window.crypto.randomUUID()
        const encryptedEntry = {
          id: entryId,
          userId: data.user.id,
          data: encrypt(
            data.user.key,
            JSON.stringify({ ...entry, id: entryId })
          ),
        }
        const request = objectStore.add(encryptedEntry)

        request.onsuccess = () => {
          setCompleted(true)
          tick()
        }

        request.onerror = (event) => {
          setError(event as ErrorEvent)
        }
      }
    },
    completed,
    error,
  }
}

export function useDeleteEntryQuery() {
  const { data } = useSession()
  const { connection, tick } = useContext(DBContext)
  const [completed, setCompleted] = useState<boolean>()
  const [error, setError] = useState<ErrorEvent>()

  return {
    deleteEntry: async (id: string) => {
      if (
        !connection?.db ||
        connection.result !== DBConnectionResult.CONNECTED
      ) {
        return
      }

      const transaction = createTransaction(connection, "entry", "readwrite")

      if (data?.user) {
        const objectStore = transaction.objectStore("entry")
        const request = objectStore.delete(id)

        request.onsuccess = () => {
          setCompleted(true)
          tick()
        }

        request.onerror = (event) => {
          setError(event as ErrorEvent)
        }
      }
    },
    completed,
    error,
  }
}
