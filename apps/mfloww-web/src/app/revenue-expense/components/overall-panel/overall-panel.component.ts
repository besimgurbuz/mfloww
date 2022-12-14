import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'mfloww-overall-panel',
  templateUrl: './overall-panel.component.html',
  styleUrls: ['./overall-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverallTableComponent {
  @Input() overallTotal = 0;
}
