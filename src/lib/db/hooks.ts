import { useCallback, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import {
  createStore,
  createTransaction,
  DBConnection,
  DBConnectionResult,
  openDB,
} from "@/lib/db"

import { Entry } from "../definitions"
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
          autoIncrement: true,
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
  }, [])

  useEffect(() => {
    connectAndCreateDB()
  }, [])

  return {
    connection,
    inProgress,
  }
}

export function useAllEntries() {
  const { data } = useSession()
  const { connection, tickCount } = useContext(DBContext)
  const [entries, setEntries] = useState<Entry[]>([])

  const getAllEntriesCb = useCallback(async () => {
    if (!connection?.db || connection.result !== DBConnectionResult.CONNECTED) {
      return
    }

    const transaction = createTransaction(connection, "entry", "readonly")

    if (data?.user) {
      const index = transaction.objectStore("entry").index("userId")
      const request = index.getAll()

      request.onsuccess = () => {
        const entries = request.result.map((entryItem) =>
          decryptObject<Entry>(data.user.key, entryItem.data)
        )
        setEntries(entries)
      }
    }
  }, [data?.user, connection])

  useEffect(() => {
    getAllEntriesCb()
  }, [getAllEntriesCb, tickCount])

  return entries
}

export function useCreateEntryQuery() {
  const { data } = useSession()
  const { connection, tick } = useContext(DBContext)
  const [completed, setCompleted] = useState<boolean>()
  const [error, setError] = useState<ErrorEvent>()

  return {
    createEntry: async (entry: Entry) => {
      if (
        !connection?.db ||
        connection.result !== DBConnectionResult.CONNECTED
      ) {
        return
      }

      const transaction = createTransaction(connection, "entry", "readwrite")

      if (data?.user) {
        const objectStore = transaction.objectStore("entry")

        const request = objectStore.add({
          userId: data.user.id,
          data: encrypt(data.user.key, JSON.stringify(entry)),
        })

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
