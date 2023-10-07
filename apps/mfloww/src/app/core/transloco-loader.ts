import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@ngneat/transloco';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.http.get<Translation>(
      `${
        import.meta.env['VITE_ANALOG_PUBLIC_BASE_URL']
      }/assets/i18n/${lang}.json`
    );
  }
}
