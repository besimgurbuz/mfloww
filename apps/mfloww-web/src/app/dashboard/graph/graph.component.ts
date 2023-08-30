import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'mfloww-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  standalone: true,
  imports: [ChartComponent, ReactiveFormsModule],
})
export class GraphComponent {
  _chartTypeControl = new FormControl<'line' | 'bar'>('line', {
    nonNullable: true,
  });
}
