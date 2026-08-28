"use client";
import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus, Save, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApiError, projectsApi } from "@/lib/api";
import {
  parseApproach,
  type AdminProject,
  type ApproachStep,
  type ProjectCategory,
  type ProjectImage,
  type ProjectMetric,
} from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, TagInput } from "@/components/ui/Field";
import { StatusBadge } from "@/components/ui/Badge";
import { ImageUploader } from "@/components/projects/ImageUploader";

const TABS = [
  { id: "basic", label: "أساسي" },
  { id: "story", label: "السرد" },
  { id: "metrics", label: "الأرقام" },
  { id: "gallery", label: "المعرض" },
  { id: "seo", label: "SEO" },
] as const;
type TabId = (typeof TABS)[number]["id"];

/** الحروف اللاتينية الصغيرة والأرقام والشرطات فقط — يطابق قيد الـ DTO. */
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { token } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<TabId>("basic");
  const [p, setP] = useState<AdminProject>();
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [approach, setApproach] = useState<ApproachStep[]>([]);
  const [metrics, setMetrics] = useState<ProjectMetric[]>([]);
  const [gallery, setGallery] = useState<ProjectImage[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const [proj, cats] = await Promise.all([
        projectsApi.get(token, id),
        projectsApi.categories().catch(() => []),
      ]);
      setP(proj);
      setCategories(cats);
      setApproach(parseApproach(proj.approach));
      setMetrics(proj.metrics ?? []);
      setGallery(proj.gallery ?? []);
      setDirty(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر تحميل المشروع");
    }
  }, [token, id]);

  useEffect(() => { load(); }, [load]);

  /* تحذير قبل مغادرة نموذج غير محفوظ */
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  const set = <K extends keyof AdminProject>(key: K, value: AdminProject[K]) => {
    setP((prev) => (prev ? { ...prev, [key]: value } : prev));
    setDirty(true);
    setSaved(false);
  };

  const slugError =
    p && p.slug && !SLUG_RE.test(p.slug)
      ? "حروف لاتينية صغيرة وأرقام وشرطات فقط — الرابط يدخل في العنوان وخريطة الموقع"
      : undefined;

  async function save() {
    if (!p || slugError) return;
    setSaving(true);
    setError(null);
    setMissing([]);
    try {
      await projectsApi.update(token!, id, {
        slug: p.slug, title: p.title, titleEn: p.titleEn || undefined,
        summary: p.summary, description: p.description,
        challenge: p.challenge || undefined,
        solution: p.solution || undefined,
        outcome: p.outcome || undefined,
        approach,
        client: p.client || undefined,
        industry: p.industry || undefined,
        year: p.year || undefined,
        durationMonths: p.durationMonths || undefined,
        role: p.role || undefined,
        teamSize: p.teamSize || undefined,
        technologies: p.technologies,
        categoryId: p.categoryId || undefined,
        coverImageUrl: p.coverImageUrl || undefined,
        coverImageAlt: p.coverImageAlt || undefined,
        testimonialQuote: p.testimonialQuote || undefined,
        testimonialAuthor: p.testimonialAuthor || undefined,
        testimonialRole: p.testimonialRole || undefined,
        liveUrl: p.liveUrl || undefined,
        repoUrl: p.repoUrl || undefined,
        featured: p.featured,
        metrics: metrics.filter((m) => m.label && m.value),
        metaTitle: p.metaTitle || undefined,
        metaDescription: p.metaDescription || undefined,
        ogImageUrl: p.ogImageUrl || undefined,
      });
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    setSaving(true);
    setError(null);
    setMissing([]);
    try {
      if (dirty) await save();
      await projectsApi.publish(token!, id);
      await load();
    } catch (e) {
      /* 422 من بوّابة النشر يحمل قائمة الحقول الناقصة — تُعرض كما هي
         بدل رسالة عامة لا تدلّ على شيء. */
      if (e instanceof ApiError && e.missing.length) setMissing(e.missing);
      else setError(e instanceof Error ? e.message : "تعذّر النشر");
    } finally {
      setSaving(false);
    }
  }

  async function unpublish() {
    setSaving(true);
    try {
      await projectsApi.unpublish(token!, id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر إلغاء النشر");
    } finally {
      setSaving(false);
    }
  }

  if (!p) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-fg-muted">
        {error ?? "جار التحميل..."}
      </div>
    );
  }

  return (
    <div className="pb-28">
      <header className="mb-6">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-2 font-mono text-xs text-fg-muted hover:text-primary-500"
        >
          <ArrowRight size={14} aria-hidden /> معرض الأعمال
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-bold">{p.title}</h1>
          <StatusBadge status={p.status} />
          {p.status === "PUBLISHED" && (
            <a
              href={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/work/${p.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-primary-500 underline-offset-4 hover:underline"
            >
              معاينة ↗
            </a>
          )}
        </div>
      </header>

      <nav className="mb-6 flex flex-wrap gap-1 border-b border-border-default" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-5 py-3 text-sm transition-fast ${
              tab === t.id
                ? "border-primary-500 font-bold text-primary-500"
                : "border-transparent text-fg-muted hover:text-fg"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {missing.length > 0 && (
        <div role="alert" className="mb-6 rounded-sm border border-warning bg-warning/5 p-4">
          <p className="text-sm font-bold text-warning">لا يمكن النشر — حقول ناقصة:</p>
          <ul className="mt-2 list-inside list-disc text-sm text-fg-muted">
            {missing.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>
      )}
      {error && (
        <p role="alert" className="mb-6 rounded-sm border border-danger bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {/* ── أساسي ── */}
      {tab === "basic" && (
        <div className="grid max-w-3xl gap-5">
          <Input label="العنوان" required value={p.title} onChange={(e) => set("title", e.target.value)} />
          <Input label="العنوان بالإنجليزية" value={p.titleEn ?? ""} onChange={(e) => set("titleEn", e.target.value)} />
          <Input
            label="الرابط (slug)"
            required
            hint="يظهر في عنوان الصفحة"
            error={slugError}
            value={p.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
          <Textarea
            label="الملخّص"
            required
            hint="سطر واحد يظهر في البطاقة ووصف محرّكات البحث — حتى ٢٠٠ محرف"
            rows={2}
            maxLength={200}
            value={p.summary}
            onChange={(e) => set("summary", e.target.value)}
          />
          <Textarea label="نبذة عامة" required rows={5} value={p.description ?? ""} onChange={(e) => set("description", e.target.value)} />

          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="العميل" value={p.client ?? ""} onChange={(e) => set("client", e.target.value)} />
            <Input label="القطاع" value={p.industry ?? ""} onChange={(e) => set("industry", e.target.value)} />
            <Input label="السنة" type="number" value={p.year ?? ""} onChange={(e) => set("year", e.target.value ? +e.target.value : null)} />
            <Input label="المدة (أشهر)" type="number" value={p.durationMonths ?? ""} onChange={(e) => set("durationMonths", e.target.value ? +e.target.value : null)} />
            <Input label="الدور" value={p.role ?? ""} onChange={(e) => set("role", e.target.value)} />
            <Input label="حجم الفريق" type="number" value={p.teamSize ?? ""} onChange={(e) => set("teamSize", e.target.value ? +e.target.value : null)} />
          </div>

          <div>
            <label htmlFor="cat">التصنيف</label>
            <select
              id="cat"
              value={p.categoryId ?? ""}
              onChange={(e) => set("categoryId", e.target.value || null)}
              className="w-full rounded-sm border border-border-default bg-surface-3 px-4 py-3 text-sm"
            >
              <option value="">— بلا تصنيف —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <TagInput label="التقنيات" value={p.technologies} onChange={(v) => set("technologies", v)} />

          <Input label="رابط صورة الغلاف" value={p.coverImageUrl ?? ""} onChange={(e) => set("coverImageUrl", e.target.value)} hint="ارفع صورة من تبويب المعرض ثم الصق رابطها" />
          <Input label="وصف صورة الغلاف" value={p.coverImageAlt ?? ""} onChange={(e) => set("coverImageAlt", e.target.value)} />

          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="رابط الموقع الحيّ" value={p.liveUrl ?? ""} onChange={(e) => set("liveUrl", e.target.value)} />
            <Input label="رابط المستودع" value={p.repoUrl ?? ""} onChange={(e) => set("repoUrl", e.target.value)} />
          </div>
        </div>
      )}

      {/* ── السرد ── */}
      {tab === "story" && (
        <div className="grid max-w-3xl gap-5">
          <Textarea label="التحدّي" rows={4} hint="ما الذي كان يعيق العمل قبل المشروع" value={p.challenge ?? ""} onChange={(e) => set("challenge", e.target.value)} />
          <Textarea label="الحل" rows={4} value={p.solution ?? ""} onChange={(e) => set("solution", e.target.value)} />
          <Textarea label="النتيجة" rows={3} value={p.outcome ?? ""} onChange={(e) => set("outcome", e.target.value)} />

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="mb-0">خطوات المنهجية</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setApproach([...approach, { title: "", desc: "" }]); setDirty(true); }}
              >
                <Plus size={14} aria-hidden /> خطوة
              </Button>
            </div>
            <div className="grid gap-3">
              {approach.map((s, i) => (
                <div key={i} className="grid gap-2 rounded-sm border border-border-default p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
                    <input
                      value={s.title}
                      placeholder="عنوان الخطوة"
                      onChange={(e) => {
                        const next = [...approach]; next[i] = { ...s, title: e.target.value };
                        setApproach(next); setDirty(true);
                      }}
                      className="flex-1 rounded-sm border border-border-default bg-surface-3 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => { setApproach(approach.filter((_, x) => x !== i)); setDirty(true); }}
                      aria-label={`حذف الخطوة ${i + 1}`}
                      className="p-2 text-danger hover:bg-surface-2"
                    >
                      <Trash2 size={14} aria-hidden />
                    </button>
                  </div>
                  <textarea
                    value={s.desc}
                    placeholder="وصف الخطوة"
                    rows={2}
                    onChange={(e) => {
                      const next = [...approach]; next[i] = { ...s, desc: e.target.value };
                      setApproach(next); setDirty(true);
                    }}
                    className="rounded-sm border border-border-default bg-surface-3 px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border-subtle pt-5">
            <Textarea label="شهادة العميل" rows={3} value={p.testimonialQuote ?? ""} onChange={(e) => set("testimonialQuote", e.target.value)} />
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <Input label="اسم قائل الشهادة" value={p.testimonialAuthor ?? ""} onChange={(e) => set("testimonialAuthor", e.target.value)} />
              <Input label="منصبه" value={p.testimonialRole ?? ""} onChange={(e) => set("testimonialRole", e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* ── الأرقام ── */}
      {tab === "metrics" && (
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-fg-muted">
              القيمة نصّ لا رقم — تقبل «٣٢» و«×٤» و«٤٫٨». مطلوب مؤشّر واحد على الأقل للنشر.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setMetrics([...metrics, { label: "", value: "", direction: "UP" }]); setDirty(true); }}
            >
              <Plus size={14} aria-hidden /> مؤشّر
            </Button>
          </div>

          <div className="grid gap-3">
            {metrics.map((m, i) => (
              <div key={i} className="grid grid-cols-[1fr_100px_80px_110px_auto] items-center gap-2 rounded-sm border border-border-default p-3">
                <input
                  value={m.label} placeholder="التسمية (مثل: انخفاض التكلفة)"
                  onChange={(e) => { const n = [...metrics]; n[i] = { ...m, label: e.target.value }; setMetrics(n); setDirty(true); }}
                  className="rounded-sm border border-border-default bg-surface-3 px-3 py-2 text-sm"
                />
                <input
                  value={m.value} placeholder="٣٢"
                  onChange={(e) => { const n = [...metrics]; n[i] = { ...m, value: e.target.value }; setMetrics(n); setDirty(true); }}
                  className="rounded-sm border border-border-default bg-surface-3 px-3 py-2 text-center font-display text-sm"
                />
                <input
                  value={m.unit ?? ""} placeholder="٪"
                  onChange={(e) => { const n = [...metrics]; n[i] = { ...m, unit: e.target.value }; setMetrics(n); setDirty(true); }}
                  className="rounded-sm border border-border-default bg-surface-3 px-3 py-2 text-center text-sm"
                />
                <select
                  value={m.direction ?? "UP"}
                  onChange={(e) => { const n = [...metrics]; n[i] = { ...m, direction: e.target.value as ProjectMetric["direction"] }; setMetrics(n); setDirty(true); }}
                  className="rounded-sm border border-border-default bg-surface-3 px-2 py-2 text-sm"
                >
                  <option value="UP">ارتفاع ↑</option>
                  <option value="DOWN">انخفاض ↓</option>
                  <option value="NEUTRAL">محايد</option>
                </select>
                <button
                  type="button"
                  onClick={() => { setMetrics(metrics.filter((_, x) => x !== i)); setDirty(true); }}
                  aria-label={`حذف المؤشّر ${i + 1}`}
                  className="p-2 text-danger hover:bg-surface-2"
                >
                  <Trash2 size={14} aria-hidden />
                </button>
              </div>
            ))}
            {!metrics.length && (
              <p className="rounded-sm border border-dashed border-border-strong p-8 text-center text-sm text-fg-muted">
                لا مؤشّرات بعد — الأرقام هي أقوى ما في صفحة المشروع
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── المعرض ── */}
      {tab === "gallery" && (
        <div className="max-w-3xl">
          <ImageUploader token={token!} projectId={id} images={gallery} onChange={setGallery} />
        </div>
      )}

      {/* ── SEO ── */}
      {tab === "seo" && (
        <div className="grid max-w-3xl gap-5">
          <Input label="عنوان محرّكات البحث" hint="حتى ٧٠ محرفاً" maxLength={70} value={p.metaTitle ?? ""} onChange={(e) => set("metaTitle", e.target.value)} />
          <Textarea label="وصف محرّكات البحث" hint="حتى ١٦٠ محرفاً" rows={3} maxLength={160} value={p.metaDescription ?? ""} onChange={(e) => set("metaDescription", e.target.value)} />
          <Input label="صورة المشاركة (OG)" value={p.ogImageUrl ?? ""} onChange={(e) => set("ogImageUrl", e.target.value)} hint="تُولَّد تلقائياً إن تُركت فارغة" />

          <div className="rounded-sm border border-border-default bg-surface-3 p-5">
            <p className="mb-3 font-mono text-[11px] tracking-wider text-fg-muted">معاينة نتيجة البحث</p>
            <p className="font-mono text-xs text-success">rvios.com › work › {p.slug}</p>
            <p className="mt-1 text-lg text-info">{p.metaTitle || `${p.title} — أعمال RVIOS`}</p>
            <p className="mt-1 text-sm text-fg-muted">{p.metaDescription || p.summary}</p>
          </div>
        </div>
      )}

      {/* ── شريط الحفظ ── */}
      <div className="fixed inset-x-0 bottom-0 z-sticky border-t border-border-default bg-surface-3/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-8 py-4">
          <span className="font-mono text-xs text-fg-muted">
            {saved ? "✓ حُفظ" : dirty ? "تغييرات غير محفوظة" : "لا تغييرات"}
          </span>
          <div className="ms-auto flex gap-2">
            {p.status === "PUBLISHED" ? (
              <Button variant="ghost" onClick={unpublish} disabled={saving}>
                إلغاء النشر
              </Button>
            ) : (
              <Button variant="ghost" onClick={publish} disabled={saving}>
                نشر
              </Button>
            )}
            <Button onClick={save} loading={saving} disabled={!!slugError}>
              <Save size={16} aria-hidden /> حفظ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
