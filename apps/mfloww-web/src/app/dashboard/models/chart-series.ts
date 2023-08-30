export interface ChartSeries {
  name: string;
  type: 'line' | 'bar';
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
