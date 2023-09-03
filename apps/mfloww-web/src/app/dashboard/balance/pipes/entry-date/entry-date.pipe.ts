import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { convertEntryDate } from '../../../../shared/entry-date-converter';

export const translateEntryDate$ = (
  value: string,
  translateService?: TranslateService
) => {
  translateService ??= inject(TranslateService);
  const [, year] = value.split('_');
  return translateService.get(convertEntryDate(value), { year });
};

export const translateEntryDate = (
  value: string,
  translateService?: TranslateService
) => {
  translateService ??= inject(TranslateService);
  const [, year] = value.split('_');
  return translateService.instant(convertEntryDate(value), { year });
};

@Pipe({
  name: 'entryDate',
  pure: false,
  standalone: true,
})
export class EntryDatePipe implements PipeTransform {
  private translateService = inject(TranslateService);

  transform(value: string): Observable<string> {
    return translateEntryDate$(value, this.translateService);
  }
}
