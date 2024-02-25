export enum DBConnectionResult {
  CONNECTED,
  CONNECTION_ERROR,
  NOT_SUPPORTED,
}

export enum DBObjectStores {
  Entry = "Entry",
  Transaction = "transaction",
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

type OpenDBUpgradeFn = (connection: DBConnection) => void

export async function openDB(
  version: number = 1,
  upgradeFn?: OpenDBUpgradeFn
): Promise<DBConnection> {
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
    openRequest.onupgradeneeded = () => {
      upgradeFn?.({
        db: openRequest.result,
        error: null,
        result: DBConnectionResult.CONNECTED,
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
  options: IDBObjectStoreParameters = {},
  storeIndexes: StoreIndex[] = []
) {
  if (!db) {
    throw new Error("Cannot create store without connection")
  }

  const store = db.createObjectStore(storeName, options)

  for (let storeIndex of storeIndexes) {
    store.createIndex(storeIndex.name, storeIndex.keyPath, storeIndex.options)
  }

  return store
}

export function createTransaction(
  { db }: DBConnection,
  storeNames: string | Iterable<string>,
  mode: IDBTransactionMode
): IDBTransaction {
  if (!db) {
    throw new Error("Cannot create transaction without connection")
  }

  const transaction = db.transaction(storeNames, mode)

  transaction.onerror = (event) => {
    console.error(event as ErrorEvent)
  }

  return transaction
}
