"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { contactsApi } from "@/lib/api";
import { Trash2, CheckCircle, Mail, MailOpen } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  UNREAD: { label: "غير مقروء", cls: "badge-red" },
  READ: { label: "مقروء", cls: "badge-blue" },
  REPLIED: { label: "تم الرد", cls: "badge-green" },
};

export default function ContactsPage() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  async function load() {
    if (!token) return;
    setLoading(true);
    const data = await contactsApi.list(token).catch(() => []);
    setContacts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [token]);

  async function updateStatus(id: string, status: string) {
    await contactsApi.updateStatus(token!, id, status);
    load();
  }

  async function remove(id: string) {
    if (!confirm("حذف الرسالة؟")) return;
    await contactsApi.delete(token!, id);
    if (selected?.id === id) setSelected(null);
    load();
  }

  const filtered = filter === "ALL" ? contacts : contacts.filter(c => c.status === filter);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>الرسائل الواردة</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 4 }}>{contacts.length} رسالة إجمالاً</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["ALL", "UNREAD", "READ", "REPLIED"].map(f => (
          <button key={f} className={`btn ${filter === f ? "btn-primary" : "btn-ghost"}`} style={{ fontSize: "0.75rem" }}
            onClick={() => setFilter(f)}>
            {f === "ALL" ? "الكل" : STATUS_LABELS[f].label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 20 }}>
        {/* List */}
        <div className="card" style={{ overflow: "hidden" }}>
          {loading ? (
            <p style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>جار التحميل...</p>
          ) : filtered.map(c => (
            <div key={c.id} onClick={() => { setSelected(c); updateStatus(c.id, "READ"); }}
              style={{
                padding: "16px 20px", borderBottom: "1px solid var(--border)", cursor: "pointer",
                background: selected?.id === c.id ? "rgba(255,255,255,0.03)" : "transparent",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontWeight: c.status === "UNREAD" ? 700 : 400, fontSize: "0.9rem" }}>{c.name}</span>
                  <span className={`badge ${STATUS_LABELS[c.status]?.cls}`}>{STATUS_LABELS[c.status]?.label}</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.message}</div>
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-faint)", marginRight: 16, whiteSpace: "nowrap" }}>
                {new Date(c.createdAt).toLocaleDateString("ar")}
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        {selected && (
          <div className="card" style={{ padding: 24, alignSelf: "start" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontWeight: 700 }}>تفاصيل الرسالة</h2>
              <button className="btn btn-danger" style={{ padding: "6px 10px" }} onClick={() => remove(selected.id)}><Trash2 size={14} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Row label="الاسم" value={selected.name} />
              <Row label="البريد" value={selected.email} />
              {selected.phone && <Row label="الهاتف" value={selected.phone} />}
              {selected.service && <Row label="الخدمة" value={selected.service} />}
              <div>
                <p style={{ fontSize: "0.7rem", color: "var(--text-faint)", marginBottom: 6 }}>الرسالة</p>
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 14, fontSize: "0.875rem", lineHeight: 1.7 }}>{selected.message}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => updateStatus(selected.id, "READ")}><MailOpen size={14} /> مقروء</button>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => updateStatus(selected.id, "REPLIED")}><CheckCircle size={14} /> تم الرد</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: "0.65rem", color: "var(--text-faint)", marginBottom: 3 }}>{label}</p>
      <p style={{ fontSize: "0.875rem" }}>{value}</p>
    </div>
  );
}
