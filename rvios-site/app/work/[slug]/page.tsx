import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs } from "@/lib/api/client";
import { parseApproach } from "@/lib/api/types";
import { Section, SectionHeading, Rule, Tag } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/work/WorkCard";
import { ProjectGallery } from "@/components/work/ProjectGallery";

interface Props {
  params: Promise<{ slug: string }>;
}

const arabicDigits = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

/** يُولّد الصفحات مسبقاً من المسار المخصّص لذلك — خفيف بلا حقول ثقيلة. */
export async function generateStaticParams() {
  try {
    const slugs = await getProjectSlugs();
    return slugs.map(({ slug }) => ({ slug }));
  } catch {
    /* الـ API غير متاح وقت البناء: تُولَّد الصفحات عند الطلب بدل فشل البناء. */
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const p = await getProjectBySlug(slug);
    const title = p.metaTitle ?? `${p.title} — أعمال RVIOS`;
    const description = p.metaDescription ?? p.summary;
    const image = p.ogImageUrl ?? p.coverImageUrl;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        images: image ? [{ url: image, alt: p.coverImageAlt ?? p.title }] : [],
      },
      twitter: { card: "summary_large_image", title, description },
    };
  } catch {
    return { title: "مشروع — RVIOS" };
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  let p;
  try {
    p = await getProjectBySlug(slug);
  } catch {
    notFound();
  }

  const approach = parseApproach(p.approach);
  const services = p.services.map((s) => s.service);

  const meta = [
    { label: "العميل", value: p.client },
    { label: "القطاع", value: p.industry },
    { label: "السنة", value: p.year ? arabicDigits(p.year) : null },
    {
      label: "المدة",
      value: p.durationMonths ? `${arabicDigits(p.durationMonths)} شهراً` : null,
    },
    { label: "الدور", value: p.role },
  ].filter((m) => m.value);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    description: p.summary,
    ...(p.coverImageUrl && { image: p.coverImageUrl }),
    ...(p.publishedAt && { datePublished: p.publishedAt }),
    dateModified: p.updatedAt,
    creator: { "@type": "Organization", name: "RVIOS Technologies", url: "https://rvios.com" },
    ...(p.client && { sourceOrganization: { "@type": "Organization", name: p.client } }),
    keywords: p.technologies.join(", "),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── ١. Hero ─────────────────────────────────────────── */}
      <section className="bg-ink py-20 text-ivory">
        <div className="mx-auto w-[min(100%-3rem,1200px)]">
          <nav aria-label="مسار التنقّل" className="mb-6 font-mono text-xs text-ivory/50">
            <Link href="/work" className="hover:text-gold">أعمالنا</Link>
            <span className="mx-2">←</span>
            <span>{p.category?.name ?? "مشروع"}</span>
          </nav>

          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-gold">
            <i aria-hidden className="h-px w-7 bg-gold" />
            دراسة حالة
          </span>

          <h1 className="mb-5 mt-5 max-w-[20ch] font-display text-4xl font-extrabold leading-tight">
            {p.title}
          </h1>
          <p className="max-w-[62ch] text-lg text-ivory/[0.62]">{p.summary}</p>

          {/* ── ٢. البيانات الوصفية ── */}
          {meta.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-10 border-t border-gold/30 pt-6">
              {meta.map((m) => (
                <div key={m.label}>
                  <span className="mb-1 block font-mono text-[11px] tracking-[0.12em] text-ivory/[0.42]">
                    {m.label}
                  </span>
                  <b className="text-base font-bold">{m.value}</b>
                </div>
              ))}
            </div>
          )}

          {/* ── ٣. النتائج ── */}
          {p.metrics.length > 0 && (
            <div className="mt-12 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
              {p.metrics.map((m) => (
                <div key={m.id} className="border-s-2 border-gold ps-4">
                  <b className="block font-display text-3xl font-extrabold text-gold">
                    {m.value}
                    {m.unit ?? ""}
                  </b>
                  <span className="text-sm text-ivory/[0.62]">{m.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── الغلاف ─────────────────────────────────────────── */}
      {p.coverImageUrl && (
        <div className="mx-auto -mt-10 w-[min(100%-3rem,1200px)]">
          <div className="relative aspect-[16/9] overflow-hidden border border-border">
            <Image
              src={p.coverImageUrl}
              alt={p.coverImageAlt ?? p.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* ── ٥. نظرة عامة ───────────────────────────────────── */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <div>
            <SectionHeading eyebrow="نظرة عامة" title="عن المشروع" />
            <p className="max-w-[68ch] text-lg leading-loose text-ink-muted">
              {p.description}
            </p>
          </div>

          <aside className="h-fit border border-border bg-card p-6">
            {services.length > 0 && (
              <>
                <h3 className="font-mono text-[11px] tracking-[0.14em] text-ink-faint">
                  الخدمات
                </h3>
                <ul className="mt-3 grid gap-2">
                  {services.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="text-sm text-primary underline-offset-4 hover:underline"
                      >
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {p.teamSize && (
              <div className="mt-6 border-t border-border-subtle pt-4">
                <h3 className="font-mono text-[11px] tracking-[0.14em] text-ink-faint">
                  حجم الفريق
                </h3>
                <p className="mt-1 font-display text-2xl font-bold text-ink">
                  {arabicDigits(p.teamSize)}
                </p>
              </div>
            )}

            {(p.liveUrl || p.repoUrl) && (
              <div className="mt-6 grid gap-2 border-t border-border-subtle pt-4">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    زيارة الموقع ↗
                  </a>
                )}
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    المستودع ↗
                  </a>
                )}
              </div>
            )}
          </aside>
        </div>
      </Section>

      {/* ── ٦. التحدّي ─────────────────────────────────────── */}
      {p.challenge && (
        <Section tone="ink">
          <Reveal>
            <SectionHeading eyebrow="التحدّي" title="ما الذي كان يعيق العمل" onDark />
            <p className="max-w-[62ch] text-xl leading-loose text-ivory/70">
              {p.challenge}
            </p>
          </Reveal>
        </Section>
      )}

      {/* ── ٧. الحل ────────────────────────────────────────── */}
      {(p.solution || approach.length > 0) && (
        <Section tone="surface">
          {p.solution && (
            <Reveal>
              <SectionHeading eyebrow="الحل" title="ما الذي بنيناه" />
              <p className="max-w-[68ch] text-lg leading-loose text-ink-muted">
                {p.solution}
              </p>
            </Reveal>
          )}

          {approach.length > 0 && (
            <div className="mt-16 border-t border-border">
              {approach.map((step, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="grid grid-cols-[64px_1fr] gap-6 border-b border-border-subtle py-8 transition-colors duration-fast ease-out hover:bg-surface-alt">
                    <span className="pt-1 font-mono text-sm text-gold-700">
                      {arabicDigits(String(i + 1).padStart(2, "0"))}
                    </span>
                    <div>
                      <h3 className="mb-2 font-display text-xl font-bold text-ink">
                        {step.title}
                      </h3>
                      <p className="max-w-[68ch] text-ink-muted">{step.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* ── ٨. النتيجة ─────────────────────────────────────── */}
      {p.outcome && (
        <Section tone="alt">
          <Reveal>
            <Rule className="mb-10" />
            <SectionHeading eyebrow="النتيجة" title="ما الذي تغيّر" />
            <p className="max-w-[68ch] text-lg leading-loose text-ink-muted">
              {p.outcome}
            </p>
          </Reveal>
        </Section>
      )}

      {/* ── ٩. المعرض ──────────────────────────────────────── */}
      {p.gallery.length > 0 && (
        <Section tone="surface">
          <SectionHeading eyebrow="من داخل المنتج" title="لقطات" />
          <ProjectGallery images={p.gallery} />
        </Section>
      )}

      {/* ── ١٠. التقنيات ───────────────────────────────────── */}
      {p.technologies.length > 0 && (
        <Section tone="alt">
          <SectionHeading eyebrow="البنية" title="التقنيات المستخدمة" />
          <div className="flex flex-wrap gap-2">
            {p.technologies.map((t) => (
              <Link key={t} href={`/work?tech=${encodeURIComponent(t)}`}>
                <Tag>{t}</Tag>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* ── ١١. الشهادة ────────────────────────────────────── */}
      {p.testimonialQuote && (
        <Section tone="ink">
          <Reveal>
            <figure className="mx-auto max-w-[70ch] text-center">
              <blockquote className="font-display text-2xl leading-relaxed text-ivory md:text-3xl">
                «{p.testimonialQuote}»
              </blockquote>
              {p.testimonialAuthor && (
                <figcaption className="mt-8 font-mono text-sm text-gold">
                  {p.testimonialAuthor}
                  {p.testimonialRole && (
                    <span className="block text-ivory/50">{p.testimonialRole}</span>
                  )}
                </figcaption>
              )}
            </figure>
          </Reveal>
        </Section>
      )}

      {/* ── ١٣. السابق / التالي ────────────────────────────── */}
      {(p.prev || p.next) && (
        <Section tone="surface">
          <div className="grid gap-6 sm:grid-cols-2">
            {p.prev && (
              <Link
                href={`/work/${p.prev.slug}`}
                className="group border border-border p-6 transition-all duration-base ease-out hover:border-gold"
              >
                <span className="font-mono text-[11px] tracking-[0.14em] text-ink-faint">
                  المشروع السابق →
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-ink group-hover:text-primary">
                  {p.prev.title}
                </h3>
              </Link>
            )}
            {p.next && (
              <Link
                href={`/work/${p.next.slug}`}
                className="group border border-border p-6 text-end transition-all duration-base ease-out hover:border-gold sm:col-start-2"
              >
                <span className="font-mono text-[11px] tracking-[0.14em] text-ink-faint">
                  ← المشروع التالي
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-ink group-hover:text-primary">
                  {p.next.title}
                </h3>
              </Link>
            )}
          </div>
        </Section>
      )}

      {/* ── ١٤. مشاريع ذات صلة ─────────────────────────────── */}
      {p.related.length > 0 && (
        <Section tone="alt">
          <SectionHeading eyebrow="اقرأ أيضاً" title="مشاريع ذات صلة" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {p.related.map((r) => (
              <WorkCard key={r.id} project={r} />
            ))}
          </div>
        </Section>
      )}

      {/* ── ١٥. CTA ────────────────────────────────────────── */}
      <Section tone="ink">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <SectionHeading
            eyebrow="لديك تحدٍّ مشابه؟"
            title="لنتحدّث عن مشروعك"
            onDark
          />
          <Link
            href="/contact"
            className="mb-16 inline-flex items-center gap-2 self-center border border-gold px-8 py-3 font-bold text-ivory transition-all duration-fast ease-out hover:bg-gold hover:text-ink"
          >
            تواصل معنا ←
          </Link>
        </div>
      </Section>
    </main>
  );
}
