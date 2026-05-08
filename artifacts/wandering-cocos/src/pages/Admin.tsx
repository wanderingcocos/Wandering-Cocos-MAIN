import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API = `${BASE}/api`;

type BakeWindow = {
  id: number;
  label: string;
  bakeDate: string;
  status: string;
  boxPrice: number;
  originalPrice: number;
  maxBoxes: number;
  notes: string | null;
  createdAt: string;
};

type Order = {
  id: number;
  bakeWindowId: number | null;
  name: string;
  phone: string;
  address: string;
  qty: number;
  occasion: string;
  giftMessage: string | null;
  status: string;
  totalAmount: number;
  createdAt: string;
};

type Setting = { key: string; value: string; updatedAt: string };

const STATUS_COLORS: Record<string, string> = {
  draft: "#94a3b8",
  announced: "#22c55e",
  closed: "#f59e0b",
  completed: "#64748b",
  pending: "#94a3b8",
  confirmed: "#22c55e",
  cancelled: "#ef4444",
};

function Badge({ status }: { status: string }) {
  return (
    <span
      className="text-[9px] tracking-[0.2em] uppercase font-medium px-2 py-0.5 rounded-sm"
      style={{ background: `${STATUS_COLORS[status] ?? "#94a3b8"}22`, color: STATUS_COLORS[status] ?? "#94a3b8", border: `1px solid ${STATUS_COLORS[status] ?? "#94a3b8"}44` }}
    >
      {status}
    </span>
  );
}

function useAdminFetch<T>(url: string, token: string, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetch(url, { headers: { "x-admin-token": token } })
      .then((r) => r.json())
      .then((d) => { setData(d); setError(null); })
      .catch(() => setError("Failed to fetch"))
      .finally(() => setLoading(false));
  }, [url, token, ...deps]);

  useEffect(() => { refetch(); }, [refetch]);
  return { data, loading, error, refetch };
}

