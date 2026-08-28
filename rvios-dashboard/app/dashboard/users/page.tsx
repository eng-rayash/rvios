"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { usersApi } from "@/lib/api";
import { Plus, Trash2, Shield, UserCircle } from "lucide-react";

export default function UsersPage() {
  const { token, user: me } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ email: "", password: "", role: "EDITOR" });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  async function load() {
    if (!token) return;
    const data: any = await usersApi.list(token).catch(() => []);
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  }
  useEffect(() => { load(); }, [token]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    await usersApi.create(token, form);
    setForm({ email: "", password: "", role: "EDITOR" });
    setAdding(false);
    load();
  }

  async function remove(id: string) {
    if (id === me?.id) return alert("لا يمكنك حذف حسابك الخاص");
    if (!confirm("حذف المستخدم؟")) return;
    await usersApi.delete(token!, id);
    load();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>المستخدمون</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 4 }}>{users.length} مستخدم</p>
        </div>
        <button className="btn btn-primary" onClick={() => setAdding(v => !v)}><Plus size={16} /> مستخدم جديد</button>
      </div>

      {/* Add Form */}
      {adding && (
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <form onSubmit={create} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: 12, alignItems: "end" }}>
            <div>
              <label>البريد الإلكتروني</label>
              <input className="input" type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label>كلمة المرور (8+ أحرف)</label>
              <input className="input" type="password" required minLength={8} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <div>
              <label>الدور</label>
              <select className="input" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                <option value="EDITOR">محرر</option>
                <option value="ADMIN">مدير</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit">إضافة</button>
          </form>
        </div>
      )}

      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>البريد الإلكتروني</th><th>الدور</th><th>تاريخ الإنشاء</th><th>إجراءات</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={4} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>جار التحميل...</td></tr>
              : users.map(u => (
              <tr key={u.id}>
                <td style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <UserCircle size={18} color="var(--text-faint)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{u.email}</div>
                    {u.id === me?.id && <div style={{ fontSize: "0.65rem", color: "var(--primary)" }}>أنت</div>}
                  </div>
                </td>
                <td>
                  <span className={`badge ${u.role === "ADMIN" ? "badge-red" : "badge-blue"}`}>
                    {u.role === "ADMIN" ? <><Shield size={10} /> مدير</> : "محرر"}
                  </span>
                </td>
                <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{new Date(u.createdAt).toLocaleDateString("ar")}</td>
                <td>
                  {u.id !== me?.id && (
                    <button className="btn btn-danger" style={{ padding: "6px 10px" }} onClick={() => remove(u.id)}><Trash2 size={14} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
