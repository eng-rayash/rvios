"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { postsApi, categoriesApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowRight, Eye, EyeOff } from "lucide-react";

interface Props {
  params: { id: string };
}

export default function EditPostPage({ params }: Props) {
  const { token } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "", titleEn: "", slug: "", description: "",
    content: "", metaDescription: "", keywords: "",
    tags: "", heroImageUrl: "", heroImageAlt: "",
    readingTime: 5, status: "DRAFT", featured: false, categoryId: "",
  });

  useEffect(() => {
    if (!token) return;
    Promise.all([
      postsApi.get(token, params.id),
      categoriesApi.list(),
    ]).then(([post, cats]: any) => {
      setForm({
        title: post.title ?? "",
        titleEn: post.titleEn ?? "",
        slug: post.slug ?? "",
        description: post.description ?? "",
        content: post.content ?? "",
        metaDescription: post.metaDescription ?? "",
        keywords: (post.keywords ?? []).join(", "),
        tags: (post.tags ?? []).join(", "),
        heroImageUrl: post.heroImageUrl ?? "",
        heroImageAlt: post.heroImageAlt ?? "",
        readingTime: post.readingTime ?? 5,
        status: post.status ?? "DRAFT",
        featured: post.featured ?? false,
        categoryId: post.categoryId ?? "",
      });
      setCategories(Array.isArray(cats) ? cats : []);
      setLoading(false);
    }).catch(console.error);
  }, [token, params.id]);

  async function save(publish = false) {
    if (!token) return;
    setSaving(true);
    try {
      const data = {
        ...form,
        keywords: form.keywords.split(",").map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map(s => s.trim()).filter(Boolean),
        readingTime: Number(form.readingTime),
        status: publish ? "PUBLISHED" : form.status,
      };
      await postsApi.update(token, params.id, data);
      router.push("/dashboard/posts");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p style={{ color: "var(--text-muted)" }}>جار التحميل...</p>;

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard/posts" className="btn btn-ghost" style={{ padding: "8px 12px" }}><ArrowRight size={16} /></Link>
          <div>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 800 }}>تعديل المقال</h1>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>/{form.slug}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => save(false)} disabled={saving}>
            <Save size={15} /> حفظ كمسودة
          </button>
          <button className="btn btn-primary" onClick={() => save(true)} disabled={saving}>
            <Eye size={15} /> {saving ? "جار الحفظ..." : "نشر"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
        {/* Main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label>عنوان المقال (عربي) *</label><input className="input" value={form.title} onChange={set("title")} /></div>
              <div><label>عنوان المقال (إنجليزي)</label><input className="input" value={form.titleEn} onChange={set("titleEn")} /></div>
              <div><label>الرابط (Slug) *</label><input className="input" dir="ltr" value={form.slug} onChange={set("slug")} /></div>
              <div><label>الوصف المختصر *</label><textarea className="input" rows={3} value={form.description} onChange={set("description")} style={{ resize: "vertical" }} /></div>
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <label>محتوى المقال (HTML) *</label>
            <textarea className="input" rows={18} value={form.content} onChange={set("content")} style={{ resize: "vertical", fontFamily: "monospace", fontSize: "0.8rem" }} dir="ltr" />
            <p style={{ fontSize: "0.7rem", color: "var(--text-faint)", marginTop: 8 }}>يمكن كتابة HTML مباشرة أو نص عادي</p>
          </div>
        </div>

        {/* Sidebar */}
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
              <div>
                <label>وقت القراءة (دقائق)</label>
                <input className="input" type="number" min={1} value={form.readingTime} onChange={set("readingTime")} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" id="featured" checked={form.featured}
                  onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} style={{ width: 16, height: 16, accentColor: "var(--primary)" }} />
                <label htmlFor="featured" style={{ marginBottom: 0, textTransform: "none" }}>مقال مميز</label>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 16 }}>الصورة الرئيسية</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label>رابط الصورة</label><input className="input" type="url" value={form.heroImageUrl} onChange={set("heroImageUrl")} placeholder="https://..." dir="ltr" /></div>
              <div><label>النص البديل</label><input className="input" value={form.heroImageAlt} onChange={set("heroImageAlt")} /></div>
              {form.heroImageUrl && (
                <img src={form.heroImageUrl} alt="preview" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }} />
              )}
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 16 }}>إعدادات SEO</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label>Meta Description <span style={{ color: "var(--text-faint)" }}>({form.metaDescription.length}/160)</span></label>
                <textarea className="input" rows={3} value={form.metaDescription} onChange={set("metaDescription")} maxLength={160} style={{ resize: "none" }} />
              </div>
              <div><label>الكلمات المفتاحية (مفصولة بفاصلة)</label><input className="input" value={form.keywords} onChange={set("keywords")} /></div>
              <div><label>الوسوم Tags (مفصولة بفاصلة)</label><input className="input" value={form.tags} onChange={set("tags")} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
