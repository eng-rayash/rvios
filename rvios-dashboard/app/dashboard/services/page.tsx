"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { servicesApi } from "@/lib/api";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const { token } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!token) return;
    const data: any = await servicesApi.list(token).catch(() => []);
    setServices(Array.isArray(data) ? data : []);
    setLoading(false);
  }
  useEffect(() => { load(); }, [token]);

  async function remove(id: string) {
    if (!confirm("حذف الخدمة؟")) return;
    await servicesApi.delete(token!, id);
    load();
  }

  async function toggleStatus(svc: any) {
    const newStatus = svc.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await servicesApi.update(token!, svc.id, { status: newStatus });
    load();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>الخدمات</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 4 }}>{services.length} خدمة</p>
        </div>
        <Link href="/dashboard/services/new" className="btn btn-primary"><Plus size={16} /> خدمة جديدة</Link>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>الخدمة</th><th>Slug</th><th>الحالة</th><th>الترتيب</th><th>إجراءات</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>جار التحميل...</td></tr>
              : services.map(s => (
              <tr key={s.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{s.title}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-faint)" }}>{s.titleEn}</div>
                </td>
                <td><code style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 6 }}>{s.slug}</code></td>
                <td>
                  <button onClick={() => toggleStatus(s)} className={`badge ${s.status === "ACTIVE" ? "badge-green" : "badge-gray"}`} style={{ cursor: "pointer", border: "none", background: "inherit" }}>
                    {s.status === "ACTIVE" ? "نشطة" : "غير نشطة"}
                  </button>
                </td>
                <td style={{ color: "var(--text-muted)" }}>{s.order}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Link href={`/dashboard/services/${s.id}/edit`} className="btn btn-ghost" style={{ padding: "6px 10px" }}><Pencil size={14} /></Link>
                    <button className="btn btn-danger" style={{ padding: "6px 10px" }} onClick={() => remove(s.id)}><Trash2 size={14} /></button>
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
