import Link from "next/link";
import MarqueeTicker from "@/components/MarqueeTicker";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, CountUp } from "@/components/ui/Reveal";
import { GlowCard, DrawRule } from "@/components/ui/Motion";
import { HeroTitle } from "@/components/ui/HeroTitle";

/* ─── البيانات ────────────────────────────────────────────── */

const SERVICES = [
  {
    id: "٠١",
    href: "/services/software-development",
    nameAr: "تطوير البرمجيات والأنظمة",
    nameEn: "Software Development",
    descAr:
      "نبني تطبيقات ومنصات رقمية مخصصة تساعدك على إدارة عملياتك بكفاءة وتوسّع نطاق أعمالك بثقة.",
    tags: ["Web Apps", "Mobile", "ERP", "API"],
  },
  {
    id: "٠٢",
    href: "/services/product-design",
    nameAr: "تصميم المنتجات وتجربة المستخدم",
    nameEn: "Product Design & UX",
    descAr:
      "نصمم واجهات وتجارب مستخدم استثنائية تجمع الجمال بالوظيفة وتحوّل الزوار إلى عملاء.",
    tags: ["UI/UX", "Figma", "Prototyping", "Branding"],
  },
  {
    id: "٠٣",
    href: "/services/cloud-infrastructure",
    nameAr: "البنية التحتية السحابية",
    nameEn: "Cloud Infrastructure",
    descAr:
      "نؤهّل بنيتك التحتية للعمل في السحابة بأعلى معايير الأمان والأداء والتوسّع.",
    tags: ["AWS", "GCP", "Docker", "DevOps"],
  },
  {
    id: "٠٤",
    href: "/services/ai-automation",
    nameAr: "الأتمتة والذكاء الاصطناعي",
    nameEn: "Automation & AI",
    descAr:
      "ندمج الذكاء الاصطناعي والأتمتة في عملياتك لتقليل التكلفة وزيادة الكفاءة والإنتاجية.",
    tags: ["AI Agents", "ML", "Workflows", "Chatbots"],
  },
  {
    id: "٠٥",
    href: "/services/consulting",
    nameAr: "الاستشارات التقنية والتحول الرقمي",
    nameEn: "Tech Consulting",
    descAr:
      "نرافقك في رحلة التحول الرقمي الكاملة — من التخطيط الاستراتيجي إلى التنفيذ والقياس.",
    tags: ["Strategy", "Audit", "Roadmap", "Training"],
  },
];

const PILLARS = [
  {
    titleAr: "جودة بلا تنازل",
    titleEn: "Uncompromising Quality",
    descAr: "كل سطر كود نكتبه، وكل تصميم ننجزه، يخضع لمعايير جودة صارمة.",
  },
  {
    titleAr: "تسليم سريع وموثوق",
    titleEn: "Fast & Reliable Delivery",
    descAr: "نلتزم بالمواعيد ونسلّم مشاريع مكتملة تتجاوز التوقعات.",
  },
  {
    titleAr: "شراكة حقيقية",
    titleEn: "True Partnership",
    descAr: "لسنا مجرد مزوّد خدمة، نحن شريكك التقني الاستراتيجي على المدى البعيد.",
  },
  {
    titleAr: "حلول مخصصة",
    titleEn: "Tailored Solutions",
    descAr: "لا نقدّم حلولاً جاهزة — كل مشروع يُصمَّم من الصفر ليناسب احتياجاتك.",
  },
];

const PROCESS = [
  { step: "٠١", ar: "نستمع", en: "We Listen", desc: "نفهم احتياجاتك وأهدافك بعمق قبل أي خطوة." },
  { step: "٠٢", ar: "نخطط", en: "We Plan", desc: "نضع خارطة طريق تقنية واستراتيجية دقيقة." },
  { step: "٠٣", ar: "نبني", en: "We Build", desc: "ننفّذ المشروع بأعلى معايير الجودة." },
  { step: "٠٤", ar: "ندعم", en: "We Support", desc: "نواصل دعمك وتطوير المنتج بعد الإطلاق." },
];

const STATS = [
  { end: 50, suffix: "+", label: "مشروع منجز", en: "Projects Delivered" },
  { end: 5, suffix: "+", label: "سنوات خبرة", en: "Years of Experience" },
  { end: 100, suffix: "%", label: "رضا العملاء", en: "Client Satisfaction" },
];

