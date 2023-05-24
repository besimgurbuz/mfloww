import { Pipe, PipeTransform } from '@angular/core';
import { convertEntryDate } from '../../../shared/entry-date-converter';

@Pipe({
  name: 'entryDate',
})
export class EntryDatePipe implements PipeTransform {
  transform(value: string): string {
    return convertEntryDate(value);
  }
}
