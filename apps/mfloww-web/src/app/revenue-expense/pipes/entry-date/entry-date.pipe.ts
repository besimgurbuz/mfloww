import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { convertEntryDate } from '../../../shared/entry-date-converter';

@Pipe({
  name: 'entryDate',
})
export class EntryDatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: string): Observable<string> {
    const [, year] = value.split('_');
    return this.translateService.get(convertEntryDate(value), { year: year });
  }
}
