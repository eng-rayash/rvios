import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "تصميم المنتجات وتجربة المستخدم — Product Design & UX | RVIOS",
  description:
    "نصمم واجهات وتجارب مستخدم استثنائية. UI/UX Design, Figma, Prototyping, Branding. RVIOS.",
};

const SUB_SERVICES = [
  {
    title: "تصميم واجهات المستخدم",
    en: "UI Design",
    desc: "واجهات بصرية جميلة وعصرية تعكس هوية علامتك التجارية وتشدّ انتباه المستخدمين.",
    stack: ["Figma", "Design Systems", "Responsive Design"],
  },
  {
    title: "تجربة المستخدم والبحث",
    en: "UX Research & Strategy",
    desc: "نفهم سلوك مستخدميك عبر البحث والتحليل لبناء تجربة تلبّي احتياجاتهم الحقيقية.",
    stack: ["User Research", "Wireframes", "User Testing"],
  },
  {
    title: "النماذج الأولية",
    en: "Prototyping",
    desc: "نماذج تفاعلية قابلة للاختبار تتيح لك رؤية المنتج وتجربته قبل التطوير.",
    stack: ["Interactive Prototypes", "Figma", "ProtoPie"],
  },
  {
    title: "أنظمة التصميم",
    en: "Design Systems",
    desc: "بناء مكتبة مكوّنات بصرية موحّدة تضمن الاتساق وتسرّع التطوير.",
    stack: ["Component Library", "Style Guide", "Tokens"],
  },
  {
    title: "الهوية البصرية والعلامة التجارية",
    en: "Brand Identity",
    desc: "تصميم هوية بصرية متكاملة تميّز علامتك وتترك انطباعاً لا يُنسى.",
    stack: ["Logo Design", "Brand Guidelines", "Color Systems"],
  },
  {
    title: "تصميم تطبيقات الموبايل",
    en: "Mobile App Design",
    desc: "تصاميم موبايل تراعي معايير iOS وAndroid وتوفر تجربة سلسة وممتعة.",
    stack: ["iOS Design", "Android Design", "Material Design"],
  },
];

export default function ProductDesignPage() {
  return (
    <>
      <section className="bg-surface-2 text-ivory py-28 px-6 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-4xl relative z-10">
          <span className="badge-en bg-primary/20 border-primary/30 text-primary mb-6">
            02 — Product Design & UX
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-ivory leading-tight mb-5">
            تصميم المنتجات
            <br />
            <span className="text-ivory/50">وتجربة المستخدم</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-ivory/65 leading-relaxed max-w-2xl mb-10">
            نصمم واجهات وتجارب مستخدم استثنائية تجمع الجمال بالوظيفة — من الفكرة والبحث إلى
            النموذج الأولي وأنظمة التصميم الكاملة.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary px-8 py-4">ابدأ مشروعك</Link>
            <Link href="/services" className="btn-outline-ivory px-8 py-4">باقي الخدمات</Link>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <span className="badge-en mb-4">What We Design — ماذا نصمم</span>
            <h2 className="font-display text-4xl text-ink">خدمات التصميم الشاملة</h2>
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

      {/* Design Process Banner */}
      <section className="bg-surface-alt py-16 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl text-ink mb-4">منهجية التصميم لدينا</h2>
          <p className="font-body text-base text-ink-muted mb-10">
            نتبع منهجية مدروسة تضمن أن كل قرار تصميمي مبني على بيانات حقيقية ويخدم أهداف أعمالك.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Discover", "Define", "Design", "Prototype", "Test", "Deliver"].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span className="font-body text-sm px-4 py-2 rounded-full bg-white border border-primary/20 text-primary font-bold shadow-sm">
                  {step}
                </span>
                {i < 5 && <span className="text-fg-muted text-xs">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-20 px-6 text-center">
        <h2 className="font-display text-4xl text-ivory mb-4">هل تريد تصميماً يبهر مستخدميك؟</h2>
        <p className="font-body text-base text-ivory/70 mb-8">Want a design that wows your users?</p>
        <Link href="/contact" className="bg-surface-1 text-primary rounded-full px-8 py-4 font-body text-base font-bold hover:bg-ivory-soft transition-colors inline-block">
          تواصل معنا — Let&apos;s Design Together
        </Link>
      </section>
    </>
  );
}
