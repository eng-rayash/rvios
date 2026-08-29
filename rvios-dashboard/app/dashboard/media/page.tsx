"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { mediaApi, API_BASE } from "@/lib/api";
import { Trash2, Upload, Image as ImageIcon, FileText, Video } from "lucide-react";

export default function MediaPage() {
  const { token } = useAuth();
  const [media, setMedia] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    const data: any = await mediaApi.list(token).catch(() => []);
    setMedia(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [token]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API_BASE}/media/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (res.ok) {
        await load();
      } else {
        /* الفشل كان يُبتلع صامتاً: يختفي «جار الرفع» ولا يظهر الملف،
           فيظنّ المستخدم أن اللوحة معطّلة بلا سبب. */
        const body = await res.json().catch(() => ({}) as any);
        setError(
          Array.isArray(body.message)
            ? body.message.join("، ")
            : body.message || `تعذّر الرفع (${res.status})`,
        );
      }
    } catch {
      setError("تعذّر الاتصال بالسيرفر (API)");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function remove(id: string) {
    if (!confirm("حذف هذا الملف؟")) return;
    setError(null);
    try {
      await mediaApi.delete(token!, id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر الحذف");
    }
  }

  const filtered = filter === "ALL" ? media : media.filter(m => m.type === filter);
  const TypeIcon = (t: string) => t === "IMAGE" ? ImageIcon : t === "VIDEO" ? Video : FileText;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>مكتبة الوسائط</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 4 }}>{media.length} ملف</p>
        </div>
        <label className="btn btn-primary" style={{ cursor: "pointer" }}>
          <Upload size={16} /> {uploading ? "جار الرفع..." : "رفع ملف"}
          <input type="file" style={{ display: "none" }} onChange={handleUpload}
            accept="image/*,video/*,application/pdf" disabled={uploading} />
        </label>
      </div>

      {error && (
        <p role="alert" style={{
          marginBottom: 16, padding: "10px 14px", fontSize: "0.8rem",
          border: "1px solid var(--color-danger)", color: "var(--color-danger)",
          borderRadius: 4,
        }}>
          {error}
        </p>
      )}

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["ALL", "IMAGE", "VIDEO", "DOCUMENT"].map(f => (
          <button key={f} className={`btn ${filter === f ? "btn-primary" : "btn-ghost"}`} style={{ fontSize: "0.75rem" }}
            onClick={() => setFilter(f)}>
            {f === "ALL" ? "الكل" : f === "IMAGE" ? "صور" : f === "VIDEO" ? "فيديو" : "مستندات"}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>جار التحميل...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
          {filtered.map(m => {
            const Icon = TypeIcon(m.type);
            return (
              <div key={m.id} className="card" style={{ overflow: "hidden", position: "relative" }}>
                {m.type === "IMAGE" ? (
                  <div style={{ height: 140, background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <img src={m.url} alt={m.originalName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ) : (
                  <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.03)" }}>
                    <Icon size={40} color="var(--text-faint)" />
                  </div>
                )}
                <div style={{ padding: "10px 12px" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.originalName}</p>
                  <p style={{ fontSize: "0.65rem", color: "var(--text-faint)", marginTop: 3 }}>{(m.size / 1024).toFixed(0)} KB</p>
                </div>
                <div style={{ padding: "0 12px 10px", display: "flex", gap: 6 }}>
                  <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", padding: "5px", fontSize: "0.7rem" }}
                    onClick={() => { navigator.clipboard.writeText(m.url); }}>نسخ الرابط</button>
                  <button className="btn btn-danger" style={{ padding: "5px 8px" }} onClick={() => remove(m.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
