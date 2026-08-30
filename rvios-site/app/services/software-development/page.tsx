import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "تطوير البرمجيات والأنظمة — Software Development | RVIOS",
  description:
    "نبني تطبيقات ومنصات رقمية مخصصة — Web, Mobile, ERP, API. فريق RVIOS التقني.",
};

const SUB_SERVICES = [
  {
    title: "تطبيقات الويب",
    en: "Web Applications",
    desc: "منصات SaaS، لوحات تحكم، متاجر إلكترونية، وتطبيقات ويب تفاعلية عالية الأداء.",
    stack: ["React", "Next.js", "Node.js", "PostgreSQL"],
  },
  {
    title: "تطبيقات الموبايل",
    en: "Mobile Applications",
    desc: "تطبيقات iOS وAndroid متكاملة باستخدام Flutter أو React Native مع تجربة مستخدم استثنائية.",
    stack: ["Flutter", "React Native", "Firebase", "REST API"],
  },
  {
    title: "أنظمة ERP والأعمال",
    en: "ERP & Business Systems",
    desc: "أنظمة إدارة متكاملة للموارد البشرية، المالية، المشاريع، والعمليات التشغيلية.",
    stack: ["Custom ERP", "Workflow Automation", "Multi-tenant"],
  },
  {
    title: "واجهات البرمجة والـ API",
    en: "APIs & Backend Systems",
    desc: "تصميم وبناء واجهات API قوية وآمنة تربط أنظمتك وتطبيقاتك المختلفة.",
    stack: ["REST API", "GraphQL", "Microservices", "WebSockets"],
  },
  {
    title: "قواعد البيانات والبنى",
    en: "Database Architecture",
    desc: "تصميم قواعد بيانات فعّالة وآمنة تدعم نمو أعمالك وتضمن سرعة الاستجابة.",
    stack: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
  },
  {
    title: "التحديث والهجرة",
    en: "Modernization & Migration",
    desc: "ترقية أنظمتك القديمة وهجرتها إلى تقنيات حديثة مع ضمان استمرارية العمل.",
    stack: ["Legacy Migration", "Refactoring", "Cloud Migration"],
  },
];

export default function SoftwareDevelopmentPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface-2 text-ivory py-28 px-6 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/12 blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-4xl relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="badge-en bg-primary/20 border-primary/30 text-primary">
              01 — Software Development
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-ivory leading-tight mb-5">
            تطوير البرمجيات
            <br />
            <span className="text-ivory/50">والأنظمة</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-ivory/65 leading-relaxed max-w-2xl mb-10">
            نبني تطبيقات ومنصات رقمية مخصصة تساعدك على إدارة عملياتك بكفاءة وتوسّع نطاق أعمالك بثقة —
            من تطبيقات الويب والموبايل إلى أنظمة ERP والبنى التحتية للبيانات.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary px-8 py-4">
              ابدأ مشروعك
            </Link>
            <Link href="/services" className="btn-outline-ivory px-8 py-4">
              باقي الخدمات
            </Link>
          </div>
        </div>
      </section>

      {/* Sub-services */}
      <section className="bg-surface py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <span className="badge-en mb-4">What We Build — ماذا نبني</span>
            <h2 className="font-display text-4xl text-ink">خدمات التطوير الشاملة</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SUB_SERVICES.map((s) => (
              <div key={s.title} className="card p-7">
                <h3 className="font-display text-xl text-ink mb-1">{s.title}</h3>
                <p className="font-body text-xs tracking-[0.18em] uppercase text-primary/60 mb-4">{s.en}</p>
                <p className="font-body text-sm leading-relaxed text-ink-muted mb-5">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.stack.map((t) => (
                    <span key={t} className="font-body text-[0.65rem] px-2.5 py-1 rounded-full bg-surface-alt text-ink-muted border border-black/6">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20 px-6 text-center">
        <h2 className="font-display text-4xl text-ivory mb-4">جاهز تبني نظامك الرقمي؟</h2>
        <p className="font-body text-base text-ivory/70 mb-8">Ready to build your digital system?</p>
        <Link href="/contact" className="bg-surface-1 text-primary rounded-full px-8 py-4 font-body text-base font-bold hover:bg-ivory-soft transition-colors inline-block">
          تواصل معنا — Let&apos;s Talk
        </Link>
      </section>
    </>
  );
}
