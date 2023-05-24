const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export function convertEntryDate(value: string): string {
  const [month, year] = value.split('_');

  return `${monthNames[+month]} ${year}`;
}
