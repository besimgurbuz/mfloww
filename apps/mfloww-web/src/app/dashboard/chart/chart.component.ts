import { CommonModule, formatNumber } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  effect,
  signal,
} from '@angular/core';
import { SupportedCurrencyCode } from '@mfloww/common';
import * as echarts from 'echarts';
import {
  ChartSeries,
  DefaultExpenseSeries,
  DefaultRevenueSeries,
} from '../models/chart-series';

export interface ChartSeriesData {
  dates: string[];
  revenues: number[];
  expenses: number[];
}

@Component({
  selector: 'mfloww-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
})
export class ChartComponent implements AfterViewInit {
  @Input() set data(seriesData: ChartSeriesData) {
    this._chartInstance.setOption({
      xAxis: {
        data: seriesData.dates,
      },
    });

    this.revenueSeries.mutate((series) => (series.data = seriesData.revenues));
    this.expenseSeries.mutate((series) => (series.data = seriesData.expenses));
  }
  @Input() set chartType(chartType: ChartSeries['type']) {
    this._type = chartType;

    this.revenueSeries.mutate((series) => (series.type = chartType));
    this.expenseSeries.mutate((series) => (series.type = chartType));

    this._chartInstance.setOption({
      xAxis: {
        show: chartType !== 'pie',
      },
    });
  }
  get chartType() {
    return this._type;
  }
  @Input() baseCurrency!: SupportedCurrencyCode;

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
      tooltip: {
        textStyle: {
          fontFamily: 'Roboto',
        },
        formatter: (params: { marker: string; name: string; value: number }) =>
          `${params.marker}${
            params.name
          }<br/>&nbsp;&nbsp;&nbsp;&nbsp;<b>${formatNumber(
            params.value,
            'en_us'
          )} ${this.baseCurrency}</b>`,
      },
      backgroundColor: 'transparent',
      textStyle: {
        fontFamily: 'Krona One',
      },
      xAxis: {
        type: 'category',
        data: [],
      },
      yAxis: {
        type: 'value',
      },
      series: [],
    });
  }

  resizeChart() {
    this._chartInstance.resize();
  }
}
