import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MflowwOptionComponent } from './components/option/option.component';

@Component({
  selector: 'mfloww-view-select',
  standalone: true,
  imports: [CommonModule, MflowwOptionComponent],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MflowwSelectComponent implements AfterViewInit {
  @Input() placeholder?: string;

  @ViewChildren(MflowwOptionComponent)
  options!: QueryList<MflowwOptionComponent>;

  ngAfterViewInit(): void {
    console.log(this.options);
  }
}
