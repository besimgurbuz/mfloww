export enum DBConnectionResult {
  CONNECTED,
  CONNECTION_ERROR,
  NOT_SUPPORTED,
}

export interface DBConnection {
  result: DBConnectionResult
  error: Error | null
  db: IDBDatabase | null
}

export interface DBTransaction {
  transaction: IDBTransaction | null
  error: Error | null
}

export interface StoreIndex {
  name: string
  keyPath: string | Iterable<string>
  options: IDBIndexParameters
}

export async function openDB(version: number = 1): Promise<DBConnection> {
  if (!window.indexedDB) {
    return {
      result: DBConnectionResult.NOT_SUPPORTED,
      db: null,
      error: null,
    }
  }

  return new Promise<DBConnection>(async (resolve, reject) => {
    const openRequest = window.indexedDB.open("MFLOWW_DB", version)

    openRequest.onerror = (errorEvent) => {
      resolve({
        result: DBConnectionResult.CONNECTION_ERROR,
        error: (errorEvent as ErrorEvent).error,
        db: null,
      })
    }

    openRequest.onsuccess = (event) => {
      resolve({
        db: openRequest.result,
        result: DBConnectionResult.CONNECTED,
        error: null,
      })
    }
  })
}

export function createStore(
  { db }: DBConnection,
  storeName: string,
  keyPath: string | string[],
  storeIndexes: StoreIndex[]
) {
  if (!db) {
    throw new Error("Cannot create store without connection")
  }

  const store = db.createObjectStore(storeName, {
    keyPath,
  })

  for (let storeIndex of storeIndexes) {
    store.createIndex(storeIndex.name, storeIndex.keyPath, storeIndex.options)
  }

  return store
}

export async function createTransaction(
  { db }: DBConnection,
  storeNames: string | Iterable<string>,
  mode: IDBTransactionMode
): Promise<DBTransaction> {
  if (!db) {
    throw new Error("Cannot create transaction without connection")
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeNames, mode)

    transaction.onerror = (event) => {
      resolve({
        error: (event as ErrorEvent).error,
        transaction: null,
      })
    }

    transaction.oncomplete = () => {
      resolve({
        transaction,
        error: null,
      })
    }
  })
}
