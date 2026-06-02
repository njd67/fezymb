function readEnv(key: 'API_BASE' | 'LOG_API_BASE'): string | undefined {
  // In the browser, `process` may not exist unless webpack injects it.
  const p = typeof process !== 'undefined' ? process : undefined;
  const value = p?.env?.[key];
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function apiBase(): string {
  const base = readEnv('API_BASE') ?? readEnv('LOG_API_BASE');
  return base ? base.replace(/\/$/, '') : '';
}

