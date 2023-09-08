export const CHART_TYPES_MAP = {
  line: 'Line',
  bar: 'Bar',
  pie: 'Pie',
} as const;

export type ChartType = keyof typeof CHART_TYPES_MAP;