function BakeWindowsTab({ token }: { token: string }) {
  const { data: windows, loading, refetch } = useAdminFetch<BakeWindow[]>(`${API}/admin/bake-windows`, token);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ label: "", bakeDate: "", status: "draft", boxPrice: 1299, originalPrice: 1999, maxBoxes: 15, notes: "" });
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState("");

  async function handleCreate() {
    setSaving(true);
    await fetch(`${API}/admin/bake-windows`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setCreating(false);
    setForm({ label: "", bakeDate: "", status: "draft", boxPrice: 1299, originalPrice: 1999, maxBoxes: 15, notes: "" });
    refetch();
  }

  async function handleStatusUpdate(id: number) {
    await fetch(`${API}/admin/bake-windows/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ status: editStatus }),
    });
    setEditId(null);
    refetch();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this bake window?")) return;
    await fetch(`${API}/admin/bake-windows/${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    refetch();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-foreground">Bake Windows</h2>
        <button
          onClick={() => setCreating(true)}
          className="text-xs tracking-[0.18em] uppercase font-medium px-5 h-9 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-200"
        >
          + New Window
        </button>
      </div>

      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-border/50 p-6 mb-6 bg-muted/30"
          >
            <p className="text-[10px] tracking-[0.25em] uppercase text-foreground/40 mb-5">New Bake Window</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[10px] tracking-widest uppercase text-foreground/40 block mb-1">Label</label>
                <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. Weekend Drop #3" className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-foreground/40 block mb-1">Bake Date</label>
                <input type="date" value={form.bakeDate} onChange={e => setForm(f => ({ ...f, bakeDate: e.target.value }))} className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-foreground/40 block mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent">
                  <option value="draft">Draft</option>
                  <option value="announced">Announced</option>
                  <option value="closed">Closed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-foreground/40 block mb-1">Box Price (₹)</label>
                <input type="number" value={form.boxPrice} onChange={e => setForm(f => ({ ...f, boxPrice: Number(e.target.value) }))} className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-foreground/40 block mb-1">Original Price (₹)</label>
                <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: Number(e.target.value) }))} className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-foreground/40 block mb-1">Max Boxes</label>
                <input type="number" value={form.maxBoxes} onChange={e => setForm(f => ({ ...f, maxBoxes: Number(e.target.value) }))} className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
            </div>
            <div className="mb-5">
              <label className="text-[10px] tracking-widest uppercase text-foreground/40 block mb-1">Notes</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full border border-border/50 bg-background text-foreground text-xs px-3 py-2 focus:outline-none focus:border-accent resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreate} disabled={saving || !form.label || !form.bakeDate} className="text-xs tracking-[0.18em] uppercase font-medium px-6 h-9 bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-40">
                {saving ? "Saving…" : "Create"}
              </button>
              <button onClick={() => setCreating(false)} className="text-xs tracking-[0.18em] uppercase font-medium px-6 h-9 border border-border/50 text-foreground/50 hover:text-foreground transition-all">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-xs text-foreground/40">Loading…</p>
      ) : !windows?.length ? (
        <p className="text-xs text-foreground/40">No bake windows yet. Create one above.</p>
      ) : (
        <div className="divide-y divide-border/30">
          {windows.map((w) => (
            <div key={w.id} className="py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-serif text-sm text-foreground">{w.label}</span>
                  <Badge status={w.status} />
                </div>
                <p className="text-xs text-foreground/40">
                  {new Date(w.bakeDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} &nbsp;·&nbsp;
                  ₹{w.boxPrice.toLocaleString("en-IN")} &nbsp;·&nbsp; Max {w.maxBoxes} boxes
                </p>
                {w.notes && <p className="text-xs text-foreground/30 mt-0.5 italic">{w.notes}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {editId === w.id ? (
                  <>
                    <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="h-8 border border-border/50 bg-background text-foreground text-xs px-2 focus:outline-none">
                      <option value="draft">Draft</option>
                      <option value="announced">Announced</option>
                      <option value="closed">Closed</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button onClick={() => handleStatusUpdate(w.id)} className="text-[10px] tracking-widest uppercase px-3 h-8 bg-accent text-accent-foreground">Save</button>
                    <button onClick={() => setEditId(null)} className="text-[10px] tracking-widest uppercase px-3 h-8 border border-border/50 text-foreground/40">×</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditId(w.id); setEditStatus(w.status); }} className="text-[10px] tracking-widest uppercase px-3 h-8 border border-border/40 text-foreground/40 hover:text-foreground hover:border-foreground/50 transition-all">Edit</button>
                    <button onClick={() => handleDelete(w.id)} className="text-[10px] tracking-widest uppercase px-3 h-8 border border-red-300/30 text-red-400/60 hover:text-red-400 hover:border-red-400/50 transition-all">Del</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersTab({ token }: { token: string }) {
  const { data: orders, loading, refetch } = useAdminFetch<Order[]>(`${API}/admin/orders`, token);
  const [filter, setFilter] = useState("all");

  async function handleStatusChange(id: number, status: string) {
    await fetch(`${API}/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ status }),
    });
    refetch();
  }

  const filtered = orders?.filter(o => filter === "all" || o.status === filter) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-serif text-xl text-foreground">Orders</h2>
        <div className="flex gap-2">
          {["all", "pending", "confirmed", "cancelled"].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-[10px] tracking-[0.18em] uppercase px-3 h-7 border transition-all ${filter === s ? "border-accent bg-accent text-accent-foreground" : "border-border/40 text-foreground/40 hover:text-foreground"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-foreground/40">Loading…</p>
      ) : !filtered.length ? (
        <p className="text-xs text-foreground/40">No orders {filter !== "all" ? `with status "${filter}"` : "yet"}.</p>
      ) : (
        <div className="divide-y divide-border/30">
          {filtered.map((o) => (
            <div key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-serif text-sm text-foreground">{o.name}</span>
                  <Badge status={o.status} />
                  {o.occasion === "gift" && <span className="text-[9px] tracking-widest uppercase text-foreground/30 border border-border/30 px-2 py-0.5">Gift</span>}
                </div>
                <p className="text-xs text-foreground/40">
                  {o.phone} &nbsp;·&nbsp; {o.qty} {o.qty === 1 ? "box" : "boxes"} &nbsp;·&nbsp; ₹{o.totalAmount.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-foreground/30 mt-0.5 leading-relaxed">{o.address}</p>
                {o.giftMessage && <p className="text-xs text-foreground/30 mt-0.5 italic">"{o.giftMessage}"</p>}
                <p className="text-[10px] text-foreground/22 mt-1">{new Date(o.createdAt).toLocaleString("en-IN")}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <select
                  value={o.status}
                  onChange={e => handleStatusChange(o.id, e.target.value)}
                  className="h-8 border border-border/50 bg-background text-foreground text-xs px-2 focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const DEFAULT_SETTINGS: { key: string; label: string; placeholder: string }[] = [
  { key: "strip_message", label: "Info Strip Message", placeholder: "Bake Date Coming Soon · Pre-orders open now. Limited bakes." },
  { key: "strip_enabled", label: "Info Strip Enabled (true/false)", placeholder: "true" },
  { key: "bake_date_label", label: "Bake Date Label", placeholder: "Coming Soon" },
  { key: "delivery_zone", label: "Delivery Zone", placeholder: "Free delivery within 7km of HSR Layout, Bengaluru" },
];

function SettingsTab({ token }: { token: string }) {
  const { data: settings, loading, refetch } = useAdminFetch<Setting[]>(`${API}/admin/settings`, token);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      for (const s of settings) map[s.key] = s.value;
      setValues(map);
    }
  }, [settings]);

  async function handleSave(key: string) {
    setSaving(key);
    await fetch(`${API}/admin/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ key, value: values[key] ?? "" }),
    });
    setSaving(null);
    refetch();
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-foreground mb-6">Site Settings</h2>
      {loading ? (
        <p className="text-xs text-foreground/40">Loading…</p>
      ) : (
        <div className="space-y-6">
          {DEFAULT_SETTINGS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-[10px] tracking-[0.22em] uppercase font-medium text-foreground/45 block mb-1.5">{label}</label>
              <div className="flex gap-3">
                <input
                  value={values[key] ?? ""}
                  onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="flex-1 h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  onClick={() => handleSave(key)}
                  disabled={saving === key}
                  className="text-xs tracking-[0.18em] uppercase font-medium px-5 h-10 bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-40"
                >
                  {saving === key ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("wc_admin_token") ?? "");
  const [input, setInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"windows" | "orders" | "settings">("windows");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (token) verifyToken(token);
  }, []);

  async function verifyToken(t: string) {
    setChecking(true);
    try {
      const r = await fetch(`${API}/admin/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: t }),
      });
      if (r.ok) {
        localStorage.setItem("wc_admin_token", t);
        setToken(t);
        setAuthed(true);
        setAuthError("");
      } else {
        setAuthed(false);
        setAuthError("Invalid password.");
        localStorage.removeItem("wc_admin_token");
      }
    } catch {
      setAuthed(false);
      setAuthError("Could not reach server.");
    }
    setChecking(false);
  }

  function handleLogout() {
    localStorage.removeItem("wc_admin_token");
    setToken("");
    setInput("");
    setAuthed(false);
  }

  const TABS = [
    { id: "windows", label: "Bake Windows" },
    { id: "orders", label: "Orders" },
    { id: "settings", label: "Settings" },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-1">Wandering Cocos</p>
            <h1 className="font-serif text-2xl text-foreground">Admin</h1>
          </div>
          {authed && (
            <button onClick={handleLogout} className="text-[10px] tracking-[0.22em] uppercase text-foreground/30 hover:text-foreground/60 transition-colors">
              Sign out
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!authed ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-sm"
            >
              <p className="text-xs text-foreground/40 mb-6 leading-relaxed">Enter the admin password to continue.</p>
              <div className="space-y-3">
                <input
                  type="password"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && verifyToken(input)}
                  placeholder="Admin password"
                  className="w-full h-11 border border-border/50 bg-background text-foreground text-sm px-4 focus:outline-none focus:border-accent transition-colors"
                  autoFocus
                />
                {authError && <p className="text-xs text-red-400">{authError}</p>}
                <button
                  onClick={() => verifyToken(input)}
                  disabled={!input || checking}
                  className="w-full h-11 text-xs tracking-[0.22em] uppercase font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-40"
                >
                  {checking ? "Checking…" : "Enter"}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Tabs */}
              <div className="flex gap-0 border-b border-border/40 mb-8">
                {TABS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`px-5 py-3 text-[11px] tracking-[0.18em] uppercase font-medium transition-all border-b-2 -mb-px ${
                      tab === t.id
                        ? "border-accent text-foreground"
                        : "border-transparent text-foreground/40 hover:text-foreground/70"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === "windows" && <BakeWindowsTab token={token} />}
              {tab === "orders" && <OrdersTab token={token} />}
              {tab === "settings" && <SettingsTab token={token} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
