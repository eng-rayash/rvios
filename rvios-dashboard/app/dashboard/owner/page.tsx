"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ownerApi, mediaApi } from "@/lib/api";
import { Save, Upload } from "lucide-react";

export default function OwnerPage() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: "", title: "", titleEn: "", bio: "", bioEn: "",
    avatarUrl: "", skills: "", links: { github: "", linkedin: "", twitter: "" },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token) return;
    ownerApi.get(token).then((data: any) => {
      setForm({
        name: data.name ?? "",
        title: data.title ?? "",
        titleEn: data.titleEn ?? "",
        bio: data.bio ?? "",
        bioEn: data.bioEn ?? "",
        avatarUrl: data.avatarUrl ?? "",
        skills: (data.skills ?? []).join(", "),
        links: { github: data.links?.github ?? "", linkedin: data.links?.linkedin ?? "", twitter: data.links?.twitter ?? "" },
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  async function save() {
    setSaving(true);
    await ownerApi.update(token!, {
      ...form,
      skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
      links: form.links,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <p style={{ color: "var(--text-muted)" }}>جار التحميل...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>الملف الشخصي للمؤسس</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 4 }}>يُعرض في موقع owner.rvios.com</p>
        </div>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          <Save size={16} /> {saved ? "تم الحفظ ✓" : saving ? "جار الحفظ..." : "حفظ"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 900 }}>
        <div className="card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
          <h2 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 4 }}>المعلومات الأساسية</h2>
          {[
            { key: "name", label: "الاسم الكامل", placeholder: "رياش فيصل" },
            { key: "title", label: "المسمى الوظيفي (عربي)", placeholder: "مؤسس RVIOS" },
            { key: "titleEn", label: "المسمى الوظيفي (إنجليزي)", placeholder: "Founder of RVIOS" },
            { key: "avatarUrl", label: "رابط الصورة الشخصية", placeholder: "https://..." },
          ].map(f => (
            <div key={f.key}>
              <label>{f.label}</label>
              <input className="input" placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label>المهارات (مفصولة بفاصلة)</label>
            <input className="input" value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} placeholder="Full-Stack, UI/UX, Cloud" />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: "0.95rem" }}>نبذة تعريفية</h2>
            <div>
              <label>نبذة (عربي)</label>
              <textarea className="input" rows={4} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} style={{ resize: "vertical" }} />
            </div>
            <div>
              <label>نبذة (إنجليزي)</label>
              <textarea className="input" rows={4} value={form.bioEn} onChange={e => setForm(p => ({ ...p, bioEn: e.target.value }))} style={{ resize: "vertical" }} />
            </div>
          </div>

          <div className="card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: "0.95rem" }}>روابط التواصل</h2>
            {(["github", "linkedin", "twitter"] as const).map(key => (
              <div key={key}>
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input className="input" placeholder={`https://${key}.com/...`}
                  value={form.links[key]}
                  onChange={e => setForm(p => ({ ...p, links: { ...p.links, [key]: e.target.value } }))} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
