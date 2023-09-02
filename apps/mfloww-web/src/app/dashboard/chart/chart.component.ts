import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  effect,
  signal,
} from '@angular/core';
import * as echarts from 'echarts';
import {
  ChartSeries,
  DefaultExpenseSeries,
  DefaultRevenueSeries,
} from '../models/chart-series';

export interface ChartEntry {
  value: number;
  date: string;
}

export interface ChartSeriesData {
  revenues: ChartEntry[];
  expenses: ChartEntry[];
}

@Component({
  selector: 'mfloww-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
})
export class ChartComponent implements AfterViewInit {
  @Input() data: unknown;
  @Input() set chartType(chartType: ChartSeries['type']) {
    this._type = chartType;

    this.revenueSeries.mutate((series) => (series.type = chartType));
    this.expenseSeries.mutate((series) => (series.type = chartType));
  }
  get chartType() {
    return this._type;
  }
  private _type: ChartSeries['type'] = 'line';
  private revenueSeries = signal<ChartSeries>(DefaultRevenueSeries);
  private expenseSeries = signal<ChartSeries>(DefaultExpenseSeries);

  @ViewChild('chartContainer', { read: ElementRef })
  chartContainerElementRef!: ElementRef<HTMLDivElement>;

  private _chartInstance!: echarts.ECharts;

  constructor() {
    effect(() => {
      const revenueSeries = this.revenueSeries();
      const expenseSeries = this.expenseSeries();

      this._chartInstance?.setOption({
        series: [revenueSeries, expenseSeries],
      });
    });
  }

  ngAfterViewInit(): void {
    this._chartInstance = echarts.init(
      this.chartContainerElementRef.nativeElement,
      'dark'
    );

    this._chartInstance.setOption({
      tooltip: {},
      backgroundColor: 'transparent',
      textStyle: {
        fontFamily: 'Krona One',
      },
      grid: {
        x: 0,
        x2: 0,
      },
      xAxis: {
        data: [],
      },
      yAxis: {},
      series: [],
    });
  }

  resizeChart() {
    this._chartInstance.resize();
  }
}
