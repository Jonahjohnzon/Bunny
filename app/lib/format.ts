// lib/format.ts

export function formatNumber(n?: number | null): string {
  if (n == null || isNaN(n)) return '0';

  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1) + 'K';

  return n.toString();
}