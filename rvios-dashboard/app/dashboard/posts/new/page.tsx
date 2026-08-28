"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { postsApi, categoriesApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowRight, Eye } from "lucide-react";

export default function NewPostPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", titleEn: "", slug: "", description: "",
    content: "", metaDescription: "", keywords: "",
    tags: "", heroImageUrl: "", heroImageAlt: "",
    readingTime: 5, status: "DRAFT", featured: false, categoryId: "",
  });

  useEffect(() => {
    categoriesApi.list().then((cats: any) => setCategories(Array.isArray(cats) ? cats : []));
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (!form.titleEn) return;
    const slug = form.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setForm(p => ({ ...p, slug }));
  }, [form.titleEn]);

  async function save(publish = false) {
    if (!token) return;
    setSaving(true);
    try {
      const data = {
        ...form,
        keywords: form.keywords.split(",").map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map(s => s.trim()).filter(Boolean),
        readingTime: Number(form.readingTime),
        status: publish ? "PUBLISHED" : "DRAFT",
      };
      await postsApi.create(token, data);
      router.push("/dashboard/posts");
    } finally { setSaving(false); }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard/posts" className="btn btn-ghost" style={{ padding: "8px 12px" }}><ArrowRight size={16} /></Link>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 800 }}>مقال جديد</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => save(false)} disabled={saving}><Save size={15} /> مسودة</button>
          <button className="btn btn-primary" onClick={() => save(true)} disabled={saving}><Eye size={15} /> {saving ? "جار النشر..." : "نشر"}</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label>عنوان المقال (عربي) *</label><input className="input" value={form.title} onChange={set("title")} placeholder="عنوان مقالك بالعربية" /></div>
              <div><label>عنوان المقال (إنجليزي) — يُولّد منه الـ Slug تلقائياً</label><input className="input" value={form.titleEn} onChange={set("titleEn")} placeholder="Your Article Title in English" /></div>
              <div><label>الرابط (Slug) *</label><input className="input" dir="ltr" value={form.slug} onChange={set("slug")} placeholder="your-article-slug" /></div>
              <div><label>الوصف المختصر *</label><textarea className="input" rows={3} value={form.description} onChange={set("description")} placeholder="وصف مختصر للمقال..." style={{ resize: "vertical" }} /></div>
            </div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <label>محتوى المقال (HTML أو نص عادي) *</label>
            <textarea className="input" rows={20} value={form.content} onChange={set("content")} style={{ resize: "vertical", fontFamily: "monospace", fontSize: "0.8rem" }} dir="ltr" placeholder="<h2>مقدمة</h2><p>...</p>" />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 16 }}>إعدادات النشر</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label>التصنيف *</label>
                <select className="input" value={form.categoryId} onChange={set("categoryId")}>
                  <option value="">اختر تصنيفاً</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><label>وقت القراءة (دقائق)</label><input className="input" type="number" min={1} value={form.readingTime} onChange={set("readingTime")} /></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" id="featured" checked={form.featured}
                  onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} style={{ width: 16, height: 16, accentColor: "var(--primary)" }} />
                <label htmlFor="featured" style={{ marginBottom: 0, textTransform: "none" }}>مقال مميز</label>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 16 }}>الصورة الرئيسية</h3>
            <div><label>رابط الصورة</label><input className="input" type="url" value={form.heroImageUrl} onChange={set("heroImageUrl")} placeholder="https://..." dir="ltr" /></div>
            <div style={{ marginTop: 12 }}><label>النص البديل</label><input className="input" value={form.heroImageAlt} onChange={set("heroImageAlt")} /></div>
            {form.heroImageUrl && <img src={form.heroImageUrl} alt="preview" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, marginTop: 12 }} />}
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 16 }}>إعدادات SEO</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label>Meta Description <span style={{ color: "var(--text-faint)" }}>({form.metaDescription.length}/160)</span></label>
                <textarea className="input" rows={3} value={form.metaDescription} onChange={set("metaDescription")} maxLength={160} style={{ resize: "none" }} />
              </div>
              <div><label>الكلمات المفتاحية</label><input className="input" value={form.keywords} onChange={set("keywords")} placeholder="برمجة, تقنية, ذكاء اصطناعي" /></div>
              <div><label>الوسوم Tags</label><input className="input" value={form.tags} onChange={set("tags")} placeholder="AI, Web, Cloud" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
