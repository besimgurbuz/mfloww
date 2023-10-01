import { provideFileRouter } from '@analogjs/router';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';

import { provideTransloco } from '@ngneat/transloco';
import { environment } from '../environments/environment';
import { provideTrpcClient } from '../trpc-client';
import { TranslocoHttpLoader } from './core/transloco-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(),
    provideClientHydration(),
    provideHttpClient(),
    provideTrpcClient(),
    provideTransloco({
      config: {
        availableLangs: [
          'de',
          'en',
          'es',
          'fr',
          'kr',
          'ru',
          'tr',
          'uk',
          'zh-cn',
        ],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: environment.production,
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
