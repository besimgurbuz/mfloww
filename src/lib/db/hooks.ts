import { useCallback, useEffect, useState } from "react"

import {
  createStore,
  createTransaction,
  DBConnection,
  DBConnectionResult,
  DBTransaction,
  openDB,
} from "@/lib/db"

export function useCreateAndInitDB(version: number = 1) {
  const [inProgress, setInProgress] = useState<boolean>()
  const [connection, setConnection] = useState<DBConnection>()
  const [transaction, setTransaction] = useState<DBTransaction>()

  const connectAndCreateDB = useCallback(async () => {
    setInProgress(true)
    const connection = await openDB(version)
    setConnection(connection)

    if (connection.result === DBConnectionResult.CONNECTED) {
      createStore(
        connection,
        "entry",
        ["userId"],
        [
          {
            name: "data",
            keyPath: "data",
            options: {
              unique: false,
            },
          },
        ]
      )

      const transaction = await createTransaction(
        connection,
        ["entry"],
        "readwrite"
      )
      setTransaction(transaction)
      setInProgress(false)
    }
  }, [])

  useEffect(() => {
    connectAndCreateDB()

    return () => {
      connection?.db?.close()
    }
  }, [])

  return {
    connection,
    transaction,
    inProgress,
  }
}
