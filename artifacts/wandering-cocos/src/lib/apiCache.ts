const PREFIX = "wc:";

type CacheEntry = { data: unknown; ts: number };
const mem = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();

export function readCache<T>(url: string, ttlMs: number): T | null {
  const m = mem.get(url);
  if (m && Date.now() - m.ts < ttlMs) return m.data as T;
  try {
    const raw = localStorage.getItem(PREFIX + url);
    if (raw) {
      const e = JSON.parse(raw) as CacheEntry;
      if (Date.now() - e.ts < ttlMs) {
        mem.set(url, e);
        return e.data as T;
      }
    }
  } catch {}
  return null;
}

function writeCache(url: string, data: unknown) {
  const e: CacheEntry = { data, ts: Date.now() };
  mem.set(url, e);
  try { localStorage.setItem(PREFIX + url, JSON.stringify(e)); } catch {}
}

export function revalidate<T>(
  url: string,
  onData: (d: T) => void,
  fallback: T,
): void {
  if (inflight.has(url)) {
    (inflight.get(url) as Promise<T>).then(onData).catch(() => {});
    return;
  }
  const p = fetch(url)
    .then(r => r.ok ? r.json() as T : fallback)
    .then((d: T) => { writeCache(url, d); onData(d); inflight.delete(url); return d; })
    .catch(() => { inflight.delete(url); onData(fallback); return fallback; });
  inflight.set(url, p);
}
