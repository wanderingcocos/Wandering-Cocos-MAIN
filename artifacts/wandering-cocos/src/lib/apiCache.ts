const PREFIX = "wc:";

type CacheEntry = { data: unknown; ts: number };
const mem = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<{ ok: true; data: unknown } | { ok: false }>>();

export function readCache<T>(url: string, ttlMs: number): T | undefined {
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
  return undefined;
}

function writeCache(url: string, data: unknown) {
  const e: CacheEntry = { data, ts: Date.now() };
  mem.set(url, e);
  try { localStorage.setItem(PREFIX + url, JSON.stringify(e)); } catch {}
}

export function revalidate<T>(
  url: string,
  onData: (d: T) => void,
  onError: () => void,
): void {
  if (inflight.has(url)) {
    inflight.get(url)!.then(r => { if (r.ok) onData(r.data as T); else onError(); }).catch(() => onError());
    return;
  }

  const p = fetch(url)
    .then(r => {
      if (!r.ok) return { ok: false } as const;
      return r.json().then((data: T) => ({ ok: true, data } as const));
    })
    .then(r => {
      if (r.ok) { writeCache(url, r.data); onData(r.data as T); }
      else onError();
      inflight.delete(url);
      return r;
    })
    .catch(() => {
      onError();
      inflight.delete(url);
      return { ok: false } as const;
    });

  inflight.set(url, p);
}
