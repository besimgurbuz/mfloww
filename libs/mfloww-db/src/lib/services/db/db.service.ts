import { inject, Injectable } from '@angular/core';
import { filter, map, mergeMap, Observable } from 'rxjs';
import { CryptoService } from '../crypto/crypto.service';
import { MflowwDbInitializerService } from '../db-initializer/db-initializer.service';

@Injectable({
  providedIn: 'root',
})
export class MflowwDbService extends MflowwDbInitializerService {
  private readonly cryptoService = inject(CryptoService);

  get<T = unknown>(storeName: string, query: string | number) {
    return this.store$(storeName).pipe(
      mergeMap((objectStore) =>
        this.createStoreRequest$<Record<string, unknown> | undefined>(
          objectStore,
          (store) => store.get(query)
        )
      ),
      map((result) => {
        if (result && result['data']) {
          return this.cryptoService.decryptObject<T>(result['data'] as string);
        }
        return result as T;
      })
    );
  }

  getAll<T = unknown>(storeName: string) {
    return this.store$(storeName).pipe(
      mergeMap((objectStore) =>
        this.createStoreRequest$<Record<string, unknown>[] | undefined>(
          objectStore,
          (store) => store.getAll()
        )
      ),
      map((result) => {
        if (result && result[0]['data']) {
          return result.map((resultElement) =>
            this.cryptoService.decryptObject<T>(resultElement['data'] as string)
          );
        }
        return result as T[];
      })
    );
  }

  insert<T = unknown, R = string>(storeName: string, value: T) {
    return this.store$(storeName).pipe(
      mergeMap((objectStore) => {
        const encrypted = this.cryptoService.encrypt(JSON.stringify(value));
        if (objectStore.keyPath) {
          const keyPath = objectStore.keyPath as string;
          const keyValue = (value as Record<string, string>)[keyPath];
          return this.createStoreRequest$<R>(objectStore, (store) =>
            store.add({ [keyPath]: keyValue, data: encrypted })
          );
        }
        return this.createStoreRequest$<R>(objectStore, (store) =>
          store.add(encrypted)
        );
      })
    );
  }

  update<T = unknown, R = string>(storeName: string, value: T, index?: number) {
    return this.store$(storeName).pipe(
      mergeMap((objectStore) => {
        const encrypted = this.cryptoService.encrypt(JSON.stringify(value));
        if (objectStore.keyPath) {
          const keyPath = objectStore.keyPath as string;
          const keyValue = (value as Record<string, string>)[keyPath];
          return this.createStoreRequest$<R>(objectStore, (store) =>
            store.put({ [keyPath]: keyValue, data: encrypted })
          );
        }
        return this.createStoreRequest$<R>(objectStore, (store) =>
          store.put(encrypted, index)
        );
      })
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
