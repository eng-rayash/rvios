"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { projectsApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** يقترح slug لاتينياً من العنوان — والعربي يترك الحقل ليكتبه المحرّر. */
function suggestSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

/**
 * إنشاء مشروع — الحقول المطلوبة وحدها.
 *
 * البقية (السرد، الأرقام، الصور، SEO) تُملأ في المحرّر الكامل بعد الإنشاء:
 * نموذج واحد بأربعين حقلاً يمنع البدء، وبوّابة النشر تضمن الاكتمال قبل الظهور.
 */
export default function NewProjectPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ title: "", slug: "", summary: "", description: "" });
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slugError =
    form.slug && !SLUG_RE.test(form.slug)
      ? "حروف لاتينية صغيرة وأرقام وشرطات فقط"
      : undefined;

  const canSave =
    form.title.trim().length >= 2 &&
    SLUG_RE.test(form.slug) &&
    form.summary.trim().length >= 10 &&
    form.description.trim().length >= 20;

  async function create() {
    if (!canSave || !token) return;
    setSaving(true);
    setError(null);
    try {
      const p = await projectsApi.create(token, form);
      /* إلى المحرّر مباشرة — الإنشاء نصف العمل */
      router.push(`/dashboard/projects/${p.id}/edit`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر الإنشاء");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-2 font-mono text-xs text-fg-muted hover:text-primary-500"
      >
        <ArrowRight size={14} aria-hidden /> معرض الأعمال
      </Link>

      <h1 className="mb-2 mt-3 font-display text-2xl font-bold">مشروع جديد</h1>
      <p className="mb-8 text-sm text-fg-muted">
        ابدأ بالأساسيات — تكمل السرد والأرقام والصور في الخطوة التالية.
      </p>

      {error && (
        <p role="alert" className="mb-6 rounded-sm border border-danger bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="grid gap-5">
        <Input
          label="عنوان المشروع"
          required
          value={form.title}
          onChange={(e) => {
            const title = e.target.value;
            setForm((f) => ({
              ...f,
              title,
              slug: slugTouched ? f.slug : suggestSlug(title),
            }));
          }}
        />

        <Input
          label="الرابط (slug)"
          required
          hint="يظهر في عنوان الصفحة: rvios.com/work/..."
          error={slugError}
          value={form.slug}
          onChange={(e) => { setSlugTouched(true); setForm((f) => ({ ...f, slug: e.target.value })); }}
        />

        <Textarea
          label="الملخّص"
          required
          hint="سطر واحد يظهر في البطاقة — ١٠ محارف على الأقل"
          rows={2}
          maxLength={200}
          value={form.summary}
          onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
        />

        <Textarea
          label="نبذة عامة"
          required
          hint="٢٠ محرفاً على الأقل"
          rows={5}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />

        <div className="flex items-center gap-3">
          <Button onClick={create} loading={saving} disabled={!canSave}>
            إنشاء ومتابعة ←
          </Button>
          <span className="font-mono text-xs text-fg-muted">
            يُنشأ كمسودّة — لا يظهر في الموقع قبل النشر
          </span>
        </div>
      </div>
    </div>
  );
}
