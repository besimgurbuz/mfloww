import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MflowwIconComponent } from '../../../icon/icon.component';

@Component({
  selector: 'mfloww-view-month-year-header',
  standalone: true,
  imports: [CommonModule, MflowwIconComponent],
  template: `
    <div class="flex w-full h-fit justify-between items-center">
      <button
        class="w-[24px] h-[24px] rotate-90 flex items-center"
        (click)="decreaseYear()"
      >
        <mfloww-view-icon type="arrow_down"></mfloww-view-icon>
      </button>
      <h3>{{ year | async }}</h3>
      <button
        class="w-[24px] h-[24px] -rotate-90 flex items-center"
        (click)="increaseYear()"
      >
        <mfloww-view-icon type="arrow_down"></mfloww-view-icon>
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MflowwMonthYearHeaderComponent {
  @Input() dateFilter?: (date: Date) => boolean;
  @Input() set startYear(year: number) {
    this.year.next(year);
  }

  @Output() year: BehaviorSubject<number> = new BehaviorSubject(
    new Date().getFullYear()
  );

  increaseYear(): void {
    const date = new Date();
    date.setFullYear(this.year.value + 1);
    if (this.dateFilter && !this.dateFilter(date)) return;
    this.year.next(this.year.value + 1);
  }

  decreaseYear(): void {
    const date = new Date();
    date.setFullYear(this.year.value - 1);
    if (this.dateFilter && !this.dateFilter(date)) return;
    this.year.next(this.year.value - 1);
  }
}
