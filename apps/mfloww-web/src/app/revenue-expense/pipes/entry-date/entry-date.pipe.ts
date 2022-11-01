import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'entryDate',
})
export class EntryDatePipe implements PipeTransform {
  private readonly monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  transform(value: string): string {
    const [month, year] = value.split('_');

    return `${this.monthNames[+month]} ${year}`;
  }
}
