import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "الاستشارات التقنية والتحول الرقمي — Tech Consulting | RVIOS",
  description: "استشارات تقنية وتحول رقمي — استراتيجية، تدقيق تقني، خارطة طريق، تدريب. RVIOS.",
};

const SUB_SERVICES = [
  {
    title: "الاستراتيجية التقنية",
    en: "Technology Strategy",
    desc: "نضع استراتيجية تقنية شاملة تتوافق مع أهداف أعمالك وتضعك في موقع تنافسي قوي.",
    stack: ["Tech Roadmap", "Stack Selection", "Architecture Planning"],
  },
  {
    title: "التدقيق التقني والمراجعة",
    en: "Technical Audit & Review",
    desc: "مراجعة شاملة لبنيتك التقنية الحالية وتحديد نقاط الضعف وفرص التحسين.",
    stack: ["Code Review", "Architecture Audit", "Security Review"],
  },
  {
    title: "إدارة التحول الرقمي",
    en: "Digital Transformation Management",
    desc: "نرافقك في رحلة التحول الرقمي الكاملة — من التخطيط إلى التنفيذ وقياس النتائج.",
    stack: ["Change Management", "Digital Strategy", "KPI Tracking"],
  },
  {
    title: "تدريب الفرق التقنية",
    en: "Technical Team Training",
    desc: "برامج تدريبية مخصصة لرفع كفاءة فريقك التقني على أحدث التقنيات والممارسات.",
    stack: ["Workshops", "Mentoring", "Best Practices"],
  },
  {
    title: "اختيار الحلول التقنية",
    en: "Technology Selection",
    desc: "نساعدك في اختيار الأدوات والمنصات والحلول التقنية الأنسب لاحتياجاتك وميزانيتك.",
    stack: ["Vendor Assessment", "Proof of Concept", "Cost Analysis"],
  },
  {
    title: "مراجعة هيكل المنتج",
    en: "Product Architecture Review",
    desc: "مراجعة معمارية منتجك لضمان قابليته للتوسع والأمان والأداء على المدى البعيد.",
    stack: ["System Design", "Scalability Review", "DB Optimization"],
  },
];

const PROCESS = [
  { step: "01", ar: "التقييم",   en: "Assessment",    desc: "دراسة وضعك الحالي وتحديد الفجوات والفرص." },
  { step: "02", ar: "التوصيات", en: "Recommendations", desc: "تقرير تفصيلي بالتوصيات والأولويات." },
  { step: "03", ar: "خارطة الطريق", en: "Roadmap",   desc: "خطة عمل واضحة ومحددة بالزمن." },
  { step: "04", ar: "التنفيذ والمتابعة", en: "Execution & Follow-up", desc: "مرافقة أثناء التنفيذ وقياس النتائج." },
];

export default function ConsultingPage() {
  return (
    <>
      <section className="bg-surface-2 text-ivory py-28 px-6 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-4xl relative z-10">
          <span className="badge-en bg-primary/20 border-primary/30 text-primary mb-6">
            05 — Tech Consulting & Digital Transformation
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-ivory leading-tight mb-5">
            الاستشارات التقنية
            <br />
            <span className="text-ivory/50">والتحول الرقمي</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-ivory/65 leading-relaxed max-w-2xl mb-10">
            نرافقك في رحلة التحول الرقمي الكاملة — من التقييم والاستراتيجية إلى التنفيذ وقياس النتائج.
            شريكك الاستراتيجي لاتخاذ قرارات تقنية صحيحة.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary px-8 py-4">استشارة مجانية</Link>
            <Link href="/services" className="btn-outline-ivory px-8 py-4">باقي الخدمات</Link>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <span className="badge-en mb-4">Consulting Services — خدمات الاستشارات</span>
            <h2 className="font-display text-4xl text-ink">ماذا نقدّم لك؟</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SUB_SERVICES.map((s) => (
              <div key={s.title} className="card p-7">
                <h3 className="font-display text-xl text-ink mb-1">{s.title}</h3>
                <p className="font-body text-xs tracking-[0.18em] uppercase text-primary/60 mb-4">{s.en}</p>
                <p className="font-body text-sm leading-relaxed text-ink-muted mb-5">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.stack.map((t) => (
                    <span key={t} className="font-body text-[0.65rem] px-2.5 py-1 rounded-full bg-surface-alt text-ink-muted border border-black/6">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consulting Process */}
      <section className="bg-surface-alt py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="badge-en mb-4">Our Process — منهجيتنا</span>
            <h2 className="font-display text-4xl text-ink">كيف تسير الاستشارة؟</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p) => (
              <div key={p.step} className="card p-7 text-center">
                <div className="w-14 h-14 rounded-full border-2 border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-primary">{p.step}</span>
                </div>
                <h3 className="font-display text-lg text-ink mb-1">{p.ar}</h3>
                <p className="font-body text-xs tracking-wider uppercase text-primary/50 mb-3">{p.en}</p>
                <p className="font-body text-sm text-ink-muted leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free consultation CTA */}
      <section className="bg-primary py-20 px-6 text-center">
        <h2 className="font-display text-4xl text-ivory mb-4">استشارة أولية مجانية</h2>
        <p className="font-body text-base text-ivory/70 mb-3">
          نقدّم استشارة تقنية أولية مجانية لمدة 30 دقيقة لفهم احتياجاتك وتحديد الخطوات المقبلة.
        </p>
        <p className="font-body text-sm text-ivory/50 uppercase tracking-wider mb-8">
          Free 30-minute consultation — No commitment required
        </p>
        <Link href="/contact" className="bg-surface-1 text-primary rounded-full px-8 py-4 font-body text-base font-bold hover:bg-ivory-soft transition-colors inline-block">
          احجز استشارتك — Book Your Consultation
        </Link>
      </section>
    </>
  );
}
