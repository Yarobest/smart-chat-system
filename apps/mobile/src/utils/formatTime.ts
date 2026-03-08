export function formatTime(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
