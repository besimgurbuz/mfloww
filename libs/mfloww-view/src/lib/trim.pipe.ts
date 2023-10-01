import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'trim',
})
export class MflowwTrimPipe implements PipeTransform {
  transform(value: string, maxLength?: number, showDot = true): string {
    if (maxLength) {
      return `${value.slice(0, maxLength)}${showDot ? '...' : ''}`;
    }
    return value;
  }
}
