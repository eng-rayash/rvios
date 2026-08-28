import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProjects, getProjectFilters } from "@/lib/api/client";
import type { ProjectCard, ProjectFilters } from "@/lib/api/types";
import { Section, SectionHeading, Rule } from "@/components/ui/Section";
import { Reveal, CountUp } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/work/WorkCard";
import { WorkFilters } from "@/components/work/WorkFilters";
import { FeaturedCoverflow } from "@/components/work/FeaturedCoverflow";

export const metadata: Metadata = {
  title: "أعمالنا — RVIOS Technologies",
  description:
    "دراسات حالة من مشاريع RVIOS: أنظمة مؤسسات، تقنية مالية، قطاع حكومي، وصحة رقمية — بأرقام النتائج.",
  openGraph: {
    title: "أعمال RVIOS",
    description: "دراسات حالة بأرقام نتائج حقيقية",
    type: "website",
  },
};

const arabicDigits = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

const EMPTY_FILTERS: ProjectFilters = {
  categories: [],
  industries: [],
  years: [],
  technologies: [],
};

interface Props {
  searchParams: Promise<{
    page?: string;
    category?: string;
    industry?: string;
    tech?: string;
    year?: string;
    search?: string;
  }>;
}

export default async function WorkPage({ searchParams }: Props) {
  /* `await` إلزامي في Next 16. قراءتها متزامنة هي بالضبط ما جعل فلاتر
     المدونة تموت بصمت وكل مقالاتها ترجع 404. */
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  const query = {
    page,
    limit: 12,
    category: sp.category,
    industry: sp.industry,
    tech: sp.tech,
    year: sp.year ? Number(sp.year) : undefined,
    search: sp.search,
  };

  /* ارتداد لا انهيار: توقّف الـ API يجب أن يعرض صفحة فارغة مفهومة،
     لا شاشة خطأ. */
  const [listRes, filters, coverRes] = await Promise.all([
    getProjects(query).catch(() => ({
      data: [] as ProjectCard[],
      meta: { total: 0, page: 1, limit: 12, totalPages: 1, hasNext: false },
    })),
    getProjectFilters().catch(() => EMPTY_FILTERS),
    getProjects({ limit: 8, sort: "order", order: "asc" }).catch(() => ({
      data: [] as ProjectCard[],
      meta: { total: 0, page: 1, limit: 8, totalPages: 1, hasNext: false },
    })),
  ]);

  const projects = listRes.data;
  const { meta } = listRes;

  /* العارض: كل المنشور، المميّز أولاً. `?featured=true` وحده يعطي مشروعين
     في البيانات الحالية — أقلّ من أن يملأ عارضاً ثلاثي الأبعاد. */
  const coverflowItems = [...coverRes.data]
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      client: p.client ?? undefined,
      year: p.year ?? undefined,
      summary: p.metrics?.[0]
        ? `${p.metrics[0].value}${p.metrics[0].unit ?? ""} ${p.metrics[0].label}`
        : p.summary,
      imageUrl: p.coverImageUrl ?? undefined,
      imageAlt: p.coverImageAlt ?? undefined,
      blurDataURL: p.coverBlurHash ?? undefined,
    }));

  const hero = coverRes.data.find((p) => p.featured) ?? coverRes.data[0];
  const isFiltered = Boolean(
    sp.category || sp.industry || sp.tech || sp.year || sp.search,
  );

  const oldestYear = filters.years.length
    ? Math.min(...filters.years.map((y) => y.value))
    : null;

  return (
    <main>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="bg-ink py-24 text-ivory">
        <div className="mx-auto w-[min(100%-3rem,1200px)]">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-gold">
            <i aria-hidden className="h-px w-7 bg-gold" />
            أعمالنا
          </span>
          <h1 className="mt-6 max-w-[18ch] font-display text-5xl font-extrabold leading-tight">
            أنظمة بُنيت، وأرقام تتكلّم
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg text-ivory/60">
            كل مشروع هنا دراسة حالة: التحدّي كما كان، والحل كما بُني، والنتيجة
            كما قيست.
          </p>

          <div className="mt-16 grid grid-cols-2 border-t border-gold/30 sm:grid-cols-3">
            {[
              { n: meta.total, label: "مشروعاً منجزاً" },
              { n: filters.industries.length, label: "قطاعاً" },
              ...(oldestYear
                ? [{ n: new Date().getFullYear() - oldestYear, label: "سنوات خبرة" }]
                : []),
            ].map((s, i) => (
              <div
                key={s.label}
                className={`px-4 pt-6 ${i > 0 ? "border-s border-ivory/10" : ""}`}
              >
                <b className="block font-display text-4xl font-extrabold">
                  <CountUp to={s.n} />
                </b>
                <span className="font-mono text-xs tracking-[0.1em] text-ivory/50">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── مشروع البطل ────────────────────────────────────── */}
      {hero && !isFiltered && (
        <Section tone="alt">
          <Reveal>
            <Link
              href={`/work/${hero.slug}`}
              className="group grid gap-10 md:grid-cols-2 md:items-center"
            >
              <div className="relative aspect-[4/3] overflow-hidden border border-border bg-gradient-to-br from-ink to-primary-900">
                {hero.coverImageUrl && (
                  <Image
                    src={hero.coverImageUrl}
                    alt={hero.coverImageAlt ?? hero.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-slow ease-out group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <div>
                <span className="font-mono text-xs tracking-[0.22em] text-gold-700">
                  مشروع مختار
                </span>
                <h2 className="mt-4 font-display text-3xl font-bold text-ink">
                  {hero.title}
                </h2>
                <p className="mt-4 text-ink-muted">{hero.summary}</p>
                {hero.metrics?.[0] && (
                  <div className="mt-8 flex items-baseline gap-3 border-s-2 border-gold ps-4">
                    <b className="font-display text-4xl font-extrabold text-primary">
                      {hero.metrics[0].value}
                      {hero.metrics[0].unit ?? ""}
                    </b>
                    <span className="text-sm text-ink-muted">
                      {hero.metrics[0].label}
                    </span>
                  </div>
                )}
                <span className="mt-8 inline-block font-mono text-sm text-primary transition-all duration-fast group-hover:me-2">
                  اقرأ القصة ←
                </span>
              </div>
            </Link>
          </Reveal>
        </Section>
      )}

      {/* ── الفلاتر ─────────────────────────────────────────── */}
      <WorkFilters filters={filters} current={sp} />

      {/* ── الشبكة ──────────────────────────────────────────── */}
      <Section tone="surface">
        {projects.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-2xl text-ink">
              {isFiltered ? "لا مشاريع تطابق هذه الفلاتر" : "لا مشاريع بعد"}
            </p>
            {isFiltered && (
              <Link
                href="/work"
                className="mt-4 inline-block font-mono text-sm text-primary underline-offset-4 hover:underline"
              >
                عرض كل الأعمال
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <Reveal key={p.id} as="div" delay={(i % 3) * 80}>
                  <WorkCard project={p} priority={i < 3} />
                </Reveal>
              ))}
            </div>

            {meta.totalPages > 1 && (
              <nav
                aria-label="ترقيم الصفحات"
                className="mt-16 flex justify-center gap-2"
              >
                {Array.from({ length: meta.totalPages }, (_, i) => {
                  const q = new URLSearchParams();
                  for (const [k, v] of Object.entries(sp)) {
                    if (v && k !== "page") q.set(k, v);
                  }
                  if (i > 0) q.set("page", String(i + 1));
                  const href = q.toString() ? `/work?${q}` : "/work";
                  const active = i + 1 === meta.page;
                  return (
                    <Link
                      key={i}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`grid h-10 w-10 place-items-center border font-mono text-sm transition-all duration-fast ${
                        active
                          ? "border-primary bg-primary text-fg-onPrimary"
                          : "border-border text-ink-muted hover:border-primary hover:text-primary"
                      }`}
                    >
                      {arabicDigits(i + 1)}
                    </Link>
                  );
                })}
              </nav>
            )}
          </>
        )}
      </Section>

      {/* ── العارض ──────────────────────────────────────────── */}
      {!isFiltered && <FeaturedCoverflow items={coverflowItems} />}

      {/* ── CTA ─────────────────────────────────────────────── */}
      <Section tone="ink">
        <Rule className="mb-12" />
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <SectionHeading
            eyebrow="الخطوة التالية"
            title="مشروعك القادم يبدأ بمحادثة"
            description="أخبرنا بالتحدّي، ونعود إليك بمسار عملي."
            onDark
          />
          <Link
            href="/contact"
            className="mb-16 inline-flex items-center gap-2 self-end border border-gold px-8 py-3 font-bold text-ivory transition-all duration-fast ease-out hover:bg-gold hover:text-ink"
          >
            ابدأ مشروعك ←
          </Link>
        </div>
      </Section>
    </main>
  );
}
