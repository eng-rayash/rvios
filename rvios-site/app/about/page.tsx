import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "من نحن — RVIOS Technologies | About Us",
  description:
    "RVIOS منصة متخصصة في تصميم وتطوير مواقع الويب وأنظمة وتطبيقات الويب والمتاجر الإلكترونية.",
};

const VALUES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    nameAr: "الابتكار",    nameEn: "Innovation",
    desc: "نبحث دائماً عن طرق وحلول مبتكرة لتجاوز التوقعات.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    nameAr: "الجودة",     nameEn: "Quality",
    desc: "كل مشروع نسلّمه يلبّي أعلى معايير الجودة والأداء.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
    nameAr: "الشفافية",   nameEn: "Transparency",
    desc: "تواصل مفتوح وصادق في كل مرحلة من مراحل المشروع.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    nameAr: "الشراكة",    nameEn: "Partnership",
    desc: "نبني علاقات شراكة حقيقية طويلة الأمد مع عملائنا.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    nameAr: "الكفاءة",    nameEn: "Efficiency",
    desc: "نسلّم مشاريع عالية الجودة في الوقت المحدد وبالميزانية المتفق عليها.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-ink text-ivory py-28 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="mx-auto max-w-4xl relative z-10">
          <span className="badge-en bg-primary/20 border-primary/30 text-primary mb-6">
            About — من نحن
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-ivory leading-tight mb-6">
            RVIOS Technologies
          </h1>
          <p className="font-body text-base sm:text-lg text-ivory/65 leading-relaxed max-w-2xl mb-4">
            منصة متخصصة في تصميم وتطوير مواقع الويب للشركات والأعمال — من تصميم التجربة وتطوير
            الموقع إلى الأنظمة والتطبيقات والمتاجر الإلكترونية والعناية المستمرة بعد الإطلاق.
          </p>
          <p className="font-body text-sm tracking-[0.12em] text-ivory/35 uppercase">
            A platform specialized in web design and development for businesses.
          </p>
        </div>
      </section>

      {/* ── Vision & Mission ── */}
      <section className="bg-surface py-20 px-6">
        <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-2">
          <div className="card p-8 border-r-4 border-primary">
            <span className="badge-en mb-4">Vision — الرؤية</span>
            <h2 className="font-display text-2xl text-ink mb-4">الرؤية</h2>
            <p className="font-body text-base leading-relaxed text-ink-muted">
              أن تجد كل شركة في RVIOS منصّتها لبناء حضور رقمي متكامل — موقع وأنظمة وتجربة
              تليق بعلامتها وتنمو معها.
            </p>
          </div>
          <div className="card p-8">
            <span className="badge-en mb-4">Mission — الرسالة</span>
            <h2 className="font-display text-2xl text-ink mb-4">الرسالة</h2>
            <p className="font-body text-base leading-relaxed text-ink-muted">
              نصمم ونطوّر مواقع وأنظمة ويب مخصصة تجمع بين تصميم يخدم الهدف وتقنية سريعة وآمنة،
              ونرافق عملاءنا بالعناية والتحسين بعد الإطلاق.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-surface-alt py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="badge-en mb-4">Our Values — قيمنا</span>
            <h2 className="font-display text-4xl text-ink">ما نؤمن به</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map((v) => (
              <div key={v.nameEn} className="card p-6 text-center group">
                <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center text-primary mx-auto mb-4 group-hover:bg-primary group-hover:text-ivory transition-all duration-300">
                  {v.icon}
                </div>
                <h3 className="font-display text-lg text-ink mb-1">{v.nameAr}</h3>
                <p className="font-body text-[0.65rem] tracking-[0.18em] uppercase text-primary/60 mb-3">{v.nameEn}</p>
                <p className="font-body text-xs leading-relaxed text-ink-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Overview ── */}
      <section className="bg-surface py-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <span className="badge-en mb-4">What We Do — ماذا نقدم</span>
          <h2 className="font-display text-4xl text-ink mb-4">كل ما يحتاجه موقعك</h2>
          <p className="font-body text-base text-ink-muted mb-10 max-w-xl mx-auto">
            من التصميم والتطوير إلى الإطلاق والعناية المستمرة — في مكان واحد.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {SERVICES.map((s) => (
              <span key={s.slug} className="font-body text-sm px-5 py-2.5 rounded-full bg-surface-alt border border-primary/15 text-ink font-bold">
                {s.nameAr}
              </span>
            ))}
          </div>
          <Link href="/services" className="btn-primary inline-flex px-8 py-4">
            استعرض خدماتنا
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
