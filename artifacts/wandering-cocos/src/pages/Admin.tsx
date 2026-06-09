import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API = `${BASE}/api`;

type BakeWindowItem = { id: number; bakeWindowId: number; name: string; description: string | null; position: number };

type BakeWindow = {
  id: number; label: string; bakeDate: string; status: string;
  boxPrice: number; originalPrice: number; maxBoxes: number;
  notes: string | null; createdAt: string;
  items: BakeWindowItem[];
};

type Order = {
  id: number; bakeWindowId: number | null; name: string; phone: string;
  address: string; qty: number; occasion: string; giftMessage: string | null;
  status: string; totalAmount: number; createdAt: string;
};

type Setting = { key: string; value: string; updatedAt: string };

const STATUS_COLORS: Record<string, string> = {
  draft: "#94a3b8", announced: "#22c55e", closed: "#f59e0b", completed: "#64748b",
  pending: "#94a3b8", confirmed: "#22c55e", cancelled: "#ef4444",
};

function Badge({ status }: { status: string }) {
  return (
    <span className="text-[9px] tracking-[0.2em] uppercase font-medium px-2 py-0.5 rounded-sm"
      style={{ background: `${STATUS_COLORS[status] ?? "#94a3b8"}22`, color: STATUS_COLORS[status] ?? "#94a3b8", border: `1px solid ${STATUS_COLORS[status] ?? "#94a3b8"}44` }}>
      {status}
    </span>
  );
}

async function apiCall(url: string, options: RequestInit): Promise<{ ok: true; data: unknown } | { ok: false; message: string }> {
  try {
    const r = await fetch(url, options);
    if (!r.ok) {
      let msg = `Server error ${r.status}`;
      try { const j = await r.json(); if (j?.error) msg = j.error; } catch { /* ignore */ }
      return { ok: false, message: msg };
    }
    return { ok: true, data: await r.json() };
  } catch {
    return { ok: false, message: "Could not reach the server. Check your connection." };
  }
}

function useAdminFetch<T>(url: string, token: string) {
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
  }, [url, token]);

  useEffect(() => { refetch(); }, [refetch]);
  return { data, loading, error, refetch };
}

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-5 px-4 py-3 border border-red-300/40 bg-red-50/40 text-red-600 text-xs rounded-sm">
      <span>{message}</span>
      <button onClick={onDismiss} className="text-red-400 hover:text-red-600 flex-shrink-0 text-base leading-none">×</button>
    </div>
  );
}

// ── Items sub-panel ────────────────────────────────────────────────────────────

