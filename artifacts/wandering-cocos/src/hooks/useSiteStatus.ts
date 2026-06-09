import { useState, useEffect } from "react";
import { readCache, revalidate } from "@/lib/apiCache";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const URL = `${BASE}/api/site-status`;
const TTL = 45_000;

export type SiteMode = "bake_day" | "popup" | "maintenance" | "sold_out" | "chef_on_break" | "small_only";

export function useSiteStatus() {
  const [mode, setMode] = useState<SiteMode>(
    () => readCache<{ mode: SiteMode }>(URL, TTL)?.mode ?? "bake_day"
  );
  const [loaded, setLoaded] = useState(() => readCache<{ mode: SiteMode }>(URL, TTL) !== undefined);

  useEffect(() => {
    revalidate<{ mode: SiteMode }>(
      URL,
      d => { setMode(d.mode); setLoaded(true); },
      () => setLoaded(true),
    );
  }, []);

  return { mode, loaded };
}
