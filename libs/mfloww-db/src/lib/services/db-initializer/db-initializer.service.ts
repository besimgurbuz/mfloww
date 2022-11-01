import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

enum DbState {
  NOT_SUPPORTED,
  HAS_ERROR,
  CONNECTED,
}

interface DbConnectionResult {
  state: DbState;
  error?: Error | DOMException | null;
  db?: IDBDatabase;
}

interface ObjectStoreInstruction {
  key: string;
  name: string;
}

@Injectable()
export class MflowwDbInitializerService {
  private connectionSubject: ReplaySubject<DbConnectionResult> =
    new ReplaySubject<DbConnectionResult>(1);
  private _dbRequest!: IDBOpenDBRequest;

  // callbacks
  private readonly _onConnectionErr = (event: Event) => {
    console.error(
      `MflowwDb(InitializerService): ConnectionError ${
        (event.target as any).errorCode
      }`
    );
    this.connectionSubject.next({
      state: DbState.HAS_ERROR,
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
    console.log(`MflowwDb(InitializerService): transaction completed`);
  };
  private readonly _onUpgradeNeeded =
    (objectStores?: ObjectStoreInstruction[]) => (event: Event) => {
      objectStores?.forEach(({ key, name }) => {
        const objectStore = (
          (event.target as any).result as IDBDatabase
        ).createObjectStore(name, {
          keyPath: key,
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
      this.connectionSubject.next({ state: DbState.NOT_SUPPORTED });
      this.connectionSubject.complete();
    } else {
      this._dbRequest = window.indexedDB.open(dataBaseName, version);
      this._dbRequest.onerror = this._onConnectionErr;
      this._dbRequest.onsuccess = this._onConnectionSuccess;
      this._dbRequest.onupgradeneeded = this._onUpgradeNeeded(objectStores);
    }

    return this.connectionSubject.asObservable();
  }
}