function ItemsPanel({ windowId, items, token, onRefetch }: {
  windowId: number; items: BakeWindowItem[]; token: string; onRefetch: () => void;
}) {
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [adding, setAdding] = useState(false);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    if (!newName.trim()) return;
    setAdding(true);
    const res = await apiCall(`${API}/admin/bake-windows/${windowId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ name: newName.trim(), description: newDesc.trim() || null, position: items.length }),
    });
    setAdding(false);
    if (!res.ok) { setError(res.message); return; }
    setNewName(""); setNewDesc("");
    onRefetch();
  }

  async function handleSaveEdit(id: number) {
    const res = await apiCall(`${API}/admin/bake-window-items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ name: editName.trim(), description: editDesc.trim() || null }),
    });
    if (!res.ok) { setError(res.message); return; }
    setEditItemId(null);
    onRefetch();
  }

  async function handleDelete(id: number) {
    if (!confirm("Remove this item?")) return;
    const res = await apiCall(`${API}/admin/bake-window-items/${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    if (!res.ok) { setError(res.message); return; }
    onRefetch();
  }

  return (
    <div className="mt-4 ml-0 border-t border-border/25 pt-4">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      <p className="text-[9px] tracking-[0.28em] uppercase font-medium text-[#2D2926] mb-3">Box Items ({items.length})</p>

      {items.length > 0 && (
        <div className="space-y-1.5 mb-4">
          {items.map((item, i) => (
            <div key={item.id} className="flex items-start gap-3 group">
              <span className="text-[9px] text-[#2D2926] font-medium w-4 mt-1 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
              {editItemId === item.id ? (
                <div className="flex-1 flex flex-col gap-2">
                  <input value={editName} onChange={e => setEditName(e.target.value)}
                    className="w-full h-8 border border-border/50 bg-background text-foreground text-xs px-2 focus:outline-none focus:border-accent" />
                  <input value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Description (optional)"
                    className="w-full h-8 border border-border/50 bg-background text-foreground text-xs px-2 focus:outline-none focus:border-accent" />
                  <div className="flex gap-2">
                    <button onClick={() => handleSaveEdit(item.id)} className="text-[10px] tracking-widest uppercase px-3 h-7 bg-accent text-accent-foreground">Save</button>
                    <button onClick={() => setEditItemId(null)} className="text-[10px] tracking-widest uppercase px-3 h-7 border border-border/40 text-[#2D2926]">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-foreground leading-snug">{item.name}</p>
                    {item.description && <p className="text-[11px] text-[#2D2926] leading-relaxed">{item.description}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditItemId(item.id); setEditName(item.name); setEditDesc(item.description ?? ""); }}
                      className="text-[9px] tracking-widest uppercase px-2 h-6 border border-border/40 text-[#2D2926] hover:text-foreground hover:border-foreground/50 transition-all">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)}
                      className="text-[9px] tracking-widest uppercase px-2 h-6 border border-red-300/30 text-red-400/50 hover:text-red-400 hover:border-red-400/50 transition-all">
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Item name"
          className="flex-1 h-8 border border-border/40 bg-background text-foreground text-xs px-2 focus:outline-none focus:border-accent"
          onKeyDown={e => e.key === "Enter" && handleAdd()} />
        <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description (optional)"
          className="flex-1 h-8 border border-border/40 bg-background text-foreground text-xs px-2 focus:outline-none focus:border-accent"
          onKeyDown={e => e.key === "Enter" && handleAdd()} />
        <button onClick={handleAdd} disabled={adding || !newName.trim()}
          className="text-[10px] tracking-[0.18em] uppercase font-medium px-4 h-8 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-30">
          {adding ? "Adding…" : "+ Add"}
        </button>
      </div>
    </div>
  );
}

// ── Bake Windows Tab ───────────────────────────────────────────────────────────

function BakeWindowsTab({ token }: { token: string }) {
  const { data: windows, loading, refetch } = useAdminFetch<BakeWindow[]>(`${API}/admin/bake-windows`, token);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ label: "", bakeDate: "", status: "draft", boxPrice: 1299, originalPrice: 1999, maxBoxes: 10, notes: "" });
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [archiveStatus, setArchiveStatus] = useState<Record<number, string>>({});

  async function handleArchive(id: number) {
    setArchiveStatus(s => ({ ...s, [id]: "loading" }));
    const res = await apiCall(`${API}/admin/bake-windows/${id}/archive`, {
      method: "POST",
      headers: { "x-admin-token": token },
    });
    if (!res.ok) {
      setArchiveStatus(s => ({ ...s, [id]: "error" }));
    } else {
      const data = res.data as { created: boolean };
      setArchiveStatus(s => ({ ...s, [id]: data.created ? "done" : "exists" }));
    }
  }

  async function handleCreate() {
    setSaving(true);
    const res = await apiCall(`${API}/admin/bake-windows`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) { setError(res.message); return; }
    setCreating(false);
    setForm({ label: "", bakeDate: "", status: "draft", boxPrice: 1299, originalPrice: 1999, maxBoxes: 10, notes: "" });
    refetch();
  }

  async function handleStatusUpdate(id: number) {
    const res = await apiCall(`${API}/admin/bake-windows/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ status: editStatus }),
    });
    if (!res.ok) { setError(res.message); return; }
    setEditId(null); refetch();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this bake window and all its items?")) return;
    const res = await apiCall(`${API}/admin/bake-windows/${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    if (!res.ok) { setError(res.message); return; }
    refetch();
  }

  return (
    <div>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-foreground">Bake Windows</h2>
        <button onClick={() => setCreating(true)}
          className="text-xs tracking-[0.18em] uppercase font-medium px-5 h-9 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-200">
          + New Window
        </button>
      </div>

      <AnimatePresence>
        {creating && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="border border-border/50 p-6 mb-6 bg-muted/30">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#2D2926] mb-5">New Bake Window</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Label</label>
                <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. Weekend Drop #3"
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Bake Date</label>
                <input type="date" value={form.bakeDate} onChange={e => setForm(f => ({ ...f, bakeDate: e.target.value }))}
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent">
                  <option value="draft">Draft</option>
                  <option value="announced">Announced</option>
                  <option value="closed">Closed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Box Price (₹)</label>
                <input type="number" value={form.boxPrice} onChange={e => setForm(f => ({ ...f, boxPrice: Number(e.target.value) }))}
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Original Price (₹)</label>
                <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: Number(e.target.value) }))}
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Max Boxes</label>
                <input type="number" value={form.maxBoxes} onChange={e => setForm(f => ({ ...f, maxBoxes: Number(e.target.value) }))}
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
            </div>
            <div className="mb-5">
              <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Notes</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                className="w-full border border-border/50 bg-background text-foreground text-xs px-3 py-2 focus:outline-none focus:border-accent resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreate} disabled={saving || !form.label || !form.bakeDate}
                className="text-xs tracking-[0.18em] uppercase font-medium px-6 h-9 bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-40">
                {saving ? "Saving…" : "Create"}
              </button>
              <button onClick={() => setCreating(false)}
                className="text-xs tracking-[0.18em] uppercase font-medium px-6 h-9 border border-border/50 text-[#2D2926] hover:text-foreground transition-all">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-xs text-[#2D2926]">Loading…</p>
      ) : !windows?.length ? (
        <p className="text-xs text-[#2D2926]">No bake windows yet. Create one above.</p>
      ) : (
        <div className="divide-y divide-border/30">
          {windows.map((w) => (
            <div key={w.id} className="py-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-serif text-sm text-foreground">{w.label}</span>
                    <Badge status={w.status} />
                    {(w.items ?? []).length > 0 && (
                      <span className="text-[9px] tracking-widest uppercase text-[#2D2926] border border-border/25 px-2 py-0.5">
                        {(w.items ?? []).length} items
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#2D2926]">
                    {new Date(w.bakeDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}&nbsp;·&nbsp;
                    ₹{w.boxPrice.toLocaleString("en-IN")}&nbsp;·&nbsp;Max {w.maxBoxes} boxes
                  </p>
                  {w.notes && <p className="text-xs text-[#2D2926] mt-0.5 italic">{w.notes}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setOpenItems(s => ({ ...s, [w.id]: !s[w.id] }))}
                    className={`text-[10px] tracking-widest uppercase px-3 h-8 border transition-all ${openItems[w.id] ? "border-accent text-accent" : "border-border/40 text-[#2D2926] hover:text-foreground hover:border-foreground/50"}`}>
                    Items {openItems[w.id] ? "▲" : "▼"}
                  </button>
                  {editId === w.id ? (
                    <>
                      <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                        className="h-8 border border-border/50 bg-background text-foreground text-xs px-2 focus:outline-none">
                        <option value="draft">Draft</option>
                        <option value="announced">Announced</option>
                        <option value="closed">Closed</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button onClick={() => handleStatusUpdate(w.id)} className="text-[10px] tracking-widest uppercase px-3 h-8 bg-accent text-accent-foreground">Save</button>
                      <button onClick={() => setEditId(null)} className="text-[10px] tracking-widest uppercase px-3 h-8 border border-border/50 text-[#2D2926]">×</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditId(w.id); setEditStatus(w.status); }}
                        className="text-[10px] tracking-widest uppercase px-3 h-8 border border-border/40 text-[#2D2926] hover:text-foreground hover:border-foreground/50 transition-all">
                        Status
                      </button>
                      <button
                        onClick={() => handleArchive(w.id)}
                        disabled={archiveStatus[w.id] === "loading" || archiveStatus[w.id] === "done" || archiveStatus[w.id] === "exists"}
                        className="text-[10px] tracking-widest uppercase px-3 h-8 border transition-all disabled:opacity-60"
                        style={{
                          borderColor: archiveStatus[w.id] === "done" ? "rgba(45,90,61,0.45)" : archiveStatus[w.id] === "error" ? "rgba(239,68,68,0.35)" : "rgba(15,36,25,0.2)",
                          color: archiveStatus[w.id] === "done" ? "hsl(150 40% 28%)" : archiveStatus[w.id] === "error" ? "rgba(239,68,68,0.75)" : "#0F2419",
                        }}>
                        {archiveStatus[w.id] === "loading" ? "Archiving…" : archiveStatus[w.id] === "done" ? "Archived ✓" : archiveStatus[w.id] === "exists" ? "Already Archived" : archiveStatus[w.id] === "error" ? "Error" : "→ Archive"}
                      </button>
                      <button onClick={() => handleDelete(w.id)}
                        className="text-[10px] tracking-widest uppercase px-3 h-8 border border-red-300/30 text-red-400/60 hover:text-red-400 hover:border-red-400/50 transition-all">
                        Del
                      </button>
                    </>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {openItems[w.id] && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden">
                    <ItemsPanel windowId={w.id} items={w.items ?? []} token={token} onRefetch={refetch} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Orders Tab ─────────────────────────────────────────────────────────────────

function OrdersTab({ token }: { token: string }) {
  const { data: orders, loading, refetch } = useAdminFetch<Order[]>(`${API}/admin/orders`, token);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange(id: number, status: string) {
    const res = await apiCall(`${API}/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) { setError(res.message); return; }
    refetch();
  }

  const filtered = orders?.filter(o => filter === "all" || o.status === filter) ?? [];

  return (
    <div>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-serif text-xl text-foreground">Orders</h2>
        <div className="flex gap-2">
          {["all", "pending", "confirmed", "cancelled"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-[10px] tracking-[0.18em] uppercase px-3 h-7 border transition-all ${filter === s ? "border-accent bg-accent text-accent-foreground" : "border-border/40 text-[#2D2926] hover:text-foreground"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-[#2D2926]">Loading…</p>
      ) : !filtered.length ? (
        <p className="text-xs text-[#2D2926]">No orders {filter !== "all" ? `with status "${filter}"` : "yet"}.</p>
      ) : (
        <div className="divide-y divide-border/30">
          {filtered.map((o) => (
            <div key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-serif text-sm text-foreground">{o.name}</span>
                  <Badge status={o.status} />
                  {o.occasion === "gift" && <span className="text-[9px] tracking-widest uppercase text-[#2D2926] border border-border/30 px-2 py-0.5">Gift</span>}
                </div>
                <p className="text-xs text-[#2D2926]">
                  {o.phone}&nbsp;·&nbsp;{o.qty} {o.qty === 1 ? "box" : "boxes"}&nbsp;·&nbsp;₹{o.totalAmount.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-[#2D2926] mt-0.5 leading-relaxed">{o.address}</p>
                {o.giftMessage && <p className="text-xs text-[#2D2926] mt-0.5 italic">"{o.giftMessage}"</p>}
                <p className="text-[10px] text-[#2D2926] mt-1">{new Date(o.createdAt).toLocaleString("en-IN")}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)}
                  className="h-8 border border-border/50 bg-background text-foreground text-xs px-2 focus:outline-none">
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

// ── Site Mode Tab ──────────────────────────────────────────────────────────────

const SITE_MODES = [
  {
    id: "bake_day",
    label: "Bake Day",
    description: "Full menu visible. Order Now buttons active. Orders open for the current bake window.",
  },
  {
    id: "popup",
    label: "Pop-Up Mode",
    description: "Hides the order form. Shows: 'We are at a private residential pop-up this week! Online orders are closed, but we'll be back next week.'",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    description: "Shows a holding message: 'Baking in progress — check back soon.'",
  },
  {
    id: "chef_on_break",
    label: "Chef on Break",
    description: "Shows a warm, personal pause message: the chef is recharging and will return inspired. Orders are hidden.",
  },
  {
    id: "small_only",
    label: "Small Menu",
    description: "Orders stay open but the Big Box is hidden. Only Small Wandering Box and Artisanal Sourdough Boule are available to order.",
  },
] as const;

function SiteModeTab({ token }: { token: string }) {
  const { data: settings, loading } = useAdminFetch<Setting[]>(`${API}/admin/settings`, token);
  const [selected, setSelected] = useState<string>("bake_day");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      const modeSetting = settings.find(s => s.key === "site_mode");
      if (modeSetting) setSelected(modeSetting.value);
    }
  }, [settings]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const res = await apiCall(`${API}/admin/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ key: "site_mode", value: selected }),
    });
    setSaving(false);
    if (!res.ok) { setError(res.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-foreground mb-2">Site Status</h2>
      <p className="text-xs text-[#2D2926] mb-6 leading-relaxed">Controls what visitors see on the homepage and Pre-order page. Changes take effect immediately after saving.</p>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      {loading ? (
        <p className="text-xs text-[#2D2926]">Loading…</p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {SITE_MODES.map(mode => (
              <button key={mode.id} onClick={() => setSelected(mode.id)}
                className={`w-full text-left p-5 border transition-all duration-150 ${selected === mode.id ? "border-accent bg-accent/5" : "border-border/40 hover:border-foreground/25"}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-colors ${selected === mode.id ? "border-accent bg-accent" : "border-border/50"}`} />
                  <div>
                    <p className={`text-sm font-medium mb-1 ${selected === mode.id ? "text-foreground" : "text-[#2D2926]"}`}>{mode.label}</p>
                    <p className="text-xs text-[#2D2926] leading-relaxed">{mode.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="border border-border/25 p-4 mb-6 bg-muted/20">
            <p className="text-[10px] tracking-[0.18em] uppercase font-medium text-[#2D2926] mb-1">Sold Out — Automatic</p>
            <p className="text-xs text-[#2D2926] leading-relaxed">When confirmed + pending orders for the active bake window reach the Max Boxes limit, the site automatically shows a sold-out message. No manual action needed.</p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="text-xs tracking-[0.18em] uppercase font-medium px-8 h-10 bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-40">
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save Mode"}
          </button>
        </>
      )}
    </div>
  );
}

// ── Settings Tab ───────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: { key: string; label: string; placeholder: string }[] = [
  { key: "strip_message", label: "Info Strip Message (overrides auto-generated)", placeholder: "Leave blank to auto-generate from live bake window" },
  { key: "strip_enabled", label: "Info Strip Enabled (true/false)", placeholder: "true" },
  { key: "delivery_zone", label: "Delivery Zone", placeholder: "Free delivery within 7km of HSR Layout, Bengaluru" },
  { key: "upi_id", label: "UPI ID (your VPA, e.g. name@bank)", placeholder: "yourname@bank" },
  { key: "gift_price", label: "Gifting Box Price (₹)", placeholder: "1299" },
  { key: "gift_original_price", label: "Gifting Box Original Price / Strikethrough (₹)", placeholder: "1999" },
];

const PRODUCT_LIMIT_SETTINGS: { key: string; label: string; placeholder: string }[] = [
  { key: "max_small_boxes", label: "Small Wandering Box — max per drop (0 = sold out)", placeholder: "99" },
  { key: "max_sourdough_boules", label: "Artisanal Sourdough Boule — max per drop (0 = sold out)", placeholder: "99" },
];

function SettingsTab({ token }: { token: string }) {
  const { data: settings, loading, refetch } = useAdminFetch<Setting[]>(`${API}/admin/settings`, token);
  const { data: windows, refetch: refetchWindows } = useAdminFetch<BakeWindow[]>(`${API}/admin/bake-windows`, token);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bigBoxMax, setBigBoxMax] = useState("");
  const [savingBigBox, setSavingBigBox] = useState(false);
  const [bigBoxSaved, setBigBoxSaved] = useState(false);

  const activeWindow = windows?.find(w => w.status === "announced") ?? windows?.[0] ?? null;

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      for (const s of settings) map[s.key] = s.value;
      setValues(map);
    }
  }, [settings]);

  useEffect(() => {
    if (activeWindow) setBigBoxMax(String(activeWindow.maxBoxes));
  }, [activeWindow?.id, activeWindow?.maxBoxes]);

  async function handleSave(key: string) {
    setSaving(key);
    const res = await apiCall(`${API}/admin/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ key, value: values[key] ?? "" }),
    });
    setSaving(null);
    if (!res.ok) { setError(res.message); return; }
    refetch();
  }

  async function handleSaveBigBoxMax() {
    if (!activeWindow) return;
    const n = parseInt(bigBoxMax, 10);
    if (isNaN(n) || n < 0) return;
    setSavingBigBox(true);
    const res = await apiCall(`${API}/admin/bake-windows/${activeWindow.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ maxBoxes: n }),
    });
    setSavingBigBox(false);
    if (!res.ok) { setError((res as { ok: false; message: string }).message); return; }
    setBigBoxSaved(true);
    setTimeout(() => setBigBoxSaved(false), 3000);
    refetchWindows();
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-foreground mb-2">Site Settings</h2>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* ── Pre-order Product Limits ───────────────────────────── */}
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.28em] uppercase font-medium text-[#2D2926] mb-1">Pre-order Product Limits</p>
        <p className="text-xs text-[#2D2926] mb-5 leading-relaxed">
          Control how many of each product can be ordered per drop. Set to 0 to show as sold out on the Pre-order page.
        </p>
        {loading ? (
          <p className="text-xs text-[#2D2926]">Loading…</p>
        ) : (
          <div className="space-y-4">
            {/* Big Box — wired to active bake window */}
            <div>
              <label className="text-[10px] tracking-[0.22em] uppercase font-medium text-[#2D2926] block mb-1.5">
                Wandering Box — max per drop
                {activeWindow && (
                  <span className="ml-2 text-[9px] font-normal normal-case tracking-normal"
                    style={{ color: "rgba(45,41,38,0.45)" }}>
                    (from active window: {activeWindow.label})
                  </span>
                )}
              </label>
              {activeWindow ? (
                <div className="flex gap-3">
                  <input
                    type="number" min={0} value={bigBoxMax}
                    onChange={e => setBigBoxMax(e.target.value)}
                    placeholder="15"
                    className="w-32 h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent transition-colors"
                  />
                  <button onClick={handleSaveBigBoxMax} disabled={savingBigBox}
                    className="text-xs tracking-[0.18em] uppercase font-medium px-5 h-10 bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-40">
                    {savingBigBox ? "Saving…" : bigBoxSaved ? "Saved ✓" : "Save"}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-[#2D2926] italic">
                  No bake window found. Create or set one to "announced" in the Bake Windows tab.
                </p>
              )}
            </div>

            {/* Small Box + Sourdough — site_settings */}
            {PRODUCT_LIMIT_SETTINGS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-[10px] tracking-[0.22em] uppercase font-medium text-[#2D2926] block mb-1.5">{label}</label>
                <div className="flex gap-3">
                  <input
                    type="number" min={0} value={values[key] ?? ""} placeholder={placeholder}
                    onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                    className="w-32 h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent transition-colors"
                  />
                  <button onClick={() => handleSave(key)} disabled={saving === key}
                    className="text-xs tracking-[0.18em] uppercase font-medium px-5 h-10 bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-40">
                    {saving === key ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── General Settings ──────────────────────────────────── */}
      <p className="text-[10px] tracking-[0.28em] uppercase font-medium text-[#2D2926] mb-1">General Settings</p>
      <p className="text-xs text-[#2D2926] mb-5 leading-relaxed">The info strip message auto-generates from the live bake window. Override it here if needed.</p>
      {loading ? (
        <p className="text-xs text-[#2D2926]">Loading…</p>
      ) : (
        <div className="space-y-6">
          {DEFAULT_SETTINGS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-[10px] tracking-[0.22em] uppercase font-medium text-[#2D2926] block mb-1.5">{label}</label>
              <div className="flex gap-3">
                <input value={values[key] ?? ""} onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} placeholder={placeholder}
                  className="flex-1 h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent transition-colors" />
                <button onClick={() => handleSave(key)} disabled={saving === key}
                  className="text-xs tracking-[0.18em] uppercase font-medium px-5 h-10 bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-40">
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

// ── Image upload helper ────────────────────────────────────────────────────────

async function uploadImage(file: File, endpoint: string, token: string): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];
        const res = await fetch(endpoint, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-admin-token": token },
          body: JSON.stringify({ base64, contentType: file.type }),
        });
        if (!res.ok) { resolve(null); return; }
        const data = await res.json();
        resolve(data.objectPath ?? null);
      } catch { resolve(null); }
    };
    reader.readAsDataURL(file);
  });
}

// ── Archive Tab ────────────────────────────────────────────────────────────────

type LaunchItem = { id: number; launchId: number; name: string; description: string | null; imageFilename: string | null; position: number };
type Launch = { id: number; slug: string; title: string; bakeDate: string; notes: string | null; items: LaunchItem[] };

function LaunchItemsPanel({ launchId, items, token, onRefetch }: { launchId: number; items: LaunchItem[]; token: string; onRefetch: () => void }) {
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    if (!newName.trim()) return;
    setAdding(true);
    const res = await apiCall(`${API}/admin/launches/${launchId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ name: newName.trim(), description: newDesc.trim() || null, position: items.length }),
    });
    setAdding(false);
    if (!res.ok) { setError(res.message); return; }
    setNewName(""); setNewDesc("");
    onRefetch();
  }

  async function handleSaveEdit(id: number) {
    const res = await apiCall(`${API}/admin/launch-items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ name: editName.trim(), description: editDesc.trim() || null }),
    });
    if (!res.ok) { setError(res.message); return; }
    setEditId(null); onRefetch();
  }

  async function handleDelete(id: number) {
    if (!confirm("Remove this item?")) return;
    const res = await apiCall(`${API}/admin/launch-items/${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    if (!res.ok) { setError(res.message); return; }
    onRefetch();
  }

  async function handleImageUpload(id: number, file: File) {
    setUploadingId(id);
    await uploadImage(file, `${API}/admin/launch-items/${id}/image`, token);
    setUploadingId(null);
    onRefetch();
  }

  function getImageSrc(imageFilename: string | null): string | null {
    if (!imageFilename) return null;
    if (imageFilename.startsWith("/objects/")) return `${API.replace("/api", "")}/api/storage${imageFilename}`;
    return `/images/${imageFilename}`;
  }

  return (
    <div className="mt-4 border-t border-border/25 pt-4">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      <p className="text-[9px] tracking-[0.28em] uppercase font-medium text-[#2D2926] mb-3">Items ({items.length})</p>
      {items.length > 0 && (
        <div className="space-y-2 mb-4">
          {items.map((item, i) => (
            <div key={item.id} className="flex items-start gap-3 group">
              <span className="text-[9px] text-[#2D2926] font-medium w-4 mt-1 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex-shrink-0">
                {getImageSrc(item.imageFilename) ? (
                  <img src={getImageSrc(item.imageFilename)!} alt={item.name} className="w-10 h-10 object-cover rounded-sm" />
                ) : (
                  <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ background: "rgba(15,36,25,0.06)" }}>
                    <span className="text-[9px] text-[#2D2926]">IMG</span>
                  </div>
                )}
              </div>
              {editId === item.id ? (
                <div className="flex-1 flex flex-col gap-2">
                  <input value={editName} onChange={e => setEditName(e.target.value)}
                    className="w-full h-8 border border-border/50 bg-background text-foreground text-xs px-2 focus:outline-none focus:border-accent" />
                  <input value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Description (optional)"
                    className="w-full h-8 border border-border/50 bg-background text-foreground text-xs px-2 focus:outline-none focus:border-accent" />
                  <div className="flex gap-2">
                    <button onClick={() => handleSaveEdit(item.id)} className="text-[10px] tracking-widest uppercase px-3 h-7 bg-accent text-accent-foreground">Save</button>
                    <button onClick={() => setEditId(null)} className="text-[10px] tracking-widest uppercase px-3 h-7 border border-border/40 text-[#2D2926]">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-foreground leading-snug">{item.name}</p>
                    {item.description && <p className="text-[11px] text-[#2D2926]">{item.description}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="text-[9px] tracking-widest uppercase px-2 h-6 border border-border/40 text-[#2D2926] hover:text-foreground hover:border-foreground/50 transition-all cursor-pointer flex items-center">
                      {uploadingId === item.id ? "…" : "Img"}
                      <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(item.id, e.target.files[0])} />
                    </label>
                    <button onClick={() => { setEditId(item.id); setEditName(item.name); setEditDesc(item.description ?? ""); }}
                      className="text-[9px] tracking-widest uppercase px-2 h-6 border border-border/40 text-[#2D2926] hover:text-foreground hover:border-foreground/50 transition-all">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)}
                      className="text-[9px] tracking-widest uppercase px-2 h-6 border border-red-300/30 text-red-400/50 hover:text-red-400 hover:border-red-400/50 transition-all">
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Item name"
          className="flex-1 h-8 border border-border/40 bg-background text-foreground text-xs px-2 focus:outline-none focus:border-accent"
          onKeyDown={e => e.key === "Enter" && handleAdd()} />
        <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description (optional)"
          className="flex-1 h-8 border border-border/40 bg-background text-foreground text-xs px-2 focus:outline-none focus:border-accent"
          onKeyDown={e => e.key === "Enter" && handleAdd()} />
        <button onClick={handleAdd} disabled={adding || !newName.trim()}
          className="text-[10px] tracking-[0.18em] uppercase font-medium px-4 h-8 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-30">
          {adding ? "Adding…" : "+ Add"}
        </button>
      </div>
    </div>
  );
}

function ArchiveTab({ token }: { token: string }) {
  const { data: launches, loading, refetch } = useAdminFetch<Launch[]>(`${API}/admin/launches`, token);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", bakeDate: "", slug: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: "", bakeDate: "", slug: "", notes: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (launches) {
      setOpenItems(prev => {
        const autoOpen: Record<number, boolean> = {};
        launches.forEach(l => { if (l.items.length === 0) autoOpen[l.id] = true; });
        return { ...autoOpen, ...prev };
      });
    }
  }, [launches]);

  function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

  async function handleEditSave(id: number) {
    setSaving(true);
    const res = await apiCall(`${API}/admin/launches/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify(editForm),
    });
    setSaving(false);
    if (!res.ok) { setError(res.message); return; }
    setEditId(null);
    refetch();
  }

  async function handleCreate() {
    setSaving(true);
    const res = await apiCall(`${API}/admin/launches`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ ...form, slug: form.slug || slugify(form.title) }),
    });
    setSaving(false);
    if (!res.ok) { setError(res.message); return; }
    setCreating(false);
    setForm({ title: "", bakeDate: "", slug: "", notes: "" });
    refetch();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this launch and all its items?")) return;
    const res = await apiCall(`${API}/admin/launches/${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    if (!res.ok) { setError(res.message); return; }
    refetch();
  }

  return (
    <div>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-xl text-foreground">Archive — Launches</h2>
          <p className="text-xs text-[#2D2926] mt-1">Each launch is a bake day. Items inside show on the public archive page with ratings.</p>
        </div>
        <button onClick={() => setCreating(true)}
          className="text-xs tracking-[0.18em] uppercase font-medium px-5 h-9 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all">
          + New Launch
        </button>
      </div>

      <AnimatePresence>
        {creating && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="border border-border/50 p-6 mb-6 bg-muted/30">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#2D2926] mb-5">New Launch</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Bake Day #1 — March"
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Bake Date</label>
                <input type="date" value={form.bakeDate} onChange={e => setForm(f => ({ ...f, bakeDate: e.target.value }))}
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Slug (URL)</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder={`auto: ${form.title ? slugify(form.title) : "bake-day-1"}`}
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Notes</label>
                <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional note shown on archive"
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreate} disabled={saving || !form.title || !form.bakeDate}
                className="text-xs tracking-[0.18em] uppercase font-medium px-6 h-9 bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-40">
                {saving ? "Saving…" : "Create"}
              </button>
              <button onClick={() => setCreating(false)}
                className="text-xs tracking-[0.18em] uppercase font-medium px-6 h-9 border border-border/50 text-[#2D2926] hover:text-foreground transition-all">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-xs text-[#2D2926]">Loading…</p>
      ) : !launches?.length ? (
        <p className="text-xs text-[#2D2926]">No launches yet. Create one to start building the archive.</p>
      ) : (
        <div className="divide-y divide-border/30">
          {launches.map((l) => (
            <div key={l.id} className="py-5">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm text-foreground">{l.title}</p>
                  <p className="text-xs text-[#2D2926] mt-0.5">
                    {new Date(l.bakeDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    &nbsp;·&nbsp;{l.items.length} {l.items.length === 1 ? "item" : "items"}
                    {l.notes && <>&nbsp;·&nbsp;<span className="italic">{l.notes}</span></>}
                  </p>
                </div>
                <button onClick={() => { setEditId(editId === l.id ? null : l.id); setEditForm({ title: l.title, bakeDate: l.bakeDate, slug: l.slug, notes: l.notes ?? "" }); }}
                  className={`text-[10px] tracking-widest uppercase px-3 h-8 border transition-all ${editId === l.id ? "border-accent text-accent" : "border-border/40 text-[#2D2926] hover:text-foreground hover:border-foreground/50"}`}>
                  Edit
                </button>
                <button onClick={() => setOpenItems(s => ({ ...s, [l.id]: !s[l.id] }))}
                  className={`text-[10px] tracking-widest uppercase px-3 h-8 border transition-all ${openItems[l.id] ? "border-accent text-accent" : "border-border/40 text-[#2D2926] hover:text-foreground hover:border-foreground/50"}`}>
                  Items {openItems[l.id] ? "▲" : "▼"}
                </button>
                <button onClick={() => handleDelete(l.id)}
                  className="text-[10px] tracking-widest uppercase px-3 h-8 border border-red-300/30 text-red-400/60 hover:text-red-400 hover:border-red-400/50 transition-all">
                  Del
                </button>
              </div>

              <AnimatePresence>
                {editId === l.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden">
                    <div className="mt-3 p-4 border border-border/30 bg-muted/20 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(["title", "bakeDate", "slug", "notes"] as const).map(field => (
                        <div key={field}>
                          <label className="text-[10px] tracking-[0.2em] uppercase text-[#2D2926] block mb-1">{field === "bakeDate" ? "Bake Date" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                          <input type={field === "bakeDate" ? "date" : "text"} value={editForm[field]}
                            onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                            className="w-full h-8 border border-border/40 bg-background text-foreground text-xs px-2 focus:outline-none focus:border-accent" />
                        </div>
                      ))}
                      <div className="sm:col-span-2 flex gap-2 justify-end">
                        <button onClick={() => setEditId(null)}
                          className="text-[10px] tracking-widest uppercase px-4 h-8 border border-border/40 text-[#2D2926] hover:text-foreground transition-all">
                          Cancel
                        </button>
                        <button onClick={() => handleEditSave(l.id)} disabled={saving}
                          className="text-[10px] tracking-[0.18em] uppercase font-medium px-5 h-8 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-40">
                          {saving ? "Saving…" : "Save"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {openItems[l.id] && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                    className="overflow-hidden">
                    <LaunchItemsPanel launchId={l.id} items={l.items} token={token} onRefetch={refetch} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Recipes Tab ────────────────────────────────────────────────────────────────

type AdminRecipe = {
  id: number; title: string; subtitle: string | null; tags: string | null;
  body: string; serves: string | null; time: string | null;
  youtubeUrl: string | null; imageFilename: string | null; position: number;
};

function RecipesTab({ token }: { token: string }) {
  const { data: recipes, loading, refetch } = useAdminFetch<AdminRecipe[]>(`${API}/admin/recipes`, token);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", tags: "", body: "", serves: "", time: "", youtubeUrl: "", position: 0 });
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function resetForm() { setForm({ title: "", subtitle: "", tags: "", body: "", serves: "", time: "", youtubeUrl: "", position: 0 }); }

  function loadIntoForm(r: AdminRecipe) {
    setForm({ title: r.title, subtitle: r.subtitle ?? "", tags: r.tags ?? "", body: r.body, serves: r.serves ?? "", time: r.time ?? "", youtubeUrl: r.youtubeUrl ?? "", position: r.position });
  }

  async function handleCreate() {
    setSaving(true);
    const res = await apiCall(`${API}/admin/recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ ...form, subtitle: form.subtitle || null, tags: form.tags || null, serves: form.serves || null, time: form.time || null, youtubeUrl: form.youtubeUrl || null }),
    });
    setSaving(false);
    if (!res.ok) { setError(res.message); return; }
    setCreating(false); resetForm(); refetch();
  }

  async function handleUpdate() {
    if (!editId) return;
    setSaving(true);
    const res = await apiCall(`${API}/admin/recipes/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ ...form, subtitle: form.subtitle || null, tags: form.tags || null, serves: form.serves || null, time: form.time || null, youtubeUrl: form.youtubeUrl || null }),
    });
    setSaving(false);
    if (!res.ok) { setError(res.message); return; }
    setEditId(null); resetForm(); refetch();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this recipe?")) return;
    const res = await apiCall(`${API}/admin/recipes/${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    if (!res.ok) { setError(res.message); return; }
    refetch();
  }

  async function handleImageUpload(id: number, file: File) {
    setUploadingId(id);
    await uploadImage(file, `${API}/admin/recipes/${id}/image`, token);
    setUploadingId(null); refetch();
  }

  const isEditing = creating || editId !== null;

  return (
    <div>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-xl text-foreground">Recipes</h2>
          <p className="text-xs text-[#2D2926] mt-1">Manage recipes shown on the public Recipes page. Tags are comma-separated.</p>
        </div>
        {!isEditing && (
          <button onClick={() => { setCreating(true); setEditId(null); resetForm(); }}
            className="text-xs tracking-[0.18em] uppercase font-medium px-5 h-9 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all">
            + New Recipe
          </button>
        )}
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="border border-border/50 p-6 mb-6 bg-muted/30">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#2D2926] mb-5">{editId ? "Edit Recipe" : "New Recipe"}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Recipe title"
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Subtitle</label>
                <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="e.g. Inspired by Paragon Restaurant, Kozhikode"
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Tags (comma-separated)</label>
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. Kerala, Seafood, Curry"
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">YouTube URL</label>
                <input value={form.youtubeUrl} onChange={e => setForm(f => ({ ...f, youtubeUrl: e.target.value }))} placeholder="https://youtu.be/..."
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Serves</label>
                <input value={form.serves} onChange={e => setForm(f => ({ ...f, serves: e.target.value }))} placeholder="e.g. 4"
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Time</label>
                <input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="e.g. 45 min"
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Position (sort order)</label>
                <input type="number" value={form.position} onChange={e => setForm(f => ({ ...f, position: Number(e.target.value) }))}
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Recipe Body *</label>
              <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={10}
                placeholder="INGREDIENTS&#10;&#10;...&#10;&#10;METHOD&#10;&#10;01. ..."
                className="w-full border border-border/50 bg-background text-foreground text-xs px-3 py-2 focus:outline-none focus:border-accent resize-y font-mono" />
            </div>
            <div className="flex gap-3">
              <button onClick={editId ? handleUpdate : handleCreate} disabled={saving || !form.title}
                className="text-xs tracking-[0.18em] uppercase font-medium px-6 h-9 bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-40">
                {saving ? "Saving…" : editId ? "Update" : "Create"}
              </button>
              <button onClick={() => { setCreating(false); setEditId(null); resetForm(); }}
                className="text-xs tracking-[0.18em] uppercase font-medium px-6 h-9 border border-border/50 text-[#2D2926] hover:text-foreground transition-all">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-xs text-[#2D2926]">Loading…</p>
      ) : !recipes?.length ? (
        <p className="text-xs text-[#2D2926]">No recipes yet. Create one above.</p>
      ) : (
        <div className="divide-y divide-border/30">
          {recipes.map((r) => (
            <div key={r.id} className="py-4 flex items-start gap-4">
              {r.imageFilename ? (
                <img
                  src={r.imageFilename.startsWith("/objects/") ? `/api/storage${r.imageFilename}` : `/images/${r.imageFilename}`}
                  alt={r.title}
                  className="w-12 h-12 object-cover rounded-sm flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-sm flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(15,36,25,0.06)" }}>
                  <span className="text-[9px] text-[#2D2926]">IMG</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-serif text-sm text-foreground">{r.title}</p>
                {r.subtitle && <p className="text-xs text-[#2D2926]">{r.subtitle}</p>}
                <div className="flex flex-wrap gap-2 mt-1">
                  {r.tags && r.tags.split(",").map(t => t.trim()).filter(Boolean).map(tag => (
                    <span key={tag} className="text-[9px] tracking-[0.15em] uppercase px-1.5 py-0.5" style={{ background: "rgba(15,36,25,0.06)", color: "rgba(15,36,25,0.4)" }}>{tag}</span>
                  ))}
                  {r.youtubeUrl && <span className="text-[9px] tracking-[0.15em] uppercase px-1.5 py-0.5" style={{ background: "rgba(255,0,0,0.06)", color: "rgba(200,0,0,0.5)" }}>YouTube</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <label className="text-[10px] tracking-widest uppercase px-3 h-8 border border-border/40 text-[#2D2926] hover:text-foreground hover:border-foreground/50 transition-all cursor-pointer flex items-center">
                  {uploadingId === r.id ? "…" : "Image"}
                  <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(r.id, e.target.files[0])} />
                </label>
                <button onClick={() => { setEditId(r.id); setCreating(false); loadIntoForm(r); }}
                  className="text-[10px] tracking-widest uppercase px-3 h-8 border border-border/40 text-[#2D2926] hover:text-foreground hover:border-foreground/50 transition-all">
                  Edit
                </button>
                <button onClick={() => handleDelete(r.id)}
                  className="text-[10px] tracking-widest uppercase px-3 h-8 border border-red-300/30 text-red-400/60 hover:text-red-400 hover:border-red-400/50 transition-all">
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Reviews Tab ────────────────────────────────────────────────────────────────

type AdminTestimonial = {
  id: number; authorName: string; location: string | null;
  body: string; visible: boolean; position: number; createdAt: string;
};

function ReviewsTab({ token }: { token: string }) {
  const { data: testimonials, loading, refetch } = useAdminFetch<AdminTestimonial[]>(`${API}/admin/testimonials`, token);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ authorName: "", location: "", body: "", visible: true, position: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() { setForm({ authorName: "", location: "", body: "", visible: true, position: 0 }); }

  function loadIntoForm(t: AdminTestimonial) {
    setForm({ authorName: t.authorName, location: t.location ?? "", body: t.body, visible: t.visible, position: t.position });
  }

  async function handleCreate() {
    setSaving(true);
    const res = await apiCall(`${API}/admin/testimonials`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ ...form, location: form.location || null }),
    });
    setSaving(false);
    if (!res.ok) { setError(res.message); return; }
    setCreating(false); resetForm(); refetch();
  }

  async function handleUpdate() {
    if (!editId) return;
    setSaving(true);
    const res = await apiCall(`${API}/admin/testimonials/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ ...form, location: form.location || null }),
    });
    setSaving(false);
    if (!res.ok) { setError(res.message); return; }
    setEditId(null); resetForm(); refetch();
  }

  async function handleToggleVisible(t: AdminTestimonial) {
    const res = await apiCall(`${API}/admin/testimonials/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ visible: !t.visible }),
    });
    if (!res.ok) { setError(res.message); return; }
    refetch();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this review?")) return;
    const res = await apiCall(`${API}/admin/testimonials/${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    if (!res.ok) { setError(res.message); return; }
    refetch();
  }

  const isEditing = creating || editId !== null;

  return (
    <div>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-xl text-foreground">Reviews</h2>
          <p className="text-xs text-[#2D2926] mt-1">Manage customer reviews shown on the homepage. Toggle visibility without deleting.</p>
        </div>
        {!isEditing && (
          <button onClick={() => { setCreating(true); setEditId(null); resetForm(); }}
            className="text-xs tracking-[0.18em] uppercase font-medium px-5 h-9 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all">
            + New Review
          </button>
        )}
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="border border-border/50 p-6 mb-6 bg-muted/30">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#2D2926] mb-5">{editId ? "Edit Review" : "New Review"}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Customer name *</label>
                <input value={form.authorName} onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))} placeholder="e.g. Priya S."
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Location (optional)</label>
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. HSR Layout, Bengaluru"
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Position (sort order)</label>
                <input type="number" value={form.position} onChange={e => setForm(f => ({ ...f, position: Number(e.target.value) }))}
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div className="flex items-center gap-3 pt-5">
                <input type="checkbox" id="visible-check" checked={form.visible} onChange={e => setForm(f => ({ ...f, visible: e.target.checked }))}
                  className="w-4 h-4 accent-accent" />
                <label htmlFor="visible-check" className="text-[10px] tracking-widest uppercase text-[#2D2926] cursor-pointer">Visible on site</label>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Review text *</label>
              <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={4}
                placeholder="What the customer said…"
                className="w-full border border-border/50 bg-background text-foreground text-xs px-3 py-2 focus:outline-none focus:border-accent resize-y" />
            </div>
            <div className="flex gap-3">
              <button onClick={editId ? handleUpdate : handleCreate} disabled={saving || !form.authorName || !form.body}
                className="text-xs tracking-[0.18em] uppercase font-medium px-6 h-9 bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-40">
                {saving ? "Saving…" : editId ? "Update" : "Create"}
              </button>
              <button onClick={() => { setCreating(false); setEditId(null); resetForm(); }}
                className="text-xs tracking-[0.18em] uppercase font-medium px-6 h-9 border border-border/50 text-[#2D2926] hover:text-foreground transition-all">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-xs text-[#2D2926]">Loading…</p>
      ) : !testimonials?.length ? (
        <p className="text-xs text-[#2D2926]">No reviews yet. Add one above.</p>
      ) : (
        <div className="divide-y divide-border/30">
          {testimonials.map((t) => (
            <div key={t.id} className="py-4 flex items-start gap-4">
              <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center border border-border/30 text-[10px] text-[#2D2926] font-medium">
                {t.position}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif text-sm text-foreground italic leading-snug mb-1">"{t.body}"</p>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#2D2926]">
                  {t.authorName}{t.location ? ` · ${t.location}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleToggleVisible(t)}
                  className={`text-[9px] tracking-widest uppercase px-3 h-8 border transition-all ${t.visible ? "border-green-400/40 text-green-600/70 hover:border-green-400/70" : "border-border/30 text-[#2D2926] hover:border-foreground/40"}`}>
                  {t.visible ? "Visible" : "Hidden"}
                </button>
                <button onClick={() => { setEditId(t.id); setCreating(false); loadIntoForm(t); }}
                  className="text-[10px] tracking-widest uppercase px-3 h-8 border border-border/40 text-[#2D2926] hover:text-foreground hover:border-foreground/50 transition-all">
                  Edit
                </button>
                <button onClick={() => handleDelete(t.id)}
                  className="text-[10px] tracking-widest uppercase px-3 h-8 border border-red-300/30 text-red-400/60 hover:text-red-400 hover:border-red-400/50 transition-all">
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Bakery Add-Ons Tab ─────────────────────────────────────────────────────────

type AdminAddon = {
  id: number; title: string; description: string | null; pricePaise: number;
  imageUrl: string | null; available: boolean; preorderCloseDate: string | null; createdAt: string;
};

function formatPaise(p: number) { return `₹${(p / 100).toLocaleString("en-IN")}`; }

function BakeryAddOnsTab({ token }: { token: string }) {
  const { data: addons, loading, refetch } = useAdminFetch<AdminAddon[]>(`${API}/admin/bakery-addons`, token);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", pricePaise: 0, imageUrl: "", available: true, preorderCloseDate: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() { setForm({ title: "", description: "", pricePaise: 0, imageUrl: "", available: true, preorderCloseDate: "" }); }
  function loadIntoForm(a: AdminAddon) {
    setForm({ title: a.title, description: a.description ?? "", pricePaise: a.pricePaise, imageUrl: a.imageUrl ?? "", available: a.available, preorderCloseDate: a.preorderCloseDate ?? "" });
  }

  function buildBody() {
    return {
      title: form.title, description: form.description || null,
      pricePaise: form.pricePaise, imageUrl: form.imageUrl || null,
      available: form.available, preorderCloseDate: form.preorderCloseDate || null,
    };
  }

  async function handleCreate() {
    setSaving(true);
    const res = await apiCall(`${API}/admin/bakery-addons`, { method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify(buildBody()) });
    setSaving(false);
    if (!res.ok) { setError(res.message); return; }
    setCreating(false); resetForm(); refetch();
  }

  async function handleUpdate() {
    if (!editId) return;
    setSaving(true);
    const res = await apiCall(`${API}/admin/bakery-addons/${editId}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify(buildBody()) });
    setSaving(false);
    if (!res.ok) { setError(res.message); return; }
    setEditId(null); resetForm(); refetch();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this add-on?")) return;
    const res = await apiCall(`${API}/admin/bakery-addons/${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    if (!res.ok) { setError(res.message); return; }
    refetch();
  }

  async function handleToggle(a: AdminAddon) {
    const res = await apiCall(`${API}/admin/bakery-addons/${a.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify({ available: !a.available }) });
    if (!res.ok) { setError(res.message); return; }
    refetch();
  }

  const isEditing = creating || editId !== null;

  return (
    <div>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-xl text-foreground">Bakery Add-Ons</h2>
          <p className="text-xs text-[#2D2926] mt-1">Standalone products available alongside the bake window. Displayed on the Bakery page.</p>
        </div>
        {!isEditing && (
          <button onClick={() => { setCreating(true); setEditId(null); resetForm(); }}
            className="text-xs tracking-[0.18em] uppercase font-medium px-5 h-9 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all">
            + New Add-On
          </button>
        )}
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="border border-border/50 p-6 mb-6 bg-muted/30">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#2D2926] mb-5">{editId ? "Edit Add-On" : "New Add-On"}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Artisanal Sourdough Boule"
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                  placeholder="Short product description"
                  className="w-full border border-border/50 bg-background text-foreground text-xs px-3 py-2 focus:outline-none focus:border-accent resize-y" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Price (in paise) *</label>
                <input type="number" value={form.pricePaise} onChange={e => setForm(f => ({ ...f, pricePaise: Number(e.target.value) }))}
                  placeholder="e.g. 26000 = ₹260"
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
                {form.pricePaise > 0 && <p className="text-[10px] text-[#2D2926] mt-1">= {formatPaise(form.pricePaise)}</p>}
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Pre-order Close Date</label>
                <input type="date" value={form.preorderCloseDate} onChange={e => setForm(f => ({ ...f, preorderCloseDate: e.target.value }))}
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Image URL (or /images/filename.jpg)</label>
                <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="/images/addon-sourdough-boule.png"
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="addon-available" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))}
                  className="w-4 h-4 accent-accent" />
                <label htmlFor="addon-available" className="text-[10px] tracking-widest uppercase text-[#2D2926] cursor-pointer">Available for order</label>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={editId ? handleUpdate : handleCreate} disabled={saving || !form.title || !form.pricePaise}
                className="text-xs tracking-[0.18em] uppercase font-medium px-6 h-9 bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-40">
                {saving ? "Saving…" : editId ? "Update" : "Create"}
              </button>
              <button onClick={() => { setCreating(false); setEditId(null); resetForm(); }}
                className="text-xs tracking-[0.18em] uppercase font-medium px-6 h-9 border border-border/50 text-[#2D2926] hover:text-foreground transition-all">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-xs text-[#2D2926]">Loading…</p>
      ) : !addons?.length ? (
        <p className="text-xs text-[#2D2926]">No add-ons yet. Create one above.</p>
      ) : (
        <div className="divide-y divide-border/30">
          {addons.map(a => (
            <div key={a.id} className="py-4 flex items-start gap-4">
              {a.imageUrl ? (
                <img src={a.imageUrl.startsWith("/images/") ? a.imageUrl : a.imageUrl} alt={a.title} className="w-12 h-12 object-cover rounded-sm flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-sm flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(15,36,25,0.06)" }}>
                  <span className="text-[9px] text-[#2D2926]">IMG</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-serif text-sm text-foreground">{a.title}</p>
                <p className="text-xs text-[#2D2926]">{formatPaise(a.pricePaise)}</p>
                {a.description && <p className="text-[10px] text-[#2D2926] mt-0.5 truncate">{a.description}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleToggle(a)}
                  className={`text-[9px] tracking-widest uppercase px-3 h-8 border transition-all ${a.available ? "border-green-400/40 text-green-600/70 hover:border-green-400/70" : "border-border/30 text-[#2D2926] hover:border-foreground/40"}`}>
                  {a.available ? "Available" : "Hidden"}
                </button>
                <button onClick={() => { setEditId(a.id); setCreating(false); loadIntoForm(a); }}
                  className="text-[10px] tracking-widest uppercase px-3 h-8 border border-border/40 text-[#2D2926] hover:text-foreground hover:border-foreground/50 transition-all">
                  Edit
                </button>
                <button onClick={() => handleDelete(a.id)}
                  className="text-[10px] tracking-widest uppercase px-3 h-8 border border-red-300/30 text-red-400/60 hover:text-red-400 hover:border-red-400/50 transition-all">
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Journal Tab ────────────────────────────────────────────────────────────────

type AdminJournalEvent = {
  id: number; title: string; body: string | null; mediaUrls: string[] | null;
  embedUrl: string | null; eventDate: string | null; published: boolean; createdAt: string;
};

function JournalTab({ token }: { token: string }) {
  const { data: events, loading, refetch } = useAdminFetch<AdminJournalEvent[]>(`${API}/admin/journal`, token);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", body: "", mediaUrlsRaw: "", embedUrl: "", eventDate: "", published: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() { setForm({ title: "", body: "", mediaUrlsRaw: "", embedUrl: "", eventDate: "", published: false }); }
  function loadIntoForm(e: AdminJournalEvent) {
    setForm({ title: e.title, body: e.body ?? "", mediaUrlsRaw: (e.mediaUrls ?? []).join("\n"), embedUrl: e.embedUrl ?? "", eventDate: e.eventDate ?? "", published: e.published });
  }

  function buildBody() {
    const urls = form.mediaUrlsRaw.split("\n").map(s => s.trim()).filter(Boolean);
    return {
      title: form.title, body: form.body || null,
      mediaUrls: urls.length ? urls : null, embedUrl: form.embedUrl || null,
      eventDate: form.eventDate || null, published: form.published,
    };
  }

  async function handleCreate() {
    setSaving(true);
    const res = await apiCall(`${API}/admin/journal`, { method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify(buildBody()) });
    setSaving(false);
    if (!res.ok) { setError(res.message); return; }
    setCreating(false); resetForm(); refetch();
  }

  async function handleUpdate() {
    if (!editId) return;
    setSaving(true);
    const res = await apiCall(`${API}/admin/journal/${editId}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify(buildBody()) });
    setSaving(false);
    if (!res.ok) { setError(res.message); return; }
    setEditId(null); resetForm(); refetch();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this journal entry?")) return;
    const res = await apiCall(`${API}/admin/journal/${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    if (!res.ok) { setError(res.message); return; }
    refetch();
  }

  async function handleTogglePublish(e: AdminJournalEvent) {
    const res = await apiCall(`${API}/admin/journal/${e.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify({ published: !e.published }) });
    if (!res.ok) { setError(res.message); return; }
    refetch();
  }

  const isEditing = creating || editId !== null;

  return (
    <div>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-xl text-foreground">Journal</h2>
          <p className="text-xs text-[#2D2926] mt-1">Pop-ups, events, and field notes shown on the public Journal page.</p>
        </div>
        {!isEditing && (
          <button onClick={() => { setCreating(true); setEditId(null); resetForm(); }}
            className="text-xs tracking-[0.18em] uppercase font-medium px-5 h-9 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all">
            + New Entry
          </button>
        )}
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="border border-border/50 p-6 mb-6 bg-muted/30">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#2D2926] mb-5">{editId ? "Edit Entry" : "New Journal Entry"}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Pop-Up at Koramangala Farmers Market"
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Event Date</label>
                <input type="date" value={form.eventDate} onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))}
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Embed URL (YouTube / Instagram)</label>
                <input value={form.embedUrl} onChange={e => setForm(f => ({ ...f, embedUrl: e.target.value }))} placeholder="https://youtu.be/... or instagram.com/reel/..."
                  className="w-full h-10 border border-border/50 bg-background text-foreground text-xs px-3 focus:outline-none focus:border-accent" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Image URLs (one per line, max 4)</label>
                <textarea value={form.mediaUrlsRaw} onChange={e => setForm(f => ({ ...f, mediaUrlsRaw: e.target.value }))} rows={3}
                  placeholder={"https://...image1.jpg\nhttps://...image2.jpg"}
                  className="w-full border border-border/50 bg-background text-foreground text-xs px-3 py-2 focus:outline-none focus:border-accent resize-y font-mono" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] tracking-widest uppercase text-[#2D2926] block mb-1">Body text</label>
                <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={5}
                  placeholder="Describe the event, the vibe, what was made…"
                  className="w-full border border-border/50 bg-background text-foreground text-xs px-3 py-2 focus:outline-none focus:border-accent resize-y" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="journal-published" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                  className="w-4 h-4 accent-accent" />
                <label htmlFor="journal-published" className="text-[10px] tracking-widest uppercase text-[#2D2926] cursor-pointer">Published (visible on site)</label>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={editId ? handleUpdate : handleCreate} disabled={saving || !form.title}
                className="text-xs tracking-[0.18em] uppercase font-medium px-6 h-9 bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-40">
                {saving ? "Saving…" : editId ? "Update" : "Create"}
              </button>
              <button onClick={() => { setCreating(false); setEditId(null); resetForm(); }}
                className="text-xs tracking-[0.18em] uppercase font-medium px-6 h-9 border border-border/50 text-[#2D2926] hover:text-foreground transition-all">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-xs text-[#2D2926]">Loading…</p>
      ) : !events?.length ? (
        <p className="text-xs text-[#2D2926]">No journal entries yet. Create one above.</p>
      ) : (
        <div className="divide-y divide-border/30">
          {events.map(e => (
            <div key={e.id} className="py-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-serif text-sm text-foreground">{e.title}</p>
                {e.eventDate && <p className="text-[10px] text-[#2D2926]">{e.eventDate}</p>}
                {e.body && <p className="text-[10px] text-[#2D2926] mt-0.5 truncate">{e.body}</p>}
                <div className="flex gap-2 mt-1">
                  {e.mediaUrls && e.mediaUrls.length > 0 && <span className="text-[9px] tracking-[0.15em] uppercase px-1.5 py-0.5" style={{ background: "rgba(15,36,25,0.06)", color: "rgba(15,36,25,0.4)" }}>{e.mediaUrls.length} image{e.mediaUrls.length > 1 ? "s" : ""}</span>}
                  {e.embedUrl && <span className="text-[9px] tracking-[0.15em] uppercase px-1.5 py-0.5" style={{ background: "rgba(255,0,0,0.06)", color: "rgba(200,0,0,0.5)" }}>Embed</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleTogglePublish(e)}
                  className={`text-[9px] tracking-widest uppercase px-3 h-8 border transition-all ${e.published ? "border-green-400/40 text-green-600/70 hover:border-green-400/70" : "border-border/30 text-[#2D2926] hover:border-foreground/40"}`}>
                  {e.published ? "Live" : "Draft"}
                </button>
                <button onClick={() => { setEditId(e.id); setCreating(false); loadIntoForm(e); }}
                  className="text-[10px] tracking-widest uppercase px-3 h-8 border border-border/40 text-[#2D2926] hover:text-foreground hover:border-foreground/50 transition-all">
                  Edit
                </button>
                <button onClick={() => handleDelete(e.id)}
                  className="text-[10px] tracking-widest uppercase px-3 h-8 border border-red-300/30 text-red-400/60 hover:text-red-400 hover:border-red-400/50 transition-all">
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────────────────────────────────

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("wc_admin_token") ?? "");
  const [input, setInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"windows" | "orders" | "settings" | "archive" | "recipes" | "site_mode" | "reviews" | "bakery_addons" | "journal">("windows");
  const [checking, setChecking] = useState(false);

  useEffect(() => { if (token) verifyToken(token); }, []);

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
        setToken(t); setAuthed(true); setAuthError("");
      } else {
        setAuthed(false); setAuthError("Invalid password.");
        localStorage.removeItem("wc_admin_token");
      }
    } catch {
      setAuthed(false); setAuthError("Could not reach server.");
    }
    setChecking(false);
  }

  function handleLogout() {
    localStorage.removeItem("wc_admin_token");
    setToken(""); setInput(""); setAuthed(false);
  }

  const TABS = [
    { id: "windows", label: "Bake Windows" },
    { id: "orders", label: "Orders" },
    { id: "site_mode", label: "Site Status" },
    { id: "archive", label: "Archive" },
    { id: "recipes", label: "Recipes" },
    { id: "reviews", label: "Reviews" },
    { id: "bakery_addons", label: "Add-Ons" },
    { id: "journal", label: "Journal" },
    { id: "settings", label: "Settings" },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#2D2926] mb-1">Wandering Cocos</p>
            <h1 className="font-serif text-2xl text-foreground">Admin</h1>
          </div>
          {authed && (
            <button onClick={handleLogout} className="text-[10px] tracking-[0.22em] uppercase text-[#2D2926] hover:text-foreground/60 transition-colors">
              Sign out
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!authed ? (
            <motion.div key="login" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-sm">
              <p className="text-xs text-[#2D2926] mb-6 leading-relaxed">Enter the admin password to continue.</p>
              <div className="space-y-3">
                <input type="password" value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && verifyToken(input)} placeholder="Admin password"
                  className="w-full h-11 border border-border/50 bg-background text-foreground text-sm px-4 focus:outline-none focus:border-accent transition-colors"
                  autoFocus />
                {authError && <p className="text-xs text-red-400">{authError}</p>}
                <button onClick={() => verifyToken(input)} disabled={!input || checking}
                  className="w-full h-11 text-xs tracking-[0.22em] uppercase font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-40">
                  {checking ? "Checking…" : "Enter"}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex gap-0 border-b border-border/40 mb-8">
                {TABS.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`px-5 py-3 text-[11px] tracking-[0.18em] uppercase font-medium transition-all border-b-2 -mb-px ${tab === t.id ? "border-accent text-foreground" : "border-transparent text-[#2D2926] hover:text-foreground/70"}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === "windows" && <BakeWindowsTab token={token} />}
              {tab === "orders" && <OrdersTab token={token} />}
              {tab === "site_mode" && <SiteModeTab token={token} />}
              {tab === "archive" && <ArchiveTab token={token} />}
              {tab === "recipes" && <RecipesTab token={token} />}
              {tab === "reviews" && <ReviewsTab token={token} />}
              {tab === "bakery_addons" && <BakeryAddOnsTab token={token} />}
              {tab === "journal" && <JournalTab token={token} />}
              {tab === "settings" && <SettingsTab token={token} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
