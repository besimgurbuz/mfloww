import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim',
})
export class TrimPipe implements PipeTransform {
  transform(value: string, maxLength?: number, showDot = true): string {
    if (maxLength) {
      return `${value.slice(0, maxLength)}${showDot ? '...' : ''}`;
    }
    return value;
  }
}
