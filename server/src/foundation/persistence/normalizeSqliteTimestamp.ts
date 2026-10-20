export function normalizeSqliteTimestamp(timestamp: string): string {
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(timestamp)) {
    return `${timestamp.replace(' ', 'T')}Z`;
  }
  return timestamp;
}
