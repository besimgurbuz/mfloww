import {
  StateKey,
  TransferState,
  makeStateKey,
} from '@angular/platform-browser';
import { TranslateLoader } from '@ngx-translate/core';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Observable } from 'rxjs';

export class TranslateServerLoader implements TranslateLoader {
  private prefix = 'i18n';
  private suffix = '.json';

  constructor(private transferState: TransferState) {}

  public getTranslation(lang: string): Observable<any> {
    return new Observable((observer) => {
      const assetsFolder = join(
        process.cwd(),
        'dist',
        'apps',
        'mfloww-web',
        'browser',
        'assets',
        this.prefix
      );

      const jsonData = JSON.parse(
        readFileSync(`${assetsFolder}/${lang}${this.suffix}`, 'utf-8')
      );
      console.log('translation loaded for ', lang);
      const key: StateKey<number> = makeStateKey<number>(
        `transfer-translate-${lang}`
      );
      this.transferState.set(key, jsonData);
      console.log('translation stored');

      observer.next(jsonData);
      observer.complete();
    });
  }
}

export function translateServerLoaderFactory(transferState: TransferState) {
  return new TranslateServerLoader(transferState);
}