/* ─── الصفحة ──────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      {/* ═══════════ الواجهة ═══════════ */}
      <section className="relative flex min-h-[86vh] items-center overflow-hidden">
        {/* توهّج خافت من التوكنز — بديل خلفية WebGL. طبقة رسم واحدة ثابتة. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 0%, rgb(var(--color-primary-500-ch) / 0.13), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-l from-transparent via-gold/40 to-transparent"
        />

        <div className="mx-auto w-[min(100%-3rem,1200px)] py-24">
          <div className="max-w-4xl">
            <Reveal>
              <span className="badge-en mb-8">RVIOS Technologies</span>
            </Reveal>

            <HeroTitle
              text="نبني أنظمة رقمية تدفع نمو أعمالك"
              className="font-display text-4xl font-bold leading-tight -tracking-[0.02em] text-fg sm:text-5xl"
              delay={120}
            />

            <p className="mt-6 max-w-2xl font-body text-lg leading-normal text-fg-muted">
              من تطوير البرمجيات إلى الذكاء الاصطناعي والاستشارات التقنية — نحن
              شريكك في التحول الرقمي.
            </p>

            <p className="mt-3 font-mono text-xs uppercase tracking-[0.22em] text-ink-300">
              We build digital systems that drive growth
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/contact" className="btn-primary">
                ابدأ مشروعك
                <span aria-hidden>←</span>
              </Link>
              <Link href="/work" className="btn-outline">
                شاهد أعمالنا
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ شريط التقنيات ═══════════ */}
      <MarqueeTicker />

      {/* ═══════════ الخدمات — صفوف تحريرية مرقّمة ═══════════ */}
      <Section id="services" tone="surface">
        <SectionHeading
          eyebrow="Our Services"
          title="حلول تقنية متكاملة لكل مرحلة من مشروعك"
          description="نقدّم خدمات رقمية شاملة تبدأ من الفكرة وتصل إلى الإطلاق والدعم المستمر."
        />

        <ul className="border-t border-border-subtle">
          {SERVICES.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 60}>
              <GlowCard>
                <Link
                  href={s.href}
                  className="group grid gap-4 border-b border-border-subtle py-10 transition-colors duration-base md:grid-cols-[auto_1fr_auto] md:items-baseline md:gap-10"
                >
                  <span className="font-display text-3xl font-bold text-border-strong transition-colors duration-base group-hover:text-primary">
                    {s.id}
                  </span>

                  <div>
                    <h3 className="font-display text-xl font-bold text-fg transition-colors duration-base group-hover:text-gold">
                      {s.nameAr}
                    </h3>
                    <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-ink-300">
                      {s.nameEn}
                    </p>
                    <p className="mt-4 max-w-2xl font-body text-base leading-normal text-fg-muted">
                      {s.descAr}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="border border-border-default px-2 py-[3px] font-mono text-[11px] text-fg-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span
                    aria-hidden
                    className="font-mono text-sm text-fg-muted transition-transform duration-base ease-out group-hover:-translate-x-1 group-hover:text-gold"
                  >
                    ←
                  </span>
                </Link>
              </GlowCard>
            </Reveal>
          ))}
        </ul>

        <div className="mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-mono text-sm text-gold transition-colors hover:text-gold-700"
          >
            استعرض جميع الخدمات <span aria-hidden>←</span>
          </Link>
        </div>
      </Section>

      {/* ═══════════ الأرقام ═══════════ */}
      <Section tone="alt">
        <div className="grid gap-12 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="text-center">
                <div className="font-display text-4xl font-bold leading-tight text-fg sm:text-5xl">
                  <CountUp to={stat.end} suffix={stat.suffix} />
                </div>
                <DrawRule className="mx-auto mt-4 w-16" />
                <p className="mt-4 font-body text-base font-bold text-fg">{stat.label}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-ink-300">
                  {stat.en}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ═══════════ لماذا نحن ═══════════ */}
      <Section tone="surface">
        <SectionHeading eyebrow="Why RVIOS" title="ما يميّزنا عن غيرنا" align="center" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.titleEn} delay={i * 60}>
              <GlowCard className="card h-full p-7">
                <h3 className="font-display text-lg font-bold text-fg">{p.titleAr}</h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
                  {p.titleEn}
                </p>
                <p className="mt-4 font-body text-sm leading-normal text-fg-muted">
                  {p.descAr}
                </p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ═══════════ المنهجية ═══════════ */}
      <Section tone="alt">
        <SectionHeading
          eyebrow="How We Work"
          title="من الفكرة إلى الإطلاق"
          description="منهجية عمل واضحة ومثبتة تضمن تسليم مشروعك في الوقت والميزانية المحددة."
          align="center"
        />

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p, i) => (
            <Reveal as="li" key={p.step} delay={i * 60}>
              <GlowCard className="card h-full p-7">
                <span className="font-display text-2xl font-bold text-primary">{p.step}</span>
                <DrawRule className="mt-4 w-full" />
                <h3 className="mt-5 font-display text-lg font-bold text-fg">{p.ar}</h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-300">
                  {p.en}
                </p>
                <p className="mt-3 font-body text-sm leading-normal text-fg-muted">{p.desc}</p>
              </GlowCard>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ═══════════ الدعوة ═══════════ */}
      <section className="relative overflow-hidden border-t border-border-subtle py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 100% at 50% 100%, rgb(var(--color-primary-500-ch) / 0.12), transparent 70%)",
          }}
        />

        <div className="mx-auto w-[min(100%-3rem,1200px)] text-center">
          <Reveal>
            <span className="badge-en mb-8 justify-center">Start Your Project</span>
            <h2 className="font-display text-3xl font-bold -tracking-[0.01em] text-fg sm:text-4xl">
              هل لديك مشروع تقني؟
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-body text-lg leading-normal text-fg-muted">
              تواصل معنا اليوم ونبدأ العمل معاً على تحويل فكرتك إلى واقع رقمي مؤثر.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary">
                ابدأ الآن <span aria-hidden>←</span>
              </Link>
              <a
                href="https://wa.me/967739008083"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                واتساب خدمة العملاء
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
