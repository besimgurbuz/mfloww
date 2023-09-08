import { CommonModule, formatNumber } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { SupportedCurrencyCode } from '@mfloww/common';
import { TranslateService } from '@ngx-translate/core';
import * as echarts from 'echarts';
import { ChartSeriesData, PieChartData } from '../models/chart-data';
import {
  ChartSeries,
  DefaultExpenseSeries,
  DefaultRevenueSeries,
} from '../models/chart-series';

@Component({
  selector: 'mfloww-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
})
export class ChartComponent implements OnInit {
  @Input() set data(seriesData: ChartSeriesData | null) {
    this._data = seriesData;

    if (this.chartType === 'pie') {
      this.setOptionsForPieChart();
      return;
    }
    this.setOptionsForChart();
  }
  get data() {
    return this._data;
  }
  private _data: ChartSeriesData | null = null;

  @Input() set pieData(pieData: PieChartData | null) {
    if (!pieData) return;
  }
  @Input() set chartType(chartType: ChartSeries['type']) {
    this._type = chartType;

    if (chartType === 'pie') {
      this.setOptionsForPieChart();
      return;
    }
    this.setOptionsForChart();
  }
  get chartType() {
    return this._type;
  }
  private _type: ChartSeries['type'] = 'line';

  @Input() baseCurrency!: SupportedCurrencyCode;

  @ViewChild('chartContainer', { read: ElementRef, static: true })
  chartContainerElementRef!: ElementRef<HTMLDivElement>;

  private translateService = inject(TranslateService);
  private _chartInstance!: echarts.ECharts;

  ngOnInit(): void {
    this._chartInstance = echarts.init(
      this.chartContainerElementRef.nativeElement,
      'dark'
    );

    this._chartInstance.setOption({
      toolbox: {
        right: 50,
        itemSize: 20,
        feature: {
          dataZoom: {},
        },
        iconStyle: {
          borderWidth: 1.5,
        },
        emphasis: {
          iconStyle: {
            borderColor: '#008eff',
          },
        },
        showTitle: false,
        tooltip: {
          show: true,
          formatter: function (param: { title: string }) {
            return '<div>' + param.title + '</div>'; // user-defined DOM structure
          },
          backgroundColor: 'var(--app-foreground)',
          textStyle: {
            fontSize: 12,
          },
          extraCssText: 'overflow: hidden',
        },
      },
      tooltip: {
        textStyle: {
          color: 'var(--app-white)',
          fontFamily: 'Roboto',
        },
        formatter: (params: { marker: string; name: string; value: number }) =>
          `${params.marker}${
            params.name
          }<br/>&nbsp;&nbsp;&nbsp;&nbsp;<b>${formatNumber(
            params.value,
            'en_us'
          )} ${this.baseCurrency}</b>`,
        backgroundColor: 'var(--app-foreground)',
      },
      grid: {
        x: 100,
        x2: 50,
      },
      dataZoom: [
        {
          type: 'inside',
          yAxisIndex: 0,
          minSpan: 50,
        },
        {
          type: 'inside',
          xAxisIndex: 0,
        },
      ],
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

  private setOptionsForChart(): void {
    this._chartInstance?.setOption({
      xAxis: {
        show: true,
        data: this.data?.dates,
      },
      series: [
        {
          ...DefaultRevenueSeries,
          type: this.chartType,
          data: this.data?.revenues,
        },
        {
          ...DefaultExpenseSeries,
          type: this.chartType,
          data: this.data?.expenses,
        },
      ],
    });
  }

  private setOptionsForPieChart() {
    const totalRevenue =
      this.data?.revenues.reduce((total, revenue) => total + revenue, 0) ?? 0;
    const totalExpense =
      this.data?.expenses.reduce((total, expense) => total + expense, 0) ?? 0;

    this._chartInstance?.setOption({
      xAxis: {
        show: false,
        data: this.data?.dates,
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            {
              value: totalRevenue,
              name: this.translateService.instant('Graph.Revenue'),
              itemStyle: { color: '#82db73' },
            },
            {
              value: Math.abs(totalExpense),
              name: this.translateService.instant('Graph.Expense'),
              itemStyle: { color: '#f44336' },
            },
          ],
        },
        {
          data: [],
        },
      ],
    });
  }
}
