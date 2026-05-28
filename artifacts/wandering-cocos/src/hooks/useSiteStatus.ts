import { useState, useEffect } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export type SiteMode = "bake_day" | "popup" | "maintenance" | "sold_out" | "chef_on_break";

export function useSiteStatus() {
  const [mode, setMode] = useState<SiteMode>("bake_day");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/site-status`)
      .then(r => r.ok ? r.json() : { mode: "bake_day" })
      .then((d: { mode: SiteMode }) => { setMode(d.mode); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  return { mode, loaded };
}
