import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "الأتمتة والذكاء الاصطناعي — AI & Automation | RVIOS",
  description: "AI Agents, ML Models, Chatbots, RPA, Data Analytics. حلول الذكاء الاصطناعي والأتمتة. RVIOS.",
};

const SUB_SERVICES = [
  {
    title: "وكلاء الذكاء الاصطناعي",
    en: "AI Agents & Assistants",
    desc: "بناء وكلاء ذكية تتفاعل مع مستخدميك وتُنجز مهام معقدة بشكل آلي ومستقل.",
    stack: ["LangChain", "OpenAI", "Gemini", "RAG Systems"],
  },
  {
    title: "أتمتة العمليات التجارية",
    en: "Business Process Automation",
    desc: "أتمتة المهام المتكررة في عملياتك لتوفير الوقت والموارد وتقليل الأخطاء البشرية.",
    stack: ["n8n", "Zapier", "Make", "Custom RPA"],
  },
  {
    title: "تحليل البيانات والذكاء",
    en: "Data Analytics & Intelligence",
    desc: "تحويل بياناتك الخام إلى رؤى قابلة للتنفيذ لاتخاذ قرارات أفضل وأسرع.",
    stack: ["Python", "Pandas", "Tableau", "Power BI"],
  },
  {
    title: "نماذج التعلم الآلي",
    en: "Machine Learning Models",
    desc: "بناء نماذج ML مخصصة للتصنيف، التنبؤ، وأتمتة القرارات في أعمالك.",
    stack: ["TensorFlow", "PyTorch", "Scikit-learn", "MLOps"],
  },
  {
    title: "شات بوت ذكي",
    en: "AI Chatbots",
    desc: "روبوتات محادثة ذكية لخدمة العملاء، الدعم الفني، والمبيعات على مدار الساعة.",
    stack: ["GPT-4", "Gemini Pro", "WhatsApp Bot", "Web Widget"],
  },
  {
    title: "معالجة الوثائق والنصوص",
    en: "Document Processing & OCR",
    desc: "استخراج وتحليل المعلومات من الوثائق والفواتير والتقارير بذكاء اصطناعي.",
    stack: ["OCR", "Document AI", "PDF Extraction", "NLP"],
  },
];

export default function AiAutomationPage() {
  return (
    <>
      <section className="bg-ink text-ivory py-28 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
        <div className="mx-auto max-w-4xl relative z-10">
          <span className="badge-en bg-primary/20 border-primary/30 text-primary mb-6">
            04 — AI & Automation
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-ivory leading-tight mb-5">
            الأتمتة
            <br />
            <span className="text-ivory/50">والذكاء الاصطناعي</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-ivory/65 leading-relaxed max-w-2xl mb-10">
            ندمج الذكاء الاصطناعي والأتمتة في قلب عملياتك لتقليل التكلفة وزيادة الكفاءة والإنتاجية —
            من وكلاء الذكاء الاصطناعي إلى تحليل البيانات وأتمتة سير العمل.
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
            <span className="badge-en mb-4">AI Services — خدمات الذكاء</span>
            <h2 className="font-display text-4xl text-ink">ماذا نبني بالذكاء الاصطناعي؟</h2>
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

      {/* Impact stats */}
      <section className="bg-ink py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-3xl text-ivory text-center mb-12">
            ما يمكن تحقيقه بالأتمتة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { val: "80%", label: "تخفيض في المهام اليدوية", en: "Reduction in manual tasks" },
              { val: "3x",  label: "زيادة إنتاجية الفريق",   en: "Team productivity boost" },
              { val: "24/7", label: "عمل مستمر بلا توقف",   en: "Non-stop operations" },
            ].map((s) => (
              <div key={s.label} className="py-6">
                <div className="font-display text-5xl text-primary mb-2">{s.val}</div>
                <p className="font-body text-sm text-ivory/80 font-bold">{s.label}</p>
                <p className="font-body text-xs tracking-wider text-ivory/35 uppercase mt-1">{s.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-20 px-6 text-center">
        <h2 className="font-display text-4xl text-ivory mb-4">جاهز لأتمتة أعمالك؟</h2>
        <p className="font-body text-base text-ivory/70 mb-8">Ready to automate your business?</p>
        <Link href="/contact" className="bg-ivory text-primary rounded-full px-8 py-4 font-body text-base font-bold hover:bg-ivory-soft transition-colors inline-block">
          تواصل معنا — Let&apos;s Automate
        </Link>
      </section>
    </>
  );
}
