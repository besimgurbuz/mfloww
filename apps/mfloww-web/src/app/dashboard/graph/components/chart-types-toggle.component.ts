import { KeyValuePipe, NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MflowwTabDirective, MflowwTabGroupComponent } from '@mfloww/view';
import { TranslateModule } from '@ngx-translate/core';
import { CHART_TYPES_MAP, ChartType } from '../../models/chart-type';

@Component({
  selector: 'mfloww-chart-types-toggle',
  template: `
    <mfloww-view-tab-group>
      <ng-container
        *ngFor="
          let chartType of _chartTypesMap | keyvalue;
          let first = first;
          let last = last
        "
      >
        <ng-template mflowwViewTab>
          <button
            class="w-full h-8 text-sm px-4 text-center"
            [ngClass]="{
              'bg-mfloww_fg': _selectedChartType === chartType.key,
            }"
            (click)="setType(chartType.key)"
          >
            {{ 'Graph.' + chartType.value | translate }}
          </button>
        </ng-template>
      </ng-container>
    </mfloww-view-tab-group>
  `,
  standalone: true,
  imports: [
    NgFor,
    NgClass,
    KeyValuePipe,
    MflowwTabGroupComponent,
    MflowwTabDirective,
    TranslateModule,
  ],
})
export class ChartTypesToggleComponent implements OnInit {
  @Input({ required: false }) initialType?: ChartType;

  @Output() changed = new EventEmitter<ChartType>();

  _chartTypesMap = CHART_TYPES_MAP;
  _selectedChartType: ChartType = 'line';

  ngOnInit(): void {
    if (this.initialType) {
      this._selectedChartType = this.initialType;
    }
  }

  setType(type: string) {
    this._selectedChartType = type as ChartType;
    this.changed.emit(type as ChartType);
  }
}
