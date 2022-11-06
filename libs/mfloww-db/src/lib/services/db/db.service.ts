import { Injectable } from '@angular/core';
import { filter, map, mergeMap, Observable } from 'rxjs';
import { MflowwDbInitializerService } from '../db-initializer/db-initializer.service';

@Injectable({
  providedIn: 'root',
})
export class MflowwDbService extends MflowwDbInitializerService {
  get<T = unknown>(storeName: string, query: string | number) {
    return this.store$(storeName).pipe(
      mergeMap((objectStore) =>
        this.createStoreRequest$<T | undefined>(objectStore, (store) =>
          store.get(query)
        )
      )
    );
  }

  getAll<T = unknown[]>(storeName: string) {
    return this.store$(storeName).pipe(
      mergeMap((objectStore) =>
        this.createStoreRequest$<T | undefined>(objectStore, (store) =>
          store.getAll()
        )
      )
    );
  }

  insert<T = unknown, R = string>(storeName: string, value: T) {
    return this.store$(storeName).pipe(
      mergeMap((objectStore) =>
        this.createStoreRequest$<R>(objectStore, (store) => store.add(value))
      )
    );
  }

  update<T = unknown, R = string>(storeName: string, value: T) {
    return this.store$(storeName).pipe(
      mergeMap((objectStore) =>
        this.createStoreRequest$<R>(objectStore, (store) => store.put(value))
      )
    );
  }

  delete<T = unknown, R = string>(storeName: string, query: string | number) {
    return this.store$(storeName).pipe(
      mergeMap((objectStore) =>
        this.createStoreRequest$<R>(objectStore, (store) => store.delete(query))
      )
    );
  }

  clearAllStores() {
    return this.transaction$.pipe(
      mergeMap(
        (transaction) =>
          new Observable<void>((subscriber) => {
            const storeNames = transaction?.objectStoreNames
              ? Array.from(transaction.objectStoreNames)
              : [];
            storeNames.forEach((storeName) => {
              transaction?.objectStore(storeName).clear();
            });
            subscriber.next();
            subscriber.complete();
          })
      )
    );
  }

  private store$(storeName: string): Observable<IDBObjectStore> {
    return this.transaction$.pipe(
      map((transaction) => transaction?.objectStore(storeName)),
      filter((objectStore) => objectStore !== undefined)
    ) as Observable<IDBObjectStore>;
  }

  private createStoreRequest$<T>(
    store: IDBObjectStore,
    callback: (store: IDBObjectStore) => IDBRequest
  ) {
    return new Observable<T>((subscriber) => {
      const dbRequest = callback(store);
      dbRequest.onerror = () => {
        subscriber.error(dbRequest.error);
      };
      dbRequest.onsuccess = () => {
        subscriber.next(dbRequest.result);
        subscriber.complete();
      };
    });
  }
}
