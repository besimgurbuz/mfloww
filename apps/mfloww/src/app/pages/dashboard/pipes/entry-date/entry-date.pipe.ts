import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { convertEntryDate } from '../../../../helpers/entry-date-converter';

export const translateEntryDate$ = (
  value: string,
  translateService?: TranslocoService
) => {
  translateService ??= inject(TranslocoService);
  const [, year] = value.split('_');
  return translateService.selectTranslate<string>(convertEntryDate(value), {
    year,
  });
};

export const translateEntryDate = (
  value: string,
  translateService?: TranslocoService
) => {
  translateService ??= inject(TranslocoService);
  const [, year] = value.split('_');
  return translateService.translate(convertEntryDate(value), { year });
};

@Pipe({
  name: 'entryDate',
  pure: false,
  standalone: true,
})
export class EntryDatePipe implements PipeTransform {
  private translateService = inject(TranslocoService);

  transform(value: string): Observable<string> {
    return translateEntryDate$(value, this.translateService);
  }
}
