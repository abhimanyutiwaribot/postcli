export function statusColor(s: number) {
  if (s >= 500) return "red";
  if (s >= 400) return "yellow";
  if (s >= 300) return "cyan";
  return "green";
}

export function prettyBody(raw: string): string {
  try { return JSON.stringify(JSON.parse(raw), null, 2); }
  catch { return raw; }
}

export function byteSize(s: string): string {
  const b = new TextEncoder().encode(s).length;
  return b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} KB`;
}