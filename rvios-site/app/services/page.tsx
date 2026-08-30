import type { Metadata } from "next";
import Link from "next/link";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import SplitText from "@/components/SplitText";

export const metadata: Metadata = {
  title: "خدماتنا — RVIOS Technologies | Our Services",
  description:
    "تطوير البرمجيات، تصميم المنتجات، البنية السحابية، الذكاء الاصطناعي، والاستشارات التقنية. حلول رقمية متكاملة.",
};

const SERVICES = [
  {
    id: "01",
    href: "/services/software-development",
    nameAr: "تطوير البرمجيات والأنظمة",
    nameEn: "Software Development",
    descAr:
      "نبني تطبيقات ويب وموبايل وأنظمة ERP مخصصة تساعدك على إدارة عملياتك بكفاءة وتوسّع نطاق أعمالك بثقة.",
    icon: "code",
    tags: ["Web Apps", "Mobile", "ERP", "API", "Backend"],
  },
  {
    id: "02",
    href: "/services/product-design",
    nameAr: "تصميم المنتجات وتجربة المستخدم",
    nameEn: "Product Design & UX",
    descAr:
      "نصمم واجهات وتجارب مستخدم استثنائية تجمع الجمال بالوظيفة وتحوّل الزوار إلى عملاء مخلصين.",
    icon: "design",
    tags: ["UI/UX", "Figma", "Prototyping", "Design System", "Branding"],
  },
  {
    id: "03",
    href: "/services/cloud-infrastructure",
    nameAr: "البنية التحتية السحابية",
    nameEn: "Cloud Infrastructure",
    descAr:
      "نؤهّل بنيتك التحتية التقنية للعمل في السحابة بأعلى معايير الأمان والأداء والتوسّع.",
    icon: "cloud",
    tags: ["AWS", "GCP", "Azure", "Docker", "CI/CD", "DevOps"],
  },
  {
    id: "04",
    href: "/services/ai-automation",
    nameAr: "الأتمتة والذكاء الاصطناعي",
    nameEn: "Automation & AI",
    descAr:
      "ندمج الذكاء الاصطناعي والأتمتة في عملياتك لتقليل التكلفة وزيادة الكفاءة والإنتاجية بشكل ملموس.",
    icon: "ai",
    tags: ["AI Agents", "ML Models", "Chatbots", "RPA", "Data Analytics"],
  },
  {
    id: "05",
    href: "/services/consulting",
    nameAr: "الاستشارات التقنية والتحول الرقمي",
    nameEn: "Tech Consulting & Digital Transformation",
    descAr:
      "نرافقك في رحلة التحول الرقمي الكاملة — من التخطيط الاستراتيجي وتدقيق البنية التقنية إلى التنفيذ والقياس.",
    icon: "consulting",
    tags: ["Strategy", "Tech Audit", "Roadmap", "Training", "Change Mgmt"],
  },
];

const APPROACH = [
  {
    step: "01",
    title: "نستمع ونفهم",
    en: "We Listen & Understand",
    desc: "نبدأ بفهم عميق لأعمالك واحتياجاتك وأهدافك قبل اقتراح أي حل.",
  },
  {
    step: "02",
    title: "نصمم الحل",
    en: "We Design the Solution",
    desc: "نضع معمارية تقنية وخارطة طريق واضحة مع تحديد التقنيات والجداول الزمنية.",
  },
  {
    step: "03",
    title: "ننفّذ بدقة",
    en: "We Execute with Precision",
    desc: "فريقنا التقني يبني المشروع وفق أعلى معايير الجودة مع تحديثات منتظمة.",
  },
  {
    step: "04",
    title: "ندعم ونطوّر",
    en: "We Support & Evolve",
    desc: "بعد الإطلاق نواصل دعمك وتطوير المنتج ليواكب نمو أعمالك.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-surface-2 text-ivory py-28 px-6 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/12 blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-4xl relative z-10">
          <span className="badge-en mb-6 bg-primary/20 border-primary/30 text-primary">
            Our Services — خدماتنا
          </span>
          <div className="mb-6">
            <SplitText
              tag="h1"
              text="حلول تقنية متكاملة لأعمال أكثر ذكاءً"
              className="font-display text-5xl sm:text-6xl md:text-7xl text-ivory leading-tight"
              delay={70}
              duration={1}
              ease="power3.out"
              splitType="words"
              textAlign="start"
            />
          </div>
          <p className="font-body text-base sm:text-lg text-ivory/65 leading-relaxed max-w-2xl mb-10">
            نقدّم خدمات رقمية شاملة تبدأ من الفكرة الأولى وتصل إلى الإطلاق والدعم المستمر — شريكك
            التقني الاستراتيجي في كل مرحلة.
          </p>
          <Link href="/contact" className="btn-primary text-base px-8 py-4">
            ابدأ مشروعك الآن
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="bg-surface py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <ScrollStack useWindowScroll={true} itemDistance={50} itemStackDistance={20} baseScale={0.92} itemScale={0.02}>
            {SERVICES.map((s) => (
              <ScrollStackItem
                key={s.id}
                itemClassName="bg-surface-2 text-ivory border border-primary/30 hover:border-primary/60 transition-colors shadow-2xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 h-full">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-xl text-primary font-bold">{s.id}</span>
                      <span className="w-8 h-px bg-primary/40" />
                      <span className="font-body text-xs tracking-widest text-ivory/60 uppercase">{s.nameEn}</span>
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl text-ivory font-bold">{s.nameAr}</h3>
                    <p className="font-body text-base leading-relaxed text-ivory/80">{s.descAr}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {s.tags.map((tag) => (
                        <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="self-end md:self-center">
                    <Link
                      href={s.href}
                      className="btn-primary text-sm px-6 py-3.5 inline-flex items-center gap-2"
                    >
                      تفاصيل الخدمة — Details
                      <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </section>

      {/* ── Approach ── */}
      <section className="bg-surface-alt py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <span className="badge-en mb-4">Our Approach — منهجيتنا</span>
            <SplitText
              tag="h2"
              text="كيف نعمل معك؟"
              className="font-display text-4xl md:text-5xl text-ink"
              delay={60}
              duration={1}
              ease="power3.out"
              splitType="words"
              textAlign="center"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((a) => (
              <div key={a.step} className="card p-7">
                <div className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center mb-5">
                  <span className="font-display text-sm text-primary">{a.step}</span>
                </div>
                <h3 className="font-display text-xl text-ink mb-1">{a.title}</h3>
                <p className="font-body text-xs tracking-[0.18em] uppercase text-primary/50 mb-3">{a.en}</p>
                <p className="font-body text-sm leading-relaxed text-ink-muted">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary py-20 px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-4xl sm:text-5xl text-ivory mb-4">
            جاهز تبدأ مشروعك؟
          </h2>
          <p className="font-body text-base text-ivory/70 mb-8">
            Ready to start your project? Let&apos;s talk.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="bg-surface-1 text-primary rounded-full px-8 py-4 font-body text-base font-bold hover:bg-ivory-soft transition-colors">
              تواصل معنا — Contact Us
            </Link>
            <a
              href="https://wa.me/967739008083"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-ivory text-base px-8 py-4"
            >
              واتساب خدمة العملاء
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
