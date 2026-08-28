"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { servicesApi } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Save, ArrowRight } from "lucide-react";

export default function ServiceFormPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params?.id;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [form, setForm] = useState({
    title: "", titleEn: "", slug: "",
    description: "", descriptionEn: "",
    icon: "", features: "", order: "0", status: "ACTIVE",
  });

  useEffect(() => {
    if (!isEdit || !token) return;
    servicesApi.list(token).then((svcs: any) => {
      const svc = (Array.isArray(svcs) ? svcs : []).find((s: any) => s.id === params.id);
      if (svc) setForm({ ...svc, features: (svc.features ?? []).join(", "), order: String(svc.order) });
      setLoading(false);
    });
  }, [token, params?.id]);

  async function save() {
    if (!token) return;
    setSaving(true);
    try {
      const data = { ...form, features: form.features.split(",").map(s => s.trim()).filter(Boolean), order: Number(form.order) };
      if (isEdit) await servicesApi.update(token, params.id as string, data);
      else await servicesApi.create(token, data);
      router.push("/dashboard/services");
    } finally { setSaving(false); }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  if (loading) return <p style={{ color: "var(--text-muted)" }}>جار التحميل...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard/services" className="btn btn-ghost" style={{ padding: "8px 12px" }}><ArrowRight size={16} /></Link>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 800 }}>{isEdit ? "تعديل الخدمة" : "خدمة جديدة"}</h1>
        </div>
        <button className="btn btn-primary" onClick={save} disabled={saving}><Save size={15} /> {saving ? "جار الحفظ..." : "حفظ"}</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 900 }}>
        <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontWeight: 700, fontSize: "0.9rem" }}>المعلومات الأساسية</h3>
          <div><label>الاسم (عربي) *</label><input className="input" value={form.title} onChange={set("title")} /></div>
          <div><label>الاسم (إنجليزي) *</label><input className="input" value={form.titleEn} onChange={set("titleEn")} /></div>
          <div><label>Slug *</label><input className="input" dir="ltr" value={form.slug} onChange={set("slug")} placeholder="my-service" /></div>
          <div><label>أيقونة (اسم أو رابط)</label><input className="input" value={form.icon} onChange={set("icon")} placeholder="code, design, cloud..." /></div>
          <div>
            <label>الترتيب</label><input className="input" type="number" min={0} value={form.order} onChange={set("order")} />
          </div>
          <div>
            <label>الحالة</label>
            <select className="input" value={form.status} onChange={set("status")}>
              <option value="ACTIVE">نشطة</option>
              <option value="INACTIVE">غير نشطة</option>
            </select>
          </div>
        </div>

        <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontWeight: 700, fontSize: "0.9rem" }}>الأوصاف والميزات</h3>
          <div><label>الوصف (عربي) *</label><textarea className="input" rows={4} value={form.description} onChange={set("description")} style={{ resize: "vertical" }} /></div>
          <div><label>الوصف (إنجليزي) *</label><textarea className="input" rows={4} value={form.descriptionEn} onChange={set("descriptionEn")} style={{ resize: "vertical" }} /></div>
          <div><label>الميزات (مفصولة بفاصلة)</label><input className="input" value={form.features} onChange={set("features")} placeholder="Web Apps, Mobile Apps, API..." /></div>
        </div>
      </div>
    </div>
  );
}
