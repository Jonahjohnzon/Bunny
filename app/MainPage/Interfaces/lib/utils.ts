export function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n?.toString();
}

export const avatarColors: Record<string, string> = {
  A: '#ef4444', N: '#f59e0b', R: '#4b8ef1', J: '#10b981',
  T: '#8b5cf6', C: '#ec4899', P: '#14b8a6', M: '#f97316',
};

// ── Thread prefix styling (e.g. [GUIDE], [WIP]) ────────────────────────────
export const prefixStyles: Record<string, { label: string; bg: string; color: string }> = {
  Guide:      { label: 'GUIDE',      bg: '#10b98122', color: '#10b981' },
  Poll:       { label: 'POLL',      bg: '#f59e0b22', color: '#f59e0b' },
  Discussion: { label: 'DISCUSSION', bg: '#4b8ef122', color: '#4b8ef1' },
  Question:   { label: 'QUESTION',   bg: '#8b5cf622', color: '#8b5cf6' },
  News:       { label: 'NEWS',       bg: '#ec489922', color: '#ec4899' },
};

