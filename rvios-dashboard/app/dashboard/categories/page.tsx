"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { categoriesApi } from "@/lib/api";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

export default function CategoriesPage() {
  const { token } = useAuth();
  const [cats, setCats] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", nameEn: "", slug: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data: any = await categoriesApi.list().catch(() => []);
    setCats(Array.isArray(data) ? data : []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!token) return;
    if (editing) {
      await categoriesApi.update(token, editing, form);
      setEditing(null);
    } else {
      await categoriesApi.create(token, form);
    }
    setForm({ name: "", nameEn: "", slug: "" });
    load();
  }

  function startEdit(cat: any) {
    setEditing(cat.id);
    setForm({ name: cat.name, nameEn: cat.nameEn, slug: cat.slug });
  }

  async function remove(id: string) {
    if (!confirm("حذف التصنيف؟")) return;
    await categoriesApi.delete(token!, id);
    load();
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>التصنيفات</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 4 }}>{cats.length} تصنيف</p>
      </div>

      {/* Form */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 16 }}>
          {editing ? "تعديل تصنيف" : "تصنيف جديد"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
          <div>
            <label>الاسم (عربي)</label>
            <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: البرمجة" />
          </div>
          <div>
            <label>الاسم (إنجليزي)</label>
            <input className="input" value={form.nameEn} onChange={e => setForm(p => ({ ...p, nameEn: e.target.value }))} placeholder="Programming" />
          </div>
          <div>
            <label>Slug</label>
            <input className="input" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} placeholder="programming" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={save}><Check size={16} /></button>
            {editing && <button className="btn btn-ghost" onClick={() => { setEditing(null); setForm({ name: "", nameEn: "", slug: "" }); }}><X size={16} /></button>}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>الاسم (عربي)</th><th>الاسم (إنجليزي)</th><th>Slug</th><th>المقالات</th><th>إجراءات</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>جار التحميل...</td></tr>
              : cats.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td style={{ color: "var(--text-muted)" }}>{c.nameEn}</td>
                <td><code style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 6 }}>{c.slug}</code></td>
                <td><span className="badge badge-blue">{c._count?.posts ?? 0}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost" style={{ padding: "6px 10px" }} onClick={() => startEdit(c)}><Pencil size={14} /></button>
                    <button className="btn btn-danger" style={{ padding: "6px 10px" }} onClick={() => remove(c.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
