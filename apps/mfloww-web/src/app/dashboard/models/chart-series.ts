export const CHART_TYPES_MAP = {
  line: 'Line',
  bar: 'Bar',
  pie: 'Pie',
} as const;

export type ChartType = keyof typeof CHART_TYPES_MAP;

export interface ChartSeries {
  name: string;
  type: ChartType;
  itemStyle: {
    color: string;
  };
  data?: number[];
}

export const DefaultRevenueSeries: ChartSeries = {
  name: 'Revenue',
  type: 'line',
  itemStyle: {
    color: '#82db73',
  },
  data: [],
};

export const DefaultExpenseSeries: ChartSeries = {
  name: 'Expense',
  type: 'line',
  itemStyle: {
    color: '#f44336',
  },
  data: [],
};
