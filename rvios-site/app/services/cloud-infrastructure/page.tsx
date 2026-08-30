import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "البنية التحتية السحابية — Cloud Infrastructure | RVIOS",
  description: "AWS, GCP, Azure, Docker, Kubernetes, CI/CD. بنية تحتية سحابية آمنة وقابلة للتوسع. RVIOS.",
};

const SUB_SERVICES = [
  {
    title: "الهجرة إلى السحابة",
    en: "Cloud Migration",
    desc: "ننقل بنيتك التحتية إلى السحابة بأمان مع ضمان استمرارية العمل وتقليل وقت التوقف.",
    stack: ["AWS", "GCP", "Azure", "Zero-downtime Migration"],
  },
  {
    title: "إعداد بيئات التطوير",
    en: "DevOps & CI/CD",
    desc: "خطوط نشر آلية تضمن نشر تحديثاتك بسرعة وثبات مع اختبار تلقائي شامل.",
    stack: ["GitHub Actions", "GitLab CI", "Docker", "Jenkins"],
  },
  {
    title: "الحاويات والتنسيق",
    en: "Containers & Orchestration",
    desc: "حلول Docker وKubernetes لنشر تطبيقاتك بشكل فعّال وقابل للتوسع.",
    stack: ["Docker", "Kubernetes", "Helm", "Container Registry"],
  },
  {
    title: "إدارة الخوادم والشبكات",
    en: "Server & Network Management",
    desc: "إعداد وتهيئة خوادم عالية الأداء مع بنية شبكة آمنة ومحمية.",
    stack: ["Linux", "Nginx", "Load Balancing", "VPN"],
  },
  {
    title: "المراقبة والأداء",
    en: "Monitoring & Performance",
    desc: "أنظمة مراقبة شاملة للتنبيه المبكر عن المشاكل وضمان أداء ثابت.",
    stack: ["Grafana", "Prometheus", "ELK Stack", "Uptime Monitoring"],
  },
  {
    title: "الأمن والامتثال",
    en: "Security & Compliance",
    desc: "تطبيق أفضل ممارسات الأمن السيبراني وحماية بياناتك وعملائك.",
    stack: ["SSL/TLS", "WAF", "IAM", "Security Audits"],
  },
];

export default function CloudInfrastructurePage() {
  return (
    <>
      <section className="bg-surface-2 text-ivory py-28 px-6 relative overflow-hidden">
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-4xl relative z-10">
          <span className="badge-en bg-primary/20 border-primary/30 text-primary mb-6">
            03 — Cloud Infrastructure
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-ivory leading-tight mb-5">
            البنية التحتية
            <br />
            <span className="text-ivory/50">السحابية</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-ivory/65 leading-relaxed max-w-2xl mb-10">
            نؤهّل بنيتك التقنية للعمل في السحابة بأعلى معايير الأمان والأداء — من الهجرة السحابية
            إلى إعداد CI/CD والمراقبة المستمرة.
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
            <span className="badge-en mb-4">Cloud Services — خدمات السحاب</span>
            <h2 className="font-display text-4xl text-ink">ماذا نبني في السحابة؟</h2>
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

      <section className="bg-surface-alt py-16 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl text-ink mb-8">مزودو السحابة الذين نعمل بهم</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Amazon AWS", "Google Cloud", "Microsoft Azure", "DigitalOcean", "Cloudflare", "Vercel"].map((p) => (
              <span key={p} className="font-body text-sm px-5 py-2.5 rounded-full bg-white border border-black/8 text-ink-muted shadow-sm">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-20 px-6 text-center">
        <h2 className="font-display text-4xl text-ivory mb-4">جاهز لبنية سحابية احترافية؟</h2>
        <p className="font-body text-base text-ivory/70 mb-8">Ready for professional cloud infrastructure?</p>
        <Link href="/contact" className="bg-surface-1 text-primary rounded-full px-8 py-4 font-body text-base font-bold hover:bg-ivory-soft transition-colors inline-block">
          تواصل معنا — Get a Free Audit
        </Link>
      </section>
    </>
  );
}
