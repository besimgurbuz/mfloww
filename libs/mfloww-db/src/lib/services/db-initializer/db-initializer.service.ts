import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject } from 'rxjs';

enum DbState {
  NOT_SUPPORTED = 'NOT_SUPPORTED',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  CONNECTED = 'CONNECTED',
}

interface DbConnectionResult {
  state: DbState;
  error?: Error | DOMException | null;
  db?: IDBDatabase;
}

interface ObjectStoreInstruction {
  key?: string;
  name: string;
  uniquenessType: 'keyPath' | 'autoIncrement';
}

@Injectable()
export class MflowwDbInitializerService {
  private connectionSubject: ReplaySubject<DbConnectionResult> =
    new ReplaySubject<DbConnectionResult>(1);
  protected _dbRequest!: IDBOpenDBRequest;

  // callbacks
  private readonly _onConnectionErr = () => {
    console.error(
      `MflowwDb(InitializerService): ${this._dbRequest.error?.message}`
    );
    this.connectionSubject.error({
      state: DbState.CONNECTION_ERROR,
      error: this._dbRequest.error,
    });
  };
  private readonly _onConnectionSuccess = () => {
    console.log('MflowwDb(InitializerService): completed initialization of db');
    this.connectionSubject.next({
      state: DbState.CONNECTED,
      db: this._dbRequest.result,
    });
  };
  private readonly _onTransactionComplete = () => {
    console.log('MflowwDb(InitializerService): transaction completed');
  };
  private readonly _onUpgradeNeeded =
    (objectStores?: ObjectStoreInstruction[]) => () => {
      objectStores?.forEach(({ key, name, uniquenessType }) => {
        const objectStore = this._dbRequest.result.createObjectStore(name, {
          [uniquenessType]: key || true,
        });
        objectStore.transaction.oncomplete = this._onTransactionComplete;
      });
    };

  openDb(
    dataBaseName: string,
    objectStores?: ObjectStoreInstruction[],
    version = 1
  ): Observable<DbConnectionResult> {
    if (!window.indexedDB) {
      this.connectionSubject.error({ state: DbState.NOT_SUPPORTED });
      this.connectionSubject.complete();
    } else {
      this._dbRequest = window.indexedDB.open(dataBaseName, version);
      this._dbRequest.onerror = this._onConnectionErr;
      this._dbRequest.onsuccess = this._onConnectionSuccess;
      this._dbRequest.onupgradeneeded = this._onUpgradeNeeded(objectStores);
    }

    return this.connectionSubject.asObservable();
  }

  get db$(): Observable<IDBDatabase | null> {
    return this.connectionSubject.pipe(map(({ db }) => db || null));
  }

  get transaction$(): Observable<IDBTransaction | null> {
    return this.db$.pipe(
      map((db) => {
        const storeNames = db?.objectStoreNames
          ? Array.from(db.objectStoreNames)
          : [];
        return db?.transaction(storeNames, 'readwrite') || null;
      })
    );
  }
}
